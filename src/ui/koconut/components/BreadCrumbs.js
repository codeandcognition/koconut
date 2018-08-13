// @flow
import React, {Component} from 'react';
import {t} from '../../../data/ConceptAbbreviations';
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './BreadCrumbs.css';
import { Link, withRouter} from "react-router-dom";
import Grow from '@material-ui/core/Grow';
import Routes from './../../../Routes';

type Props = {
  conceptType: string,
  chosenInstruction: any
}

class BreadCrumbs extends Component {


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
        let concept = item.name
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

  /**
   * This function takes in a camel cased string and converts it to normal
   * text with the first letter of every word being capitalized.
   * @param camelString
   * @returns {string}
   */
  formatCamelCasedString(camelString: string) {
    var result = "";
    if (camelString && camelString.length !== 0) {
      result = result + camelString.charAt(0).toUpperCase();
      for (var i = 1; i < camelString.length; i++) {
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

  render() {
    let readOrWrite = "";
    if (this.props.readOrWrite) {
      readOrWrite = this.props.readOrWrite === "READ" ? "Learn to Read Code" : "Learn to Write Code";
    } else {
      readOrWrite = "Learn to Read Code"
    }

    // to handle loss of state upon refresh
		let pathComponents = this.props.history.location.pathname.split("/");
		let conceptCode = pathComponents[2];
		let conceptName = this.formatCamelCasedString(conceptCode);

    let conceptMenu = [];
    if (this.state.semanticConcepts && this.state.semanticConcepts.includes(conceptCode)) {
      conceptMenu = this.state.semanticConcepts;
    } else if (this.state.templateConcepts && this.state.templateConcepts.includes(conceptCode)) {
      conceptMenu = this.state.templateConcepts;
    } else if (this.state.onboardingConcepts && this.state.onboardingConcepts.includes(conceptCode)) {
      conceptMenu = this.state.onboardingConcepts;
    }

    let conceptAnchorEl = this.state.conceptAnchorEl;
    let typeAnchorEl = this.state.typeAnchorEl;

    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href={"#"} aria-owns={conceptAnchorEl ? "concept-menu" : null} aria-haspopup={"true"} onClick={(e) => this.handleMenuOpen(e, true)}>{conceptName}</a>
              <Menu id={"concept-menu"}
                    anchorEl={conceptAnchorEl}
                    transformOrigin={{
                      vertical: -45,
                      horizontal: 20,
                    }}
                    open={Boolean(conceptAnchorEl)}
                    onClose={this.handleMenuClose}>
                {conceptMenu.map((item, index) => {
                  return (
                      <Link to={`/instruction/${item}/learn-to-read-code`} key={index}><MenuItem>{this.state.conceptNames && this.state.conceptNames[item]}</MenuItem></Link>
                  );
                })}
              </Menu>
            </li>
            <li className="breadcrumb-item">
              <a href="#" aria-owns={typeAnchorEl ? "type-menu" : null} aria-haspopup={"true"} onClick={(e) => this.handleMenuOpen(e, false)}>{readOrWrite}</a>
              <Menu id={"type-menu"}
                    anchorEl={typeAnchorEl}
                    transformOrigin={{
                      vertical: -45,
                      horizontal: 20,
                    }}
                    open={Boolean(typeAnchorEl)}
                    onClose={this.handleMenuClose}>
                <Link to={`/instruction/${conceptCode}/learn-to-read-code`}><MenuItem>Learn to Read Code</MenuItem></Link>
                <MenuItem>Practice Reading Code</MenuItem>
                <Link to={`/instruction/${conceptCode}/learn-to-write-code`}><MenuItem>Learn to Write Code</MenuItem></Link>
                <MenuItem>Practice Writing Code</MenuItem>
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