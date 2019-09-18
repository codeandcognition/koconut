import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
	content: string
};

class HintContainer extends Component {
	PLACEHOLDER_CONTENT = ['none', 'placeholder', ''];
	renderContent() {
		return (typeof(this.props.content) === 'string' && !this.PLACEHOLDER_CONTENT.includes(this.props.content.toLowerCase().trim())) 
		? this.props.content
		: 'Sorry, no hint is available. Consider reviewing the lessons for this concept!';
	}
	render() {
		let style = {
			padding: '0.5em 0em',
			margin: '0.5em 0em',
			// borderStyle: 'solid',
			// borderWidth: '1px',
			// borderRadius: '3px',
			backgroundColor: '#fff9c4',
			textAlign: 'left'
		};

		return(
				<div style={style}>
					<ReactMarkdown style={{margin: '0'}}>{this.renderContent()}</ReactMarkdown>
				</div>
		)
	}
}

export default HintContainer;