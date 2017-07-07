// @flow
import React, {Component} from 'react';
import Question from '../components/Question';
import Code from '../components/Code';
import Response from '../components/Response';

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
          <Question />
          <div className="">
            <Code type={this.state.type}/>
            <Response type={this.state.type}/>
          </div>

        </div>
    );
  }
}

export default Problem;
