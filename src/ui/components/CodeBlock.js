import React, {Component} from 'react';
import * as hljs from 'highlight.js';
import './default.css'

type Props = {
  literal: string,
  language: string
};

export default class CodeBlock extends Component {
  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    hljs.highlightBlock(this.refs.code);
    console.log(this.refs.code);
  }

  render() {
    return (
        <pre>
          <code ref="code" className={this.props.language || 'js'}>
            {this.props.literal}
          </code>
        </pre>
    )
  }
}
