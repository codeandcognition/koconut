// @flow
import React, {Component} from 'react';
import {t} from '../../../data/ConceptAbbreviations';
import {ConceptKnowledge, MasteryModel} from '../../../data/MasteryModel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './BreadCrumbs.css';
import Grow from '@material-ui/core/Grow';

type Props = {
  conceptType: string,
  chosenInstruction: any
}

export default class BreadCrumbs extends Component {


  constructor(props: Props) {
    super(props);

    this.state = {
      concept: '',
      orderedConcepts: null,
      semanticConcepts: null,
      templateConcepts: null,
      onboardingConcepts: null,
      conceptAnchorEl: null
    }

    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
  }

  componentWillMount() {
    this.setState({
      concept: this.formatCamelCasedString(this.props.conceptType),
      orderedConcepts: this.getOrderedConcepts()
    }, () => {

      var semantic = [];
      var template = [];
      var onboarding = [];

      this.getConceptsByType(this.state.orderedConcepts, t.semantic).map((item) => {
        semantic.push(item.name);
      });

      this.getConceptsByType(this.state.orderedConcepts, t.template).map((item) => {
        template.push(item.name);
      });

      this.getConceptsByType(this.state.orderedConcepts, t.onboarding).map((item) => {
        onboarding.push(item.name);
      });

      this.setState({
        semanticConcepts: semantic,
        templateConcepts: template,
        onboardingConcepts: onboarding
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
    if (camelString.length !== 0) {
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
      conceptAnchorEl: null
    });
  }

  handleMenuOpen(e) {
    this.setState({
      conceptAnchorEl: e.currentTarget
    });
  }

  render() {
    let readOrWrite = "";
    if (this.props.readOrWrite === "READ") {
      readOrWrite = "Learn to Read Code";
    } else {
      readOrWrite = "Learn to Write Code";
    }

    var conceptMenu = [];
    if (this.state.semanticConcepts && this.state.semanticConcepts.includes(this.props.conceptType)) {
      conceptMenu = this.state.semanticConcepts;
    } else if (this.state.templateConcepts && this.state.templateConcepts.includes(this.props.conceptType)) {
      conceptMenu = this.state.templateConcepts;
    } else if (this.state.onboardingConcepts && this.state.onboardingConcepts.includes(this.props.conceptType)) {
      conceptMenu = this.state.onboardingConcepts;
    }

    var conceptAnchorEl = this.state.conceptAnchorEl;

    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href={"#"} aria-owns={conceptAnchorEl ? "concept-menu" : null} aria-haspopup={"true"} onClick={this.handleMenuOpen}>{this.state.concept}</a>
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
                    <MenuItem key={index}>{item}</MenuItem>
                  );
                })}
              </Menu>
            </li>
            <li className="breadcrumb-item"><a href="#">{readOrWrite}</a></li>
            <li className="breadcrumb-item active" aria-current="page">{this.props.chosenInstruction ? this.props.chosenInstruction.title : ""}</li>
          </ol>
        </nav>
      </div>
    );
  }
}

