// @flow
import React, {Component} from 'react';
import Question from '../components/Question';
import Information from './Information';

type Props = { type: string }

// Mo money mo Problems
/**
 * The Problem container contains all components of an assessment problem.
 * @class
 */
class Problem extends Component {
  state: {
    type: string
  };

  /*
   TODO: Questions need types.
   This type property assumes we have these question types:
   WriteCode
   FillBlank
   MultipleChoice
   ShortResponse
   HighlightCode
   */

  constructor(props: Props) {
    super(props);
    this.state = {
      type: props.type,
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
