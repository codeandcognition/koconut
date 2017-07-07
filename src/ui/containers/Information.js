// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from '../components/Response';

type Props = { type: string }

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */
class Information extends Component {
  props: {
    type: string;
  };

  /*
   TODO: Questions need types.
   This type property assumes we have these question types:
   WriteCode
   FillBlank
   MultipleChoice
   ShortResponse
   HighlightCode
   */

  constructor(props: Props) {
    super(props);
  }

  /**
   * Determines whether the question type is an inline question type.
   * An inline question type requires displaying only the code component,
   * rather than the code and response component.
   * @param type
   * @returns {boolean}
   */
  static isInlineResponseType(type: string): boolean {   //TODO: Place this in future utility class
    return type === 'WriteCode' || type === 'FillBlank' ||
        type === 'HighlightCode';
  }

  render() {
    var displayResponse = Information.isInlineResponseType(this.props.type) ? '' :
        <Response type={this.props.type}/>;
    return (
        <div className="information">
          <Code type={this.props.type}/>
          {displayResponse}
        </div>
    );
  }
}

export default Information;
