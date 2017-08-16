// @flow
import React, {Component} from 'react';
import MultipleChoice from './MultipleChoice';
import Submit from './Submit';
import './ConceptSelection.css';

type Props = {
  concepts: string[],
  submitHandler: Function
}

/**
 * The ShortResponse component renders short response exercise type
 * @class
 */
class ConceptSelection extends Component {
  state: {
    answer: ?string
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      answer: null
    };
  }

  /**
   * Wow modularity!
   */
  render() {
    return (
        <div className="concept-selection">
          <h1>Select the next concept!</h1>
          <MultipleChoice
              choices={this.props.concepts}
              answer={this.state.answer}
              handleClick={(content) => this.setState({answer: content})}
          />
          <Submit
              click={this.state.answer !== undefined && this.state.answer !== null}
              submitHandler={() => this.props.submitHandler(this.state.answer)}
          />
        </div>
    );
  }
}

export default ConceptSelection;
