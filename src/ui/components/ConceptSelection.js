// @flow
import React, {Component} from 'react';
import MultipleChoice from './MultipleChoice';
import Submit from './Submit';
import conceptInventory from '../../data/ConceptMap';
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
    // TODO: the implementation below is less than ideal but constrained by
    // the conceptInventory data structure
    return (
        <div className="concept-selection">
          <MultipleChoice
              title='Select the next concept:'
              choices={this.props.concepts}
              // Yucky!
              tooltips={this.props.concepts.map(concept =>
                  conceptInventory.filter(item => item.name === concept)[0]
                      .explanations.definition
              )}
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
