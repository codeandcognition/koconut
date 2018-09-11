import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import firebase from 'firebase';
import "./AllExercises.css";
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import {t} from '../../../data/ConceptAbbreviations';

import ExerciseInfoContainer from './../components/ExerciseInfoContainer';

class AllExercises extends Component {
	constructor(props) {
		super(props);

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

  getOrderedConcepts(): ConceptKnowledge[] {
    return MasteryModel.model.filter((concept) => concept.should_teach && concept.container).sort(
        (a, b) => (b.dependencyKnowledge / b.knowledge -
            a.dependencyKnowledge / a.knowledge));
  }

  getConceptsByType(orderedConcepts: ConceptKnowledge[], type: string) {
    return orderedConcepts.filter(concept => {
      return concept.type === type;
    })
  }

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


	render() {
    let sections = [
      {name: t.onboarding, title: "Getting Started"},
      {name: t.semantic, title: "Building Blocks"},
      {name: t.template, title: "Templates"}
    ];
		let conceptList = this.getOrderedConcepts();

		console.log(this.state.conceptExerciseMap);

    return (
				<div className={"container"}>
					<h1>Koconut Exercises</h1>
					{sections.map((item, index) => {
						let section = t[item.name];
						return (
							<div className={"section"} key={index}>
								<h3>{item.title}</h3>
								{this.getConceptsByType(conceptList, section).map((concept, index2) => {
									return (
										<div key={index2}>
											<h5>{this.formatCamelCasedString(concept.name)}</h5>
                      {this.state.conceptExerciseMap[concept.name].map((exerciseId, index) => {
                        {/* Place exercise info container here */}
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