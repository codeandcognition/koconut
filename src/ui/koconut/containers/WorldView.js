// @flow
import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import {conceptInventory} from '../../../data/ConceptMap.js';
import ConceptCard from './../components/ConceptCard';
import {t} from '../../../data/ConceptAbbreviations';
import Routes from './../../../Routes';
import LoadingView from './../components/LoadingView';
// import { ReactCytoscape } from 'react-cytoscape';

import './WorldView.css';

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
cytoscape.use( dagre );

type Props = {
	setFirebaseUser: Function,
	generateExercise: Function,
	getInstruction: Function
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
      didRender: false
		}

		this.hierarchyContainer = React.createRef();
	}

	/**
	 * Returns sorted concepts list sorted by relevance to the user.
	 * Only includes concepts where concept.teach is true and concept.container
	 * is false
	 * @returns {Array.<*>}
	 */
	getOrderedConcepts(): ConceptKnowledge[] {
		return MasteryModel.model.filter((concept) => concept.should_teach && concept.container).sort(
				(a, b) => (b.dependencyKnowledge / b.knowledge -
						a.dependencyKnowledge / a.knowledge));
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

  componentDidUpdate() {

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
				});
			}
		}) : null;
	}

	renderCytoscape() {
    let conceptList = this.getOrderedConcepts(); // TODO: Change this to
    // reference prop when merged with summer2018-master
    let nodesArr = [];
    let edgesArr = [];

    conceptList.forEach((concept) => {
      let conceptName = this.formatCamelCasedString(concept.name);
      let node = {
        data : {
          id: conceptName
        },
        grabbable: false
      };
      nodesArr.push(node);
      concept.dependencies.forEach((dependency) => {
        let dependencyName = this.formatCamelCasedString(dependency.name);
        let edge = {
          data: {
            source: dependencyName,
            target: conceptName
          }
        }
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
          'content': 'data(id)',
          'shape': 'roundrectangle',
          'font-size': '20px',
          'text-valign': 'center',
          'color': 'black',
          'text-halign': 'center',
          'background-color': 'lightgray',
          'width': '200px',
          'height': "100px"
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'width': 4,
          'target-arrow-shape': 'triangle',
          'line-color': '#9dbaea',
          'target-arrow-color': '#9dbaea',
          'display': 'none'
        }
      }
    ]

    let cytoLayout = {name: "dagre"};

    let cytoOptions = {
      panningEnabled: false,
      zoomingEnabled: false
    }


    var cy = cytoscape({
      container: this.hierarchyContainer.current,
      style: cytoStyle,
      elements: cytoEl,
      layout: cytoLayout
    });
    cy.panningEnabled(false);
    cy.zoomingEnabled(false);
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

	renderWorld() {
	  if (this.hierarchyContainer.current != undefined) {
	    console.log("this is running");
	    this.renderCytoscape();
    } else {
	    this.forceUpdate();
    }

		return (
				<div ref={this.hierarchyContainer} id={"hierarchy-container"}>

				</div>
		)
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
