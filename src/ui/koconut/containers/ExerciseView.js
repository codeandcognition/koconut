// @flow
import React, { Component, FunctionComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import Prompt from '../components/Prompt';
import Information from './Information';
// import BreadCrumbs from '../components/BreadCrumbs';
import LoadingView from './../components/LoadingView';
import './ExerciseView.css';
import CodeBlock from '../components/CodeBlock';
// import ExerciseNavigation from '../components/ExerciseNavigation';
import SideNavigation from './../components/SideNavigation';
import Signpost from './../components/Signpost';

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
  sendExerciseViewDataToFirebase: Function,
  getInstruction: Function,
  generateExercise: Function,
  exerciseList: any[],
  exerciseRecommendations: any,
  exerciseId: string,
  userCondition: string
}

const EXERCISE_ID = 'exerciseId'

/**
 * The Exercise container contains all components of an assessment problem.
 * @class
 */
class Exercise extends Component {
  resetAnswer: Function;
  state: {
    answer: string[],
    followupAnswers: any[],
    exerciseId: string
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      answer: [],
      followupAnswers: [],
      exerciseId: this.props.exerciseId
    };
    this.resetAnswer = this.resetAnswer.bind(this);
  }

  /**
   * Moves the Exercise view to the top
   */
  componentDidMount() {
    this.mounted = true;
    window.scrollTo(0, 0);

    let storedExerciseId = sessionStorage.getItem(EXERCISE_ID);
    let stateHasExerciseId = this.state.exerciseId && this.state.exerciseId.length > 0;
    
    // no exercise ID on refresh, so used cached version
    if(!stateHasExerciseId && storedExerciseId){
      this.setState({
        exerciseId: storedExerciseId
      }, this.props.sendExerciseViewDataToFirebase(this.state.exerciseId));
    } else {
       // if new exerciseId exists, then update storage
       if(stateHasExerciseId && this.state.exerciseId != storedExerciseId) {
        sessionStorage.setItem(EXERCISE_ID, this.state.exerciseId);
      }
      this.props.sendExerciseViewDataToFirebase(this.state.exerciseId);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.exerciseId !== nextProps.exerciseId) {
      window.scrollTo(0, 0); // scroll to top if navigating to a new exercise
      this.resetAnswer();
    }

    if (nextProps.exerciseId && this.state.exerciseId !== nextProps.exerciseId) {
      this.setState({
        exerciseId: nextProps.exerciseId
      }, sessionStorage.setItem(EXERCISE_ID, nextProps.exerciseId))
    }
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
        answer: temp,
      }, () => {
        this.props.resetFeedback();
      });
    } else {
      let temp = this.state.followupAnswers;
      temp[index] = [];
      temp[index][fIndex] = content;
      this.setState({
        followupAnswers: temp
      }, () => {
        this.props.resetFeedback();
      });
    }
  }

  renderOverarchingCode() {
    let code = "```python\n" + this.props.exercise.code + "\n```";
    return (
      <div style={{ display: 'flex', justifyContent: 'space-evenly', backgroundColor: '#f7f7f7' }}>
        <ReactMarkdown className={"flex-grow-1"}
          source={code}
          renderers={{ code: CodeBlock }}
          escapeHtml={true}
        />
        <div>
          <textarea style={{ width: '30vw', height: '90%', backgroundColor: '#FFF9C4', fontFamily: 'Monospace' }} defaultValue={'# scratch pad'} />
        </div>
      </div>
    );
  }

  renderExercise() {
    return (
      <div>
        <Prompt exercise={this.props.exercise} />
        {(this.props.exercise && this.props.exercise.code) && this.renderOverarchingCode()}
        <Information
          exercise={this.props.exercise}
          exerciseId={this.state.exerciseId}
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
          prevQuestionAttemptCorrect={this.props.prevQuestionAttemptCorrect}
        />
        {/* <ExerciseNavigation
          hasNextQuestion={this.props.hasNextQuestion}
          nextQuestion={this.props.nextQuestion}
          concept={this.props.concept}
          generateExercise={this.props.generateExercise}
          getOrderedConcepts={this.props.getOrderedConcepts} /> */}
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
      <div>
        <div className="exercise-container" style={styles}>
          <div className="sidebar-menu">
            <SideNavigation title={this.props.concept}
              conceptCode={this.props.concept}
              closeMenu={null}
              defaultOpen={[this.props.readOrWrite]}
              generateExercise={this.props.generateExercise}
              getInstruction={this.props.getInstruction}
              exercisesList={this.props.exercisesList}
              conceptMapGetter={this.props.conceptMapGetter}
              getOrderedConcepts={this.props.getOrderedConcepts}
              goToExercise={this.props.goToExercise}
              persist={true}
              instructionsMap={this.props.instructionsMap}
              exerciseRecommendations={this.props.exerciseRecommendations}
              instructionRecommendations={this.props.instructionRecommendations} userBKTParams={this.props.userBKTParams}
              instructionsRead={this.props.instructionsRead}
              exercisesCompleted={this.props.exercisesCompleted}
              selectedIndex={this.props.selectedIndex}
              userCondition={this.props.userCondition}
              switchToWorldView={this.props.switchToWorldView}
              exerciseConceptMap={this.props.exerciseConceptMap}
              />
          </div>
          <div className="exercise-view">
            {/* <BreadCrumbs conceptType={this.props.concept}
              sendExerciseViewDataToFirebase={this.props.sendExerciseViewDataToFirebase}
              exerciseId={this.state.exerciseId}
              readOrWrite={this.props.readOrWrite}
              instructionOrPractice={"PRACTICE"}
              generateExercise={this.props.generateExercise}
              concept={this.props.concept}
              clearCounterAndFeedback={this.props.clearCounterAndFeedback}
              getOrderedConcepts={this.props.getOrderedConcepts}
            /> */}
            {!this.props.exercise || Object.keys(this.props.exercise).length === 0 ? <LoadingView /> : this.renderExercise()}
            <span style={{display:'block'}}>
              <Signpost direction={'left'} message={'Use the side navigation to decide what to learn next'} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Exercise;
