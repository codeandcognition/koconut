// @flow
import React, {Component} from 'react';
import MultipleChoice from './MultipleChoice';
import Submit from './Submit';
import conceptInventory from '../../../data/ConceptMap';
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

  constructTooltips() {
    return this.props.concepts.map(concept => {
      if(concept.length === 0) return "";
      let obj = conceptInventory[concept];
      let ret = "";
      if(obj) {
        let name = obj.explanations.name;
        let def = obj.explanations.definition;
        if(name.length > 0 && def.length > 0) {
          ret = name + 's\n\n' + def;
        }
      }
      return ret;
    });
  }

  /**
   * Wow modularity!
   */
  render() {
    let styles = {
      marginTop: '7%'
    };

    // TODO: the implementation below is less than ideal but constrained by
    // the conceptInventory data structure
    return (
        <div className="concept-selection" style={styles}>
          <MultipleChoice
              title='Select the next concept:'
              choices={this.props.concepts}
              labels={['harder','easier','new','same']}
              // Yucky!
              tooltips={this.constructTooltips()}
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
