import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs as style } from 'react-syntax-highlighter/styles/hljs'
import './CodeBlock.css'

// type Props = {
//   literal: string,
//   value: string
// };

/**
 * CodeBlock is boilerplate code provided by the React-Markdown to support
 * syntax highlighting in code.
 * CodeBlock sourced from https://gist.github.com/ibrahima/d21950a95aee3212e991a8404e238093
 * @class
 */
export default class CodeBlock extends React.PureComponent {
    static propTypes = {
        value: PropTypes.string.isRequired,
        language: PropTypes.string,
    }

    static defaultProps = {
        language: null,
    }

    render() {
        const { language, value } = this.props;

        return (
            <SyntaxHighlighter language={language || 'python'}
                style={style}
                showLineNumbers
                className="codeblock">
                {value}
            </SyntaxHighlighter>
        );
    }
}
