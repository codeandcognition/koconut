//@flow
import React, {Component} from 'react';

type Props = {concept: string};

class ConceptLabel extends Component {

  constructor(props: Props) {
    super(props);
    console.log(props.concept)
  }

  render() {
    // console.log(this.props.concept);
    return <div className="concept-label">
      {this.props.concept}
    </div>
  }
}

export default ConceptLabel;