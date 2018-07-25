import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import Paper from '@material-ui/core/Paper';
import Types from '../../../data/ExerciseTypes.js';
import Submit from './Submit';

class ExerciseQuestion extends Component {

  render() {
    console.log(this.props);
    return (
      <div>
        <div className="information" style={{width: "100%", display: "flex", textAlign: "center", justifyContent: "space-between"}}>
          {this.props.question.code && this.props.question.type !== Types.writeCode && this.props.renderCodeView}
          <div style={{width: "100%", margin: "0", padding: "0"}}>
            <div style={{textAlign: "left", margin: "20px"}}>
              <ReactMarkdown source={this.props.question.prompt || ""}></ReactMarkdown>
            </div>
            {this.props.renderResponseView}
            {!(this.props.feedback) &&
            <Submit submitHandler={() => this.props.submitHandler(this.props.answer, this.props.index, this.props.question.type)} />
            }
          </div>
        </div>
        {this.props.renderFeedback}
      </div>
    );
  }

}

export default ExerciseQuestion;