// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from '../components/Response';

import Types from '../../backend/Types.js';

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */
class Information extends Component {
  props: {
    code: string,
    type: string,
    answers?: string[], // Optional type - can be omitted (use undefined)
    selected: ?string,  // Maybe type - can be null/void
    updateHandler: Function
  };

  render() {
    let displayResponse = Types.isInlineResponseType(this.props.type)
        ? ''
        : <Response
            type={this.props.type}
            answers={this.props.answers}
            selected={this.props.selected}
            updateHandler={this.props.updateHandler}
          />;
    return (
        <div className="information">
          <Code
              type={this.props.type}
              code={this.props.code}
              updateHandler={Types.isInlineResponseType(this.props.type)
                  ? this.props.updateHandler
                  : undefined}
          />
          {displayResponse}
        </div>
    );
  }
}

export default Information;
