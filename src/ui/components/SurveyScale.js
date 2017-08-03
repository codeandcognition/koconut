//@flow
import React, {Component} from 'react';
import './SurveyScale.css';

class SurveyScale extends Component {
  props: {
    index: number,
    value: number,
    scale: number,
    updateHandler: Function
  };

  render() {
    // Fill boxes with filled/unfilled values
    let boxes = [];
    for (let i = 0; i < this.props.value; i++) {
      boxes.push(true);
    }
    for (let i = this.props.value; i < this.props.scale; i++) {
      boxes.push(false);
    }

    let displayBoxes = boxes.map((b, i) =>
        <div
            key={i.toString()}
            className={'surveyScaleBox ' + b.toString()}
            onClick={() =>
                this.props.updateHandler(this.props.index, i + 1)
            }
        />
    );

    return <div className="surveyScale">
      {this.props.value !== 0 ? this.props.value.toString() : ' '}
      {displayBoxes}
    </div>;
  }
}

export default SurveyScale;
