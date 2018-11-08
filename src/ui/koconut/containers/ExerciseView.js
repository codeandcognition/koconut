// @flow
import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import Prompt from '../components/Prompt';
import Information from './Information';
import BreadCrumbs from '../components/BreadCrumbs';
import LoadingView from './../components/LoadingView';
import './ExerciseView.css';
import CodeBlock from '../components/CodeBlock';
import ExerciseNavigation from '../components/ExerciseNavigation';
import DataLogger from '../dataLogging/DataLogger';

type Props = {
  exercise: {
    prompt: string,
    code: string,
    type: string,
    choices?: string[],
    concepts: string[]
  },
	updateUserState: Function,
  readOrWrite: string,
  submitHandler: Function,
  feedback?: string[],
  nextConcepts: string[],
  submitOk: Function,
  submitTryAgain: Function,
  mode: string,
  codeTheme: string,
  timesGotQuestionWrong: [],
  followupTimesGotQuestionWrong: [],
  resetFeedback: Function,
  sendExerciseViewDataToFirebase: Function
}

/**
 * The Exercise container contains all components of an assessment problem.
 * @class
 */
class Exercise extends Component {
  resetAnswer: Function;
  state: {
    answer: string[],
    followupAnswers: any[]
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      answer: [],
      followupAnswers: []
    };
    this.resetAnswer = this.resetAnswer.bind(this);


    let exerciseIsStudy = true; // TODO: TEMPORARY! SHOULD READ FROM PROPS


    this.dataLogger = exerciseIsStudy ? new DataLogger(this.props.readOrWrite) : null;

    /** TEMPORARY */
    // this.dataLogger.addData('MOUSECLICK','M1','asdfsasdf',{row: 1, col: 2},1);
    // // this.dataLogger.sendDataToFirebase(this.props.firebaseUser.uid, this.props.exerciseId, this.props.firebase);
    // console.log(this.dataLogger.getData());


    ////////////////


  }

  /**
   * Moves the Exercise view to the top
   */
  componentDidMount() {
    this.mounted = true;
    window.scrollTo(0, 0);
    this.props.sendExerciseViewDataToFirebase(this.props.exerciseId);
  }

  // debug comment: never reaching componentWillUnmount
  componentWillUnmount() {
		this.mounted = false;
		if (this.mounted) {
			this.resetAnswer();
			this.props.resetFeedback();
    }
  }

  /**
   * Returns whether the answer is defined and non-null or not.
   * @returns {boolean}
   */
  isAnswered() {
    let _a = this.state.answer;
    return _a !== undefined && _a !== null;
  }


  resetAnswer() {
		this.setState({
			answer: [],
			followupAnswers: []
		});
  }

  updateAnswers(content: any, index: number, fIndex: number) {
    if (fIndex === -1) {
      let temp = this.state.answer;
      temp[index] = content;
      this.setState({
        answer: temp
      });
    } else {
      let temp = this.state.followupAnswers;
      temp[index] = [];
      temp[index][fIndex] = content;
      this.setState({
        followupAnswers: temp
      });
    }
  }

	renderOverarchingCode() {
		let code = "```python\n" + this.props.exercise.code + "\n```";
		return (
        <div style={{display: 'flex', justifyContent: 'space-evenly', backgroundColor: '#f7f7f7'}}>
					<ReactMarkdown className={"flex-grow-1"}
												 source={code}
												 renderers={{code: CodeBlock}}
												 escapeHtml={true}
					/>
					<div>
            <textarea style={{width: '30vw', height: '90%', backgroundColor: '#FFF9C4', fontFamily: 'Monospace'}} defaultValue={'# scratch pad'}/>
					</div>
        </div>
    );
	}

	renderExercise() {
  	return(
  			<div>
					<Prompt exercise={this.props.exercise} />
					{(this.props.exercise && this.props.exercise.code) && this.renderOverarchingCode()}
					<Information
							exercise={this.props.exercise}
							answer={this.state.answer}
							followupAnswers={this.state.followupAnswers}
							updateHandler={(content, index, fIndex) => this.updateAnswers(content, index, fIndex)}
							feedback={this.props.feedback}
							followupFeedback={this.props.followupFeedback}
							submitOk={this.props.submitOk}
							submitTryAgain={this.props.submitTryAgain}
							mode={this.props.mode}
							codeTheme={this.props.codeTheme}
							toggleCodeTheme={(test) => this.props.toggleCodeTheme(test)}
							submitHandler={this.props.submitHandler}
							timesGotQuestionWrong={this.props.timesGotQuestionWrong}
							followupTimesGotQuestionWrong={this.props.followupTimesGotQuestionWrong}
							nextQuestion={this.props.nextQuestion}
							resetAnswer={this.resetAnswer}
					/>
          <ExerciseNavigation 
            hasNextQuestion={this.props.hasNextQuestion}
            nextQuestion={this.props.nextQuestion}
            concept={this.props.concept}
            generateExercise={this.props.generateExercise}
            getOrderedConcepts={this.props.getOrderedConcepts}/>
          {/*<ConceptLabel concepts={this.props.exercise &&
           this.props.exercise.concepts}/>*/}
				</div>
		);
	}

  render() {
    let styles = {  // TODO put this in the constructor, unnecessary calculations per render
      marginTop: '10%'
    };

    return (
        <div className="exercise-view" style={styles}>
					<BreadCrumbs conceptType={this.props.concept}
            sendExerciseViewDataToFirebase={this.props.sendExerciseViewDataToFirebase}
            exerciseId={this.props.exerciseId}
            readOrWrite={this.props.readOrWrite}
            instructionOrPractice={"PRACTICE"}
            generateExercise={this.props.generateExercise}
            concept={this.props.concept}
            clearCounterAndFeedback={this.props.clearCounterAndFeedback}
            getOrderedConcepts={this.props.getOrderedConcepts}
          />
					{!this.props.exercise || Object.keys(this.props.exercise).length === 0 ? <LoadingView/> : this.renderExercise()}
        </div>
    );
  }
}

export default Exercise;
