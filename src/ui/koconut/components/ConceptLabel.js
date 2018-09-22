//@flow
import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import ReactMarkdown from 'react-markdown';
import conceptInventory from '../../../data/ConceptMap';
import './ConceptLabel.css'

class ConceptLabel extends Component {
  renderTooltip(id: number, name: string, example:string, content: string) {
    return content ? (
        <ReactTooltip id={id} place="top" effect="solid">
          <ReactMarkdown source={
            "We think you'll find **"
            + name
            + "s** useful because they "
            + content
            + ". Example: \n"
            + "```java \n "
            + example
            + " \n```"
          }>
          </ReactMarkdown>
        </ReactTooltip>
    ) : ''
  }

  renderConceptLabel() {
    let concepts = this.props.concepts;
    let explanations = concepts.map(c => conceptInventory[c]);
    return this.props.concepts.length > 0 ?
        <div className="concept-label">
          concepts: {concepts.map((concept, i) => {
            if(explanations[i]) { // double check in case concept does not exist.
              let curr = explanations[i].explanations;
              return (
                  <div key={i} className="concept" data-tip data-for={concept}>
                    {concept}
                    {this.renderTooltip(concept, curr.name, curr.examples[0], curr.definition)}
                  </div>);
            } else {
              return '';
            }

          })}</div>
        :
        <div/>
  }

  render() {
    return this.renderConceptLabel();
  }

}

export default ConceptLabel;