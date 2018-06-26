import React, {Component} from 'react';
import * as hljs from 'highlight.js';
import './CodeBlock.css'

type Props = {
  literal: string,
  language: string
};

/**
 * CodeBlock is boilerplate code provided by the React-Markdown to support
 * syntax highlighting in code.
 * @class
 */
export default class CodeBlock extends Component {
  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    hljs.highlightBlock(this.refs.code);
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
