// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from '../components/Response';

import Questions from '../../backend/Questions.js';

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

  render() {
    let displayResponse = Questions.isInlineResponseType(this.props.type)
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
