// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from './Response';

import Types from '../../data/ExerciseTypes.js';
import './Information.css';

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */
class Information extends Component {
  props: {
    code: string,
    type: string,
    choices?: string[], // Optional type - can be omitted (use undefined)
    answer: ?string,  // Maybe type - can be null/void
    updateHandler: Function
  };

  /**
   * Returns JSX for (or not for) the Response container given the current props
   * @returns JSX for the Response container
   */
  renderResponseView() {
    return Types.isInlineResponseType(this.props.type) ? <div/>
        : <Response
            type={this.props.type}
            choices={this.props.choices}
            answer={this.props.answer}
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
