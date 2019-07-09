// @flow
import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import Routes from './../../../Routes';
import LoadingView from './../components/LoadingView';
import SideNavigation from './../components/SideNavigation';
import './WorldView.css';
import cytoscape from 'cytoscape';
import firebase from 'firebase';
import dagre from 'cytoscape-dagre';
cytoscape.use( dagre );

type Props = {
	setFirebaseUser: Function,
	generateExercise: Function,
	getInstruction: Function,
	exercisesList: any,
	conceptMapGetter: any,
	getOrderedConcepts: Function,
  goToExercise: Function,
  exerciseRecommendations: any,
  instructionReccomendations: any,
};

/**
 * WorldView is the world view for the app, where the user can see all the
 * exercises they can do and are suggested to do
 * @class
 */
class WorldView extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			loading: true,
      didRender: false,
      conceptDescriptions: {},
      instructionsRead: {}
		};
    this.hierarchyContainer = React.createRef();
    this.closeConcept = this.closeConcept.bind(this);
	}

  /**
   * getConceptsByType takes the orderedConcepts and then grabs only the ones with the 
   * specified type
   * @param {Array.<*>} orderedConcepts concepts from getOrderedConcepts();
   * @param {string} type type to filter by
   */
  getConceptsByType(orderedConcepts: ConceptKnowledge[], type: string) {
    return orderedConcepts.filter(concept => {
      return concept.type === type;
    })
  }

  componentWillMount() {
    this.getConceptShortDescriptions();
  }

  componentWillReceiveProps(nextProps: Props) {
		this.props = nextProps;
	}

  componentDidMount() {
  	this.mounted = true;
  	this.authUnsub = this.props.firebase ? this.props.firebase.auth().onAuthStateChanged(user => {
  		if (this.mounted) {
				this.setState({loading: true}, () => {
					if (!user) {
						this.props.history.push(Routes.signin);
					}
					this.checkWaiverStatus(user);
          this.props.firebase.database().ref(`/Users/${user.uid}/Data/InstructionsRead`).on('value', (snap) => {
            this.setState({instructionsRead: snap.val()}); // this may not be correct (should use filterCompletedInstructions() from queryCompleted.js), but also couldn't get this code to trigger...
          })
				});
			}
		}) : null;
    window.scrollTo(0, 0);
	}

  /**
   * This function renders the world view UI.
   */
	renderCytoscape() {
		let conceptList = this.props.getOrderedConcepts();
    let nodesArr = [];
    let edgesArr = [];

    conceptList.forEach((concept) => {
      let conceptName = this.formatCamelCasedString(concept.name); // TODO: don't do this conversion manually
      let node = {
        data : {
					id: concept.name,
          name: conceptName,
          content: conceptName + "\n\n" + this.state.conceptDescriptions[concept.name]
        },
        grabbable: false
      };
      nodesArr.push(node);
      concept.dependencies.forEach((dependency) => {
        let edge = {
          data: {
            source: dependency.name,
            target: concept.name
          }
        };
        edgesArr.push(edge);
      });
    });

    let cytoEl = {
      nodes: nodesArr,
      edges: edgesArr,
    };

    let cytoStyle = [
      {
        selector: 'node',
        style: {
          'content': 'data(content)',
          'text-wrap': 'wrap',
          'text-max-width': '243px',
          'shape': 'roundrectangle',
          'font-size': '20px',
          'text-valign': 'center',
          'color': 'black',
          'text-halign': 'center',
          'background-color': 'lightgray',
          'width': '250px',
          'height': "150px"
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'width': 4,
          'target-arrow-shape': 'triangle',
          'line-color': '#9dbaea',
          'target-arrow-color': '#9dbaea'
        }
      },
      {
        selector: '.hidden',
        style: {
          "visibility": "hidden"
        }
      },
      {
        selector: '.nodeHovered',
        style: {
          "background-color":"darkgrey"
        }
      }
    ];
    let cytoLayout = {name: "dagre"};

    let cy = cytoscape({
      container: this.hierarchyContainer.current,
      elements: cytoEl,
      style: cytoStyle,
      layout: cytoLayout
    });
    cy.panningEnabled(false);
    cy.zoomingEnabled(false);

    cy.on('mousedown', (evt) => {
    	let node = evt.target["_private"]["data"];
    	if (evt.target["_private"].group === "nodes") {
				let name = node["name"];
        let conceptCode = node["id"];
        this.closeConcept();
				this.expandConcept(name, conceptCode);
			}
		});


    cy.on('mouseover', 'node', function(evt) {
      let nodes = cy.nodes();
      let edges = cy.edges();
      let relatedEdges = nodes.edgesWith("#" + this.id());
      relatedEdges = Object.values(relatedEdges);
      edges.forEach((edge) => {
        if (!relatedEdges.includes(edge)) {
          edge.addClass("hidden");
        }
      });
      document.getElementById("hierarchy-container").style.cursor = "pointer"
      this.addClass("nodeHovered");
    });
    cy.on('mouseout', 'node', function(evt) {
      let nodes = cy.nodes();
      let edges = cy.edges();
      let relatedEdges = nodes.edgesWith("#" + this.id());
      relatedEdges = Object.values(relatedEdges);
      edges.forEach((edge) => {
        if (!relatedEdges.includes(edge)) {
          edge.removeClass("hidden");
        }
      });
      document.getElementById("hierarchy-container").style.cursor = "default"
      this.removeClass("nodeHovered");
    });
  }

	/**
	 * Function to ensure that learner can't change the route to get to the world view
	 * @param user
	 */
	checkWaiverStatus(user) {
		let databaseRef = this.props.firebase.database().ref("Users/" + user.uid + "/waiverStatus");
		databaseRef.once("value", (snapshot) => {
			if (snapshot == null || !snapshot.val()) {
				this.props.history.push(Routes.welcome);
			} else {
				if (this.mounted) {
					this.setState({loading: false});
				}
			}
		})
	}

	componentWillUnmount() {
  	// unlisten for auth changes
    if (this.authUnsub) {
		  this.authUnsub();
    }
		this.mounted = false;
	}

	expandConcept(name, conceptCode) {
		this.setState({
			conceptDialog: true,
			title: name,
			conceptCode: conceptCode
		});
  }
  
  closeConcept() {
    this.setState({
      conceptDialog: false,
      title: "",
      conceptCode: ""
    });
  }

	getConceptShortDescriptions() {
	  let databaseRef = firebase.database().ref("ConceptShortDescriptions");
    let componentRef = this;
	  databaseRef.on("value", function(snapshot) {
	    if (snapshot && snapshot.val()) {
        componentRef.setState({
          conceptDescriptions: snapshot.val()
        });
      }
    });
  }

  /**
   * This function takes in a camel cased string and converts it to normal
   * text with the first letter of every word being capitalized.
   * @param camelString
   * @returns {string}
   */
  formatCamelCasedString(camelString: string) {
    let result = "";
    if (camelString && camelString.length !== 0) {
      result = result + camelString.charAt(0).toUpperCase();
      for (let i = 1; i < camelString.length; i++) {
        if (camelString.charAt(i) === camelString.charAt(i).toUpperCase()) {
          result = result + " "
        }
        result = result + camelString.charAt(i);
      }
    }
    return result;
  }

  getOrderedConcepts(): ConceptKnowledge[] {
    return MasteryModel.model.filter((concept) => concept.should_teach).sort(
        (a, b) => (b.dependencyKnowledge / b.knowledge -
            a.dependencyKnowledge / a.knowledge));
  }

  renderSidebar() {
    return (
      <SideNavigation title={this.state.title}
        conceptCode={this.state.conceptCode}
        defaultOpen={["READ", "WRITE"]}
        closeMenu={this.closeConcept}
        instructionsMap={this.props.instructionsMap}
        generateExercise={this.props.generateExercise}
        getInstruction={this.props.getInstruction}
        exercisesList={this.props.exercisesList}
        conceptMapGetter={this.props.conceptMapGetter}
        getOrderedConcepts={this.props.getOrderedConcepts}
        goToExercise={this.props.goToExercise}
        persist={false} 
        exerciseRecommendations={this.props.exerciseRecommendations} 
        instructionRecommendations={this.props.instructionRecommendations}
        userBKTParams={this.props.userBKTParams} 
        instructionsRead={this.props.instructionsRead} 
        exercisesCompleted={this.props.exercisesCompleted}/>
    );
  }

	renderWorld() {
    if (this.hierarchyContainer.current) {
      this.renderCytoscape();
    } else {
      this.forceUpdate();
    }
		return (
				<div>
					{this.state.conceptDialog && this.renderSidebar() }
          <div ref={this.hierarchyContainer} id={"hierarchy-container"}/>
				</div>
		);

	}

  render() {
    return (
			<div className={"world-container"}>
				{this.state.loading ?
						<LoadingView/> :
						this.renderWorld()
				}
			</div>
		);
	}
}

export default withRouter(WorldView);
