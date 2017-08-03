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

  handleUpdate(ind: number, val: number) {
    let temp = this.state.surveys.slice(); // Immutability
    temp[ind] = val;
    this.setState({surveys: temp});
    this.props.inputHandler(temp);
  }

  // TODO: Scale is hardcoded
  render() {
    let choices = this.props.choices;
    return <div className="survey">
      {
        choices.map((c, i) =>
            <div key={i} className="surveyField">
              <div className="surveyFieldName">{c[0].toUpperCase() +
              c.slice(1)}</div>
              <SurveyScale index={i} value={this.state.surveys[i]} scale={5}
                           updateHandler={this.handleUpdate}/>
            </div>)
      }
    </div>;

  }
}

export default SurveyView;
