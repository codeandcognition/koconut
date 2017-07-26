// @flow
import React, {Component} from 'react';
import MultipleChoice from '../components/MultipleChoice';
import ShortResponse from '../components/ShortResponse';
import './Response.css';

/**
 * The Response component contains the response section in the assessment problem
 * @class
 */
class Response extends Component {
  props: {
    type: string,
    choices?: string[],
    answer: ?string,
    updateHandler: Function
  };

  /**
   * Returns JSX based on the response type
   * @returns JSX for a type of response (MultipleChoice, ShortResponse)
   */
  renderResponse() {
    switch (this.props.type) {
      case('multipleChoice'):
        return <MultipleChoice
            choices={this.props.choices}
            answer={this.props.answer}
            handleClick={this.props.updateHandler}
        />;
      case('shortResponse'):
        return <ShortResponse inputHandler={this.props.updateHandler}/>;
      default:
        return <div className="BAD">Not a valid EXERCISE type {this.props.type}</div>;
    }
  }

  render() {
    return (
        <div className='response'>
          {this.renderResponse()}
        </div>
    );
  }
}

export default Response;
