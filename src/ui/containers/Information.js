// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';

import Types from '../../backend/Types.js';
import './Information.css';

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

  renderResponseView() {
    return Types.isInlineResponseType(this.props.type) ? <div/>
        : <Response
            type={this.props.type}
            answers={this.props.answers}
            selected={this.props.selected}
            updateHandler={this.props.updateHandler}
        />;
  }

  render() {

    return (
        <div className="information">
          <Code
              type={this.props.type}
              code={this.props.code}
              updateHandler={Types.isInlineResponseType(this.props.type)
                  ? this.props.updateHandler
                  : undefined}
          />
          {this.renderResponseView()}
        </div>
    );
  }
}

export default Information;
