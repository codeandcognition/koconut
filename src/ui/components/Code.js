// @flow
import React, {Component} from 'react';
import Information from '../containers/Information';

const placeholder = '(*)';
/**
 * The Code component contains the code view in the assessment problem
 * @class
 */
class Code extends Component {
  props: {
    type: string,
    code: string
  };

  //TODO: Make indentation work
  /**
   * Returns JSX for the Code view
   * @returns JSX for the Code view
   */
  renderCode() {
    switch(this.props.type) {
      case('FillBlank'):
        let retJSX = [];

        // Iterate by line
        for(let line of this.props.code.split(/\r\n|\n\r|\n|\r/g)) {
          let splitLine = line.split(placeholder);
          let lineJSX = [];
          lineJSX.push(<div className="code-part">{splitLine.shift()}</div>);
          // Insert blanks between splits
          while(splitLine.length > 0) {
            lineJSX.push(<textarea className="code-fill"></textarea>);
            lineJSX.push(<div className="code-part">{splitLine.shift()}</div>);
          }
          retJSX.push(<div className="code-line">{lineJSX}</div>);
        }
        return retJSX;
      default:
        return this.props.code;
    }
  }

  render() {
    let isInlineResponseType = Information.isInlineResponseType(
        this.props.type);
    return (
        <div className={'code ' + (isInlineResponseType ? 'full' : 'half')}>
          {this.renderCode()}
        </div>
    );
  }
}

export default Code;
