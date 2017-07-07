// @flow
import React, {Component} from 'react';
import Information from '../containers/Information';

/**
 * The Code component contains the code view in the assessment problem
 * @class
 */
class Code extends Component {
  props: {
    type: string;
  };

  render() {
    var isInlineResponseType = Information.isInlineResponseType(this.props.type);
    return (
        <div className={'code ' + (isInlineResponseType ? 'full' : 'half')}>
        </div>
    );
  }
}

export default Code;
