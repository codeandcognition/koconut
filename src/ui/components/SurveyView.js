//@flow
import React, {Component} from 'react';
import SurveyScale from './SurveyScale';
import './SurveyView.css';

type Props = {
  choices: string[],
  inputHandler: Function,
}

class SurveyView extends Component {
  state: {
    surveys: number[],
    filled: boolean
  };
  handleUpdate: Function;
  fillAll: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      surveys: this.props.choices.map((c) => 0), //Defaults
      filled: false,
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.fillAll = this.fillAll.bind(this);
  }

  /**
   * When SurveyScale clicked, updates value in corresponding array.
   * @param ind
   * @param val
   */
  handleUpdate(ind: number, val: number) {
    let temp = this.state.surveys.slice(); // Immutability
    temp[ind] = val;
    this.setState({surveys: temp});
    if(temp.filter((s) => s === 0).length === 0) {
      this.setState({filled: true});
      this.props.inputHandler(temp);
    }
  }

  /**
   * Dev tool to quickly fill survey.
   */
  fillAll() {
    let temp = this.state.surveys.slice().map((c) =>
      Math.floor(Math.random() * 5) + 1); //Random between 1 and 5
    this.setState({surveys: temp, filled: true});
    this.props.inputHandler(temp);
  }

  /**
   * Renders each choice as a survey field.
   * @param choices
   * @returns {Array}
   */
  renderChoices(choices: string[]) {
    return choices.map((c, i) =>
      <div key={i} className="surveyField">
        <div className="surveyFieldName">{c[0].toUpperCase() + c.slice(1)}</div>
          <SurveyScale index={i}
                       value={this.state.surveys[i]}
                       scale={5}   // TODO: Scale is hardcoded
                       updateHandler={this.handleUpdate}/>
      </div>);
  }

  render() {
    return <div className="survey">
      {this.renderChoices(this.props.choices)}
      <br/><br/><br/>
      <button onClick={this.fillAll}>Quick Fill</button>
      <br/><br/>
      <b>Completed: {this.state.filled.toString()}</b>
    </div>;
  }
}

export default SurveyView;
