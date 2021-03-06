import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import firebase from 'firebase/app';
import "./AllExercises.css";
import {ConceptKnowledge} from '../../../data/MasteryModel';
import {t} from '../../../data/ConceptAbbreviations';
import ExerciseTypes from '../../../data/ExerciseTypes.js';
import LoadingView from './../components/LoadingView';
import { formatCamelCasedString } from './../../../utils/formatCamelCasedString';

import ExerciseInfoContainer from './../components/ExerciseInfoContainer';
import { write } from 'fs';

class AllExercises extends Component {
	constructor(props) {
		super(props);
		this.loading = true;
		this.state = {
			allExercises: [],
      conceptExerciseMap: {}
		}
	}

	componentDidMount() {
		this.getAllExercises();
		this.getConceptLists();
	}

	getAllExercises() {
	  let componentRef = this;
		let databaseRef = firebase.database().ref("Exercises");
		databaseRef.on("value", function(snapshot) {
		  let exercises = snapshot.val();
			componentRef.setState({
				allExercises: exercises
			}, () => {
				componentRef.loading = false;
			});
		});
	}

	getConceptLists() {
	  let componentRef = this;
	  let databaseRef = firebase.database().ref("ConceptExerciseMap");
	  databaseRef.on("value", function(snapshot) {
	    componentRef.setState({
        conceptExerciseMap: snapshot.val()
      })
    });
  }

  getConceptsByType(orderedConcepts: ConceptKnowledge[], type: string) {
    return orderedConcepts.filter(concept => {
      return concept.type === type;
    })
  }


  getExercisesByTypeAndConcept(exerciseType: string,
                               concept: string,
                               exerciseList: any, // calm down flow jeez
                               conceptMapGetter: any): any { // made conceptMapGetter an any type to stop flow's anger
    // TODO: Address the isReadType issue, can the type just be brought out?
    // what happens if there are more than 1 type?

    let results = [];
    let exerciseIds = [];
    if (exerciseList && conceptMapGetter && conceptMapGetter[concept]) {
      let readExercises = conceptMapGetter[concept]["READ"];
      let writeExercises = conceptMapGetter[concept]["WRITE"];

      if (readExercises) {
        readExercises.forEach((exerciseId) => {
          results.push(exerciseList[exerciseId]);
          exerciseIds.push(exerciseId);
        });
      }
      if (writeExercises) {
        writeExercises.forEach((exerciseId) => {
          results.push(exerciseList[exerciseId]);
          exerciseIds.push(exerciseId);
        });
      }
    }
    return {results, exerciseIds};
	}

	displaySpinner() {
		return <LoadingView/>
	}

	render() {
    let sections = [
      {name: t.onboarding, title: "Getting Started"},
      {name: t.semantic, title: "Building Blocks"},
      {name: t.template, title: "Templates"}
    ];

    let conceptList = this.props.getOrderedConcepts();
    return (
        <div className={"container"}>
          <h1>Koconut Exercises</h1>
          {this.loading ? this.displaySpinner() : sections.map((item, index) => {
            let section = t[item.name];
              return (
                <div className={"section"} key={index}>
                  <h3>{item.title}</h3>
                  {this.getConceptsByType(conceptList, section).map((concept, index2) => {
                    return (
                      <div key={index2}>
                        <h5 className={"section-heading"}>{this.formatCamelCasedString(
                            concept.name)}</h5>
                        <p className={"section-subheading"}>READ TYPES</p>
                        {this.getExercisesByTypeAndConcept("READ", concept.name, this.state.allExercises, this.state.conceptExerciseMap)["results"].map((exercise, index) => {
                          let exerciseIds = this.getExercisesByTypeAndConcept("READ", concept.name, this.state.allExercises, this.state.conceptExerciseMap)["exerciseIds"];
                          return (
                            <ExerciseInfoContainer key={index}
                                                   firebaseID={exerciseIds[index]}
                                                   exercise={exercise}/>
                          );
                        })}
                        <p className={"section-subheading"}>WRITE TYPES</p>
                        {this.getExercisesByTypeAndConcept("WRITE", concept.name, this.state.allExercises, this.state.conceptExerciseMap)["results"].map((exercise, index) => {
                          let exerciseIds = this.getExercisesByTypeAndConcept("WRITE", concept.name, this.state.allExercises, this.state.conceptExerciseMap)["exerciseIds"];
                          return (
                              <ExerciseInfoContainer key={index}
                                                     firebaseID={exerciseIds[index]}
                                                     exercise={exercise}/>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
    );
  }
}

export default withRouter(AllExercises);