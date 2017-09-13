//@flow
import React, {Component} from 'react';

type Props = {concepts: string};

class ConceptLabel extends Component {

  constructor(props: Props) {
    super(props);
    console.log(props.concepts)
  }

  render() {
    // console.log(this.props.concept);
    return <div className="concept-label">
      {this.props.concepts}
    </div>
  }
}

export default ConceptLabel;