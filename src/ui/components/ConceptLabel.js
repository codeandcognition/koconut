//@flow
import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import conceptInventory from '../../data/ConceptMap';
import Choice from './Choice';
import _ from 'lodash';
import './ConceptLabel.css'

type Props = {concepts: string};

class ConceptLabel extends Component {

  constructor(props: Props) {
    super(props);
  }

  renderTooltip(content: string) {
    console.log(content);
    return (
        <ReactTooltip
            id={content}
            place="right"
            effect="solid"
        />
    )
  }

  renderConceptLabel() {
    // console.log(this.props.concepts);
    let concepts = this.props.concepts;
    let explanations = concepts.map(c => conceptInventory[c]);
    return this.props.concepts.length > 0 ?
        <div className="concept-label">
          concepts: {concepts.map((e, i) =>
              <div
                  key={i}
                  className="concept"
                  data-tip
                  data-for={e}
              >
                {e}
                {this.renderTooltip(explanations[i].explanations.definition)}
              </div>
        )}
        </div>
        :
        <div></div>
  }

  render() {
    return this.renderConceptLabel();
  }

}

export default ConceptLabel;