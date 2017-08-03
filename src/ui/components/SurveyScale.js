//@flow
import React, {Component} from 'react';
import './SurveyScale.css';

type Props = { index: number, startingValue: number, scale: number, updateHandler: Function};

class SurveyScale extends Component {
  state: {
    val: number,
    boxes: boolean[],
  };
  handleBoxSelect: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      val: this.props.startingValue,
      boxes: [],
    };
    let scale = this.props.scale;
    for(let i = 0; i < this.state.val; i++) {
      this.state.boxes.push(true);
    }
    for(let i = this.state.val; i < scale; i++) {
      this.state.boxes.push(false);
    }
    this.handleBoxSelect = this.handleBoxSelect.bind(this);
  }

  handleBoxSelect(key: string) {
    let index = parseInt(key);
    this.setState({boxes: this.state.boxes.map((b, i) => i <= index),
      val: this.state.boxes.reduce((prev, cur) => prev + cur, 0)});
    this.props.updateHandler(this.props.index, this.state.val);
  }

  render() {
    let val = this.state.val;
    let displayBoxes = this.state.boxes.map((b, i) =>
        <div key={i.toString()} className={'surveyScaleBox ' + b.toString()}
             onClick={this.handleBoxSelect.bind(this, i.toString())}/>);
    return <div className="surveyScale">
      {displayBoxes}{val}
    </div>
  }
}

export default SurveyScale;