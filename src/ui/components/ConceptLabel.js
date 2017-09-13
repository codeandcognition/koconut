//@flow
import React, {Component} from 'react';
import './ConceptLabel.css'

type Props = {concepts: string};

class ConceptLabel extends Component {

  constructor(props: Props) {
    super(props);
    console.log(props.concepts)
  }

  renderConceptLabel() {
    return this.props.concepts.length > 0 ?
        <div className="concept-label">
          concepts: {this.props.concepts.toString()}
        </div>
        :
        <div></div>
  }

  render() {
    return this.renderConceptLabel();
  }

}

export default ConceptLabel;