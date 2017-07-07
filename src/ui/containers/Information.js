// @flow
import React, {Component} from 'react';
import Code from '../components/Code';
import Response from '../components/Response';

type Props = {type: string}

/**
 * The Information container contains Code or both Code and Response.
 * @class
 */
class Information extends Component {

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
        <div className="information">

        </div>
    );
  }
}

export default Information;
