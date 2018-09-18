import React, {Component} from 'react';
import { Link} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import './ConceptDialog.css';
import ConceptInventory from './../../../data/ConceptMap';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import firebase from 'firebase';

type Props = {
	title: string,
	conceptCode: string,
	open: boolean,
	generateExercise: Function,
	getInstruction: Function
};

class ConceptDialog extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			open: true
		};
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(props: Props) {
		this.setState({
			open: props.open
		})
	}

	handleClose() {
		this.setState({
			open: false
		});
	}

  renderMarkdown(codeString: string, index: number) {
    let code = "```python\n" + codeString + "\n```";
    return <ReactMarkdown className={"flex-grow-1"}
													key={index}
                          source={code}
                          renderers={{code: CodeBlock}}
                          escapeHtml={true}
    />
  }



	render() {
		let conceptInfo = ConceptInventory[this.props.conceptCode].explanations

		return (
				<Dialog open={this.state.open} onClose={this.handleClose}>
					<DialogContent>
						<div className={'dialogHeader'}>
							<h2>{this.props.title}</h2>
							<i className="far fa-times-circle icon" onClick={() => this.handleClose()}/>
						</div>
						<p>{conceptInfo.definition}</p>
						<p><span className={"bold-text"}>Examples</span></p>
						{conceptInfo.examples.map((item, index) => {
              return this.renderMarkdown(item, index);
            })}
						<h4>Overview</h4>
						<div className={"overview-container"}>
							<div>
								<p>Reading Code</p>

							</div>
							<div>
								<p>Writing Code</p>
							</div>
						</div>
					</DialogContent>
				</Dialog>
		);
	}
}

export default ConceptDialog;

