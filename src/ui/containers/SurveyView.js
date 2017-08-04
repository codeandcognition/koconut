//@flow
import React, {Component} from 'react';
import SurveyScale from '../components/SurveyScale';
import './SurveyView.css';

type Props = {
  choices: string[],
  inputHandler: Function,
}

class SurveyView extends Component {
  state: {
    surveys: number[]
  };
  handleUpdate: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      surveys: this.props.choices.map((c) => 0) //Default values
    };
    this.handleUpdate = this.handleUpdate.bind(this);
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
    </div>;
  }
}

export default SurveyView;
