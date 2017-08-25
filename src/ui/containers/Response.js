// @flow
import React, {Component} from 'react';
import MultipleChoice from '../components/MultipleChoice';
import ShortResponse from '../components/ShortResponse';
import SurveyView from '../components/SurveyView.js';
import './Response.css';

import Types from '../../data/ExerciseTypes.js';

/**
 * The Response component contains the response section in the assessment problem
 * @class
 */
class Response extends Component {
  props: {
    type: string,
    choices?: string[],
    answer: ?string,
    updateHandler: Function
  };

  /**
   * Returns JSX based on the response type
   * @returns JSX for a type of response (MultipleChoice, ShortResponse)
   */
  renderResponse() {
    let type = this.props.type;
    let choices = this.props.choices;
    let answer = this.props.answer;
    let update = this.props.updateHandler;

    switch (type) {
      case(Types.multipleChoice):
        return <MultipleChoice
            choices={choices}
            answer={answer}
            handleClick={update}
        />;
      case(Types.shortResponse):
        return <ShortResponse inputHandler={update}/>;
      case(Types.survey):
        return <SurveyView choices={choices} inputHandler={update}/>;
      default:
        return <div className="BAD">Not a valid EXERCISE type {type}</div>;
    }
  }

  render() {
    let responseWidth = Types.isSurvey(this.props.type) ? 'full' : 'half';
    return (
        <div className={'response ' + responseWidth}>
          {this.renderResponse()}
        </div>
    );
  }
}

export default Response;
