// @flow
import React, {Component} from 'react';
import './Hint.css';

type Props = {
  active: boolean,
  content: string,
  pos: number,
  height?: number,
  width?: number,
  padding?: number,
  close: Function
};

/**
 * Component displays a hint with content and position relative to code.
 */
class Hint extends Component {
  state: { active: boolean };

  constructor(props: Props) {
    super(props);
    this.state = {active: this.props.active};
  }

  componentDidUpdate() {
    this.setState({active: this.props.active});
  }

  render() {
    let active = this.state.active;
    let content = this.props.content;
    let pos = this.props.pos;
    let hintW = this.props.width ? this.props.width : 100; // Default width
    let hintH = this.props.height ? this.props.height : 100; // Default height
    let pad = this.props.padding ? this.props.padding : 10; // Default padding

    return <div className="hint" style={{
      display: active? 'inline-block' : 'none',
      top: pos + 'px',
      left: -1 * (hintW + 3 * pad) + 'px',
      width: hintW + 'px',
      height: hintH + 'px',
      padding: pad + 'px',
    }}>
      {content}
      <div className="close-hint" onClick={this.props.close}>x</div>
    </div>
  }
}

export default Hint;
