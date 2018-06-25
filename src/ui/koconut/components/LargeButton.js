// @flow
import React, {Component} from 'react';

type LargeButtonTypes = {
  prev: string,
  next: string
}

type Props = {
  types: LargeButtonTypes,
  type: string,
  click: Function
}

export default class LargeButton extends Component {
  render() {
    return(
        <div style={{width: "100px",
          height: "400px",
          cursor: "pointer",
          paddingTop: "180px"}}
        onClick={this.props.click}>
        {this.props.type === this.props.types.prev &&
          <div>&lt; go back</div>
        }
        {this.props.type === this.props.types.next &&
          <div>&gt; next</div>
        }

        </div>
    )
  }
}