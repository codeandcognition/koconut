// @flow
import React, {Component} from 'react';
import './Hint.css';

/**
 * Component displays a hint at code editor's last cursor position.
 */
class Hint extends Component {

  render() {
    let content: string = this.props.content;
    let pos = this.props.pos;
    let hintW = this.props.width ? this.props.width : 100; // Default width
    let hintH = this.props.height ? this.props.height : 100; // Default height
    let pad = this.props.padding ? this.props.padding : 10; // Default padding

    let resources = this.props.resources;

    return (
        <div className="hint" style={{
          top: pos + 'px',
          left: -1 * (hintW + 3 * pad) + 'px',
          width: hintW + 'px',
          height: hintH + 'px',
          padding: pad + 'px',
        }}>
          <div className="body-text">
            {content}
          </div>
          <div className="list-resources">
            {resources.map(
                (resources) => (<div className="resource-item">resource</div>))}
          </div>
          <div className="close-hint"
               onClick={(this.props.close) ? (this.props.close) : {}}>x
          </div>
        </div>
    );
  }
}

export default Hint;
