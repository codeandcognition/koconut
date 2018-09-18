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
import { withRouter} from "react-router-dom";

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
			open: true,
			readInstructions: [],
			writeInstructions: []
		};
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(props: Props) {
		this.setState({
			open: props.open
		}, () => {
      this.getInstructionTitles();
		});
	}

	componentWillMount() {
		this.getInstructionTitles();
	}


	handleClose() {
		this.setState({
			open: false,
			readInstructions: [],
			writeInstructions: []
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

	getInstructionTitles() {
		let databaseRef = firebase.database().ref("Instructions/" + this.props.conceptCode);
		let componentRef = this;
		databaseRef.on("value", function(snapshot) {
			let results = snapshot.val();
			if (results != null) {
				let readResults = results["READ"];
				let writeResults = results["WRITE"];
				let readTitles = [];
				let writeTitles = [];
				if (readResults) {
          readResults.forEach((item) => {
            readTitles.push(item.title);
          });
				}
				if (writeResults) {
          writeResults.forEach((item) => {
            writeTitles.push(item.title);
          });
				}
        componentRef.setState({
          readInstructions: readTitles,
          writeInstructions: writeTitles
        });
			}
		});
	}



	render() {
		let conceptInfo = ConceptInventory[this.props.conceptCode].explanations;

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
								<ul>
									{this.state.readInstructions.map((item, index) => {
										return (
											<Link to={`/instruction/${this.props.conceptCode}/learn-to-read-code/page=${index}`}>
												<li onClick={() => this.props.getInstruction(this.props.conceptCode, "READ", index)} key={index}>{item}</li>
											</Link>
										);
									})}
								</ul>
							</div>
							<div>
								<p>Writing Code</p>
								<ul>
									{this.state.writeInstructions.map((item, index) => {
										return (
											<Link to={`/instruction/${this.props.conceptCode}/learn-to-write-code/page=${index}`}>
												<li onClick={() => this.props.getInstruction(this.props.conceptCode, "WRITE", index)} key={index}>{item}</li>
											</Link>
										);
									})}
								</ul>
							</div>
						</div>
					</DialogContent>
				</Dialog>
		);
	}
}

export default ConceptDialog;

