import React, {Component} from 'react';
import Types from '../../../data/ExerciseTypes.js';
import Submit from './Submit';

type Props = {
	question: any,
	renderCodeView: Function,
	renderResponseView: Function,
	answer: any,
	submitHandler: Function,
};

class ExerciseQuestion extends Component {
  render() {

    return (
      <div>
        <div className="information" style={{width: "100%", display: "flex", textAlign: "center", justifyContent: "space-between"}}>
          {this.props.question.code && this.props.question.type !== Types.writeCode && this.props.renderCodeView(this.props.question, this.props.index, this.props.fIndex)}
          <div style={{width: "100%", margin: "0", padding: "0"}}>
            {this.props.renderResponseView(this.props.question, this.props.index, this.props.fIndex)}
            {!(this.props.feedback) &&
            <Submit disabled={this.props.answer[this.props.index] === undefined}
										submitHandler={() => {
                      this.props.submitHandler(this.props.answer, this.props.index, this.props.question.type, this.props.fIndex);
                      // console.log(this.props.dataLogger.getData());
                      this.props.dataLogger.sendDataToFirebase();
                    }} />
            }
          </div>
        </div>
        {this.props.renderFeedback}
      </div>
    );
  }

}

export default ExerciseQuestion;