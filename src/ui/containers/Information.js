// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from '../components/Response';

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */
class Information extends Component {
  props: {
    code: string,
    type: string,
    answers?: string[], // Optional type - can be omitted (cannot be null)
    selected: ?string,  // Maybe type - can be null/void
    updateHandler: Function
  };

  /**
   * Determines whether the question type is an inline question type.
   * An inline question type requires displaying only the code component,
   * rather than the code and response component.
   * @param type - the question type
   * @returns whether or not the question type requires inline responding
   */
  static isInlineResponseType(type: string): boolean {   //TODO: Place this in future utility class
    return type === 'WriteCode' || type === 'FillBlank' ||
        type === 'HighlightCode';
  }

  render() {
    let displayResponse = Information.isInlineResponseType(this.props.type)
        ? ''
        : <Response
            type={this.props.type}
            answers={this.props.answers}
            selected={this.props.selected}
            updateHandler={this.props.updateHandler}
          />;
    return (
        <div className="information">
          <Code type={this.props.type} code={this.props.code}/>
          {displayResponse}
        </div>
    );
  }
}

export default Information;
