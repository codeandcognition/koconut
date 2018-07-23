// @flow
import React, {Component} from 'react';
import MultipleChoice from '../components/MultipleChoice';
import ShortResponse from '../components/ShortResponse';
import SurveyView from '../components/SurveyView.js';
import TableView from '../components/TableView';
import CheckboxQuestion from '../components/CheckboxQuestion';
import './Response.css';

import Types from '../../../data/ExerciseTypes.js';
import CodeEditor from '../components/CodeEditor';

/**
 * The Response component contains the response section in the assessment problem
 * @class
 */
class Response extends Component {
  props: {
    type: string,
    choices?: string[],
    answer: any,
    updateHandler: Function,
    questionIndex: number,
    feedback?: string[],
    submitHandler: Function,
    submitTryAgain: Function,
    question: any
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
    let index = this.props.questionIndex;

    if(this.props.question.data) {
      type = "table";
    }

    switch (type) {
      case(Types.multipleChoice):
        return <MultipleChoice  // want to modify the handle click? be prepared to dig deep in this nest
            title='Select the correct answer:'
            choices={choices}
            answer={answer}
            handleClick={update}
            questionIndex={index}
            feedback={this.props.feedback}
        />;
      case(Types.shortResponse):
        return <ShortResponse feedback={this.props.feedback} inputHandler={update} questionIndex={index}/>;
      case(Types.survey):
        return <SurveyView choices={choices} inputHandler={update} questionIndex={index}/>;
      case(Types.writeCode):
        return <CodeEditor type={type} inputHandler={update} questionIndex={index} code={this.props.question.code}/>
      case(Types.table):
        return <TableView feedback={this.props.feedback} 
                          question={this.props.question} 
                          inputHandler={update} 
                          questionIndex={index} 
                          answer={answer[index]}/>;
      case(Types.checkboxQuestion):
        return <CheckboxQuestion choices={choices} prompt={"prompt" +
        " placeholder"} inputHandler={update} questionIndex={index} feedback={this.props.feedback}
        question={this.props.question} />
      default:
        return <div className="BAD">Not a valid EXERCISE type {type}</div>;
    }
  }

  render() {
    let responseWidth = (Types.isSurvey(this.props.type) || this.props.type === "table" || this.props.type === Types.writeCode) ? 'full' : 'half';
    return (
        <div className={'response ' + responseWidth}>
          {this.renderResponse()}
        </div>
    );
  }
}

export default Response;
