// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';
import Feedback from '../components/Feedback';
import Types from '../../data/ExerciseTypes.js';
import './Information.css';

// Display type enum
const displayType = {
  exercise: 'EXERCISE',
  feedback: 'FEEDBACK',
  concept: 'CONCEPT',
};

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */
class Information extends Component {
  props: {
    code: string,
    type: string,
    choices?: string[], // Optional type - can be omitted (use undefined)
    answer: ?string,  // Maybe type - can be null/void
    updateHandler: Function,
    feedback: string,
    submitOk: Function,
    mode: string
  };

  /**
   * Returns JSX for (or not for) the Code container given the current props
   * @returns JSX for the Code container
   */
  renderCodeView() {
    return (Types.isSurvey(this.props.type) ||
        (this.props.type === Types.multipleChoice && this.props.code === '')) ? '' :
        (<Code
            type={this.props.type}
            code={this.props.code}
            updateHandler={Types.isInlineResponseType(this.props.type)
                ? this.props.updateHandler
                : undefined}
        />);
  }

  /**
   * Returns JSX for (or not for) the Response container given the current props
   * @returns JSX for the Response container
   */
  renderResponseView() {
    let type = this.props.type;
    if (this.props.mode === displayType.feedback) {
      return <Feedback
          feedback={this.props.feedback}
          submitHandler={this.props.submitOk}
      />
    }
    return Types.isInlineResponseType(type) ? <div/>
        : <Response
            type={type}
            choices={this.props.choices}
            answer={this.props.answer}
            updateHandler={this.props.updateHandler}
            feedback={this.props.feedback}
            submitOk={this.props.submitOk}
            mode={this.props.mode}
        />;
  }

  render() {
    return (
        <div className="information">
          {this.renderCodeView()}
          {this.renderResponseView()}
        </div>
    );
  }
}

export default Information;
