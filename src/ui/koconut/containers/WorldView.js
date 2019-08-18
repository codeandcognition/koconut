// @flow
import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import Routes from './../../../Routes';
import LoadingView from './../components/LoadingView';
import SideNavigation from './../components/SideNavigation';
import './WorldView.css';
import cytoscape from 'cytoscape';
import firebase from 'firebase/app';
import dagre from 'cytoscape-dagre';
import { formatCamelCasedString } from './../../../utils/formatCamelCasedString';
import _ from 'lodash';
import { CONDITIONS } from '../../../utils/Conditions';

cytoscape.use( dagre ); // layout for directed acyclic graph: https://github.com/cytoscape/cytoscape.js-dagre

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
  userCondition: string,
  exerciseConceptMap: Object
};

const REC_STYLE = {'border-width': '6px', 'border-color': '#4054B2', 'border-style': 'solid'};
const CENTER_STYLE = {'textAlign': 'center', 'padding': '100px'};

const HOW_CODE_RUNS = "howCodeRuns";

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
      instructionsRead: {},
      recommendedConcepts: [], // concepts which have recommended content
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

  /**
   * update state.recommendedConcepts with list of concepts which have recommended exercises
   */
  findRecommendedConcepts(callback=null){
    let recConcepts = [];
    if(this.props.exerciseConceptMap && Object.keys(this.props.exerciseConceptMap).length>0) {
      for(let eid in this.props.exerciseRecommendations) {
        if(Object.keys(this.props.exerciseConceptMap).includes(eid)) {
          let concept = this.props.exerciseConceptMap[eid];
          if(!recConcepts.includes(concept)){
            recConcepts.push(concept);
          }
        }
      }
    }
    this.setState({recommendedConcepts: recConcepts}, callback);
  }

  componentWillMount() {
    this.getConceptShortDescriptions();
  }

  componentWillReceiveProps(nextProps: Props) {
		this.props = nextProps;
	}

  componentDidMount() {
    sessionStorage.removeItem('exerciseId'); // remove exercise id if in world view
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
          });
          this.findRecommendedConcepts(this.setSideNavigationForC2);
				});
			}
    }) : null;
    window.scrollTo(0, 0);
    sessionStorage.removeItem('exerciseId'); // remove exercise id if in world view
	}

  /*
   * This function renders the world view UI.
   */
	renderCytoscape() {
		let conceptList = this.props.getOrderedConcepts();
    let nodesArr = [];
    let edgesArr = [];

    conceptList.forEach((concept) => {
      let conceptName = formatCamelCasedString(concept.name);
      let node = {
        data : {
					id: concept.name,
          name: conceptName,
          content: conceptName.toUpperCase() + "\n\n" + 
            (typeof(this.state.conceptDescriptions[concept.name]) === 'string' ? this.state.conceptDescriptions[concept.name].toLowerCase() : "")
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
          'text-max-width': '350px',
          'shape': 'roundrectangle',
          'font-size': '32px',
          'text-valign': 'center',
          'color': 'black',
          'text-halign': 'center',
          'background-color': 'lightgray',
          'width': '360px',
          'height': "200px",
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'width': 4,
          'target-arrow-shape': 'triangle',
          'line-color': 'lightslategray',
          'target-arrow-color': 'lightslategray'
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

    // styling for recommended concepts
    if(this.state.userCondition == CONDITIONS.E1) {
      this.state.recommendedConcepts.forEach( concept => cy.getElementById(concept).style(REC_STYLE));
    }

    cy.panningEnabled(true);
    cy.zoomingEnabled(true);
    cy.minZoom(0.25);
    cy.maxZoom(5.0);


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
   * For C2 conditions, open side nav by calling expandConcept() for recommended exercise or "howCodeRuns" if nothing has ever been explored
   * Assumes props.exerciseRecommendations has at least 1 recommendation
   */
  setSideNavigationForC2() {
    let conceptName, conceptCode;

    if(this.determineIfAnythingDone() && Object.keys(this.props.exerciseRecommendations).length > 0) {
      // expand concept for recommended exercise
      conceptCode = this.props.exerciseConceptMap[Object.keys(this.props.exerciseRecommendations)[0]];
      conceptName = formatCamelCasedString(conceptCode);
    } else {
      console.log("No recommendation available in world view. Going to default");
      // expand how code runs
      conceptCode = HOW_CODE_RUNS;
      conceptName = formatCamelCasedString(conceptCode);
    }
    this.expandConcept(conceptName, conceptCode);
  }

  /**
	 * returns true if users has viewed any instruction or gotten any exercise correct, false otherwise
	 */
	determineIfAnythingDone() {
    // props.exercisesCompleted is by default object with concept codes as keys as arrays (with exercise ids of completed exercises) as default
    let anyExerciseCorrect = (this.props.exercisesCompleted &&
      Object.keys(this.props.exercisesCompleted).filter(conceptCode => (
      Array.isArray(this.props.exercisesCompleted[conceptCode]) && this.props.exercisesCompleted[conceptCode].length>0)).length > 0);

    let anyInstructionRead = !_.isEmpty(this.props.instructionsRead);
    
		return (anyExerciseCorrect || anyInstructionRead);
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
        defaultOpen={["OVERVIEW", "READ", "WRITE"]}
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
        exercisesCompleted={this.props.exercisesCompleted}
        selectedIndex={this.props.selectedIndex}
        userCondition={this.props.userCondition}
        switchToWorldView={this.props.switchToWorldView}
        exerciseConceptMap={this.props.exerciseConceptMap}
        />
    );
  }

	renderWorld() {
    if(this.props.userCondition !== CONDITIONS.C2){
      if (this.hierarchyContainer.current) {
        this.renderCytoscape();
      } else {
        this.forceUpdate(); // TODO: this rerenders world view multiple times. Need to figure out why this is necessary.
      }
    }
		return (
				<div>
					{this.state.conceptDialog && this.renderSidebar() }
          {this.props.userCondition !== CONDITIONS.C2
            ? <div ref={this.hierarchyContainer} id={"hierarchy-container"} />
            : 
            <div style={CENTER_STYLE}>
              <p><i className="fa fa-chevron-left" aria-hidden="true"></i><i>Use the navigation bar on the left to continue learning!</i></p>
            </div>
          }
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
