// @flow
import React, {Component} from 'react';
import Question from '../components/Question';
import Information from '../components/Information';

type Props = {type: string}

/**
 * The Problem container contains all components of an assessment problem.
 * @class
 */
class Problem extends Component {
  state: {
    type: string
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      type: props.type
    };
  }

  render() {
    return (
        <div className="problem">
          <Question type={this.state.type}/>
          <Information type={this.state.type}/>
        </div>
    );
  }
}

export default Problem;
