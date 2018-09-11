import React, {Component} from 'react';
import Types from '../../../data/ExerciseTypes.js';
import Submit from './Submit';

type Props = {
	key: number,
	question: any,
	index: number,
	renderCodeView: Function,
	renderResponseView: Function,
	feedback: any,
	answer: any,
	submitHandler: Function,
	fIndex: number
};

class ExerciseQuestion extends Component {
  render() {

    return (
      <div>
        <div className="information" style={{width: "100%", display: "flex", textAlign: "center", justifyContent: "space-between"}}>
          {this.props.question.code && this.props.question.type !== Types.writeCode && this.props.renderCodeView}
          <div style={{width: "100%", margin: "0", padding: "0"}}>
            {this.props.renderResponseView}
            {!(this.props.feedback) &&
            <Submit disabled={this.props.answer[this.props.index] === undefined}
										submitHandler={() => this.props.submitHandler(this.props.answer, this.props.index, this.props.question.type, this.props.fIndex)} />
            }
          </div>
        </div>
        {this.props.renderFeedback}
      </div>
    );
  }

}

export default ExerciseQuestion;