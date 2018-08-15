// @flow
import React, {Component} from 'react';
import {t} from '../../../data/ConceptAbbreviations';
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './BreadCrumbs.css';
import { Link, withRouter} from "react-router-dom";
import firebase from 'firebase';

type Props = {
  conceptType: string,
  chosenInstruction: any,
	generateExercise: Function
}

class BreadCrumbs extends Component {
	LearnerMode = {
		instruction: "instruction",
		practice: "exercise"
	};

	Type = {
		read: "READ",
		write: "WRITE"
	};

  constructor(props: Props) {
    super(props);

    this.state = {
      concept: '',
      orderedConcepts: null,
      semanticConcepts: null,
      templateConcepts: null,
      onboardingConcepts: null,
      conceptAnchorEl: null,
      typeAnchorEl: null
    }

    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
  }

  componentWillMount() {
    this.setState({
      concept: this.formatCamelCasedString(this.props.conceptType),
      orderedConcepts: this.getOrderedConcepts()
    }, () => {
      let conceptNames = {};
      this.state.orderedConcepts.forEach((concept) => {
        conceptNames[concept.name] = this.formatCamelCasedString(concept.name);
      });

      let semantic = [];
      let template = [];
      let onboarding = [];

      this.getConceptsByType(this.state.orderedConcepts, t.semantic).map((item) => {
        let concept = item.name;
        semantic.push(concept);
      });

      this.getConceptsByType(this.state.orderedConcepts, t.template).map((item) => {
        let concept = item.name;
        template.push(concept);
      });

      this.getConceptsByType(this.state.orderedConcepts, t.onboarding).map((item) => {
        let concept = item.name;
        onboarding.push(concept);
      });

      this.setState({
        semanticConcepts: semantic,
        templateConcepts: template,
        onboardingConcepts: onboarding,
        conceptNames: conceptNames
      });
    });
  }

  componentDidMount() {
  	this.mounted = true;
		this.authUnsub = firebase.auth().onAuthStateChanged(user => {
			if (user && this.mounted) {
				this.getUserState();
			}
		})
	}

	componentWillUnmount() {
  	this.mounted = false;
  	this.authUnsub();
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

  handleMenuClose() {
    this.setState({
      conceptAnchorEl: null,
      typeAnchorEl: null
    });
  }

  handleMenuOpen(e, isConceptMenu) {
    this.setState({
      conceptAnchorEl: isConceptMenu ? e.currentTarget : null,
      typeAnchorEl: isConceptMenu ? null : e.currentTarget
    });
  }

  getUserState() {
		if (firebase.auth().currentUser) {
			let userId = firebase.auth().currentUser.uid;
			let userRef = firebase.database().ref('Users/' + userId + '/state');
			let state = {};
			userRef.on('value', snap => {
				if (snap !== null) {
					state = snap.val();
					if (this.mounted) {
						this.setState({
							concept: state.concept,
							readOrWrite: state.type,
							mode: state.mode
						});
					}
				}
			});
		}
	}

	/**
	 * Stores user's current state on Koconut to Firebase
	 *
	 * @param mode
	 */
	storeState(mode: string, counter: number, type: string, concept: string) {
		let state = {
			mode: mode,
			type: type,
			concept: concept,
			counter: counter
		}
		let userId = firebase.auth().currentUser.uid;
		let userRef = firebase.database().ref('Users/' + userId + '/state');
		userRef.set(state);
	}

  render() {
		let conceptName = this.formatCamelCasedString(this.state.concept);

		let link = "";
		// learner centric link
		if (this.state.mode === this.LearnerMode.instruction) {
			if (this.state.readOrWrite === this.Type.read) {
				link = "Learn to read code";
			} else if (this.state.readOrWrite === this.Type.write) {
				link = "Learn to write code";
			}
		} else if (this.state.mode === this.LearnerMode.practice) {
			if (this.state.readOrWrite === this.Type.read) {
				link = "Practice reading code";
			} else if (this.state.readOrWrite === this.Type.write) {
				link = "Practice writing code";
			}
		}

    let typeAnchorEl = this.state.typeAnchorEl;
    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active">{conceptName}</li>
            <li className="breadcrumb-item active">
              <a href="#" aria-owns={typeAnchorEl ? "type-menu" : null} aria-haspopup={"true"} onClick={(e) => this.handleMenuOpen(e, false)}>{link}</a>
              <Menu id={"type-menu"}
                    anchorEl={typeAnchorEl}
                    transformOrigin={{
                      vertical: -45,
                      horizontal: 20,
                    }}
                    open={Boolean(typeAnchorEl)}
                    onClose={this.handleMenuClose}>
                <Link to={`/instruction/${this.state.concept}/learn-to-read-code`}><MenuItem onClick={() => {this.storeState("instruction", 0, "READ", this.state.concept)}}>Learn to Read Code</MenuItem></Link>
								<Link to={`/practice/${this.state.concept}/practice-reading-code`}><MenuItem onClick={() => {this.storeState("exercise", 0, "READ", this.state.concept)}}>Practice Reading Code</MenuItem></Link>
                <Link to={`/instruction/${this.state.concept}/learn-to-write-code`}><MenuItem onClick={() => {this.storeState("instruction", 0, "WRITE", this.state.concept)}}>Learn to Write Code</MenuItem></Link>
								<Link to={`/practice/${this.state.concept}/practice-writing-code`}><MenuItem onClick={() => {this.storeState("exercise", 0, "WRITE", this.state.concept)}}>Practice Writing Code</MenuItem></Link>
              </Menu>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{this.props.chosenInstruction ? this.props.chosenInstruction.title : ""}</li>
          </ol>
        </nav>
      </div>
    );
  }
}

export default withRouter(BreadCrumbs);