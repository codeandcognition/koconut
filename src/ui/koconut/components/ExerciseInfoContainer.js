import React, {Component} from 'react';
import QuestionContainer from './QuestionContainer';
import Paper from '@material-ui/core/Paper';
import Code from './Code';

class ExerciseInfoContainer extends Component {
	render() {
		let questionList = [];
		this.props.exercise.questions.forEach((question, index) => {
			questionList.push(
					<QuestionContainer key={index}
														 question={question}
														 isFollowup={false}
														 answer={question.answer}
														 feedback={[]}/>
			);
			// to account for followup questions
			if (question.followupQuestions) {
				question.followupQuestions.forEach((q, i) => {
					questionList.push(
							<QuestionContainer key={index + " " + i}
																 question={q}
																 isFollowup={true}
																 answer={q.answer}
																 feedback={[]}/>
					);
				})
			}
		});

    let paperStyle = {
      padding: "30px",
			margin: "20px"
    };

		return (
			<Paper style={paperStyle}>
				<p><span style={{fontWeight: "bold"}}>Exercise ID:</span> {this.props.firebaseID}</p>
				{this.props.exercise.prompt &&
					<p>{this.props.exercise.prompt}</p>
				}
        {this.props.exercise.code &&
					<div>
						<Code
								key={"code" + 0}
								type={"shortResponse"}
								code={this.props.exercise.code}

								feedback={[]}
								questionIndex={0}
								fIndex={0}
						/>
						<br />
					</div>
        }
				{questionList}
			</Paper>
		);
	}
}

export default ExerciseInfoContainer;