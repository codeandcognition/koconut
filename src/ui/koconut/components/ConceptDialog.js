import React, {Component} from 'react';
import { Link} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import './ConceptDialog.css';
import ConceptInventory from './../../../data/ConceptMap';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import firebase from 'firebase';
import { withRouter } from "react-router-dom";
import ConceptDialogButton from './ConceptDialogButton';

const LEARN = "Learn";
const PRACTICE = "Practice";

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
			writeInstructions: [],
			showRecommendations: true
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

	handleChange(evt, type) {
		this.setState({[type]: evt.target.checked});
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
						<div className={'options'}>
							<Button variant="contained" className={'resume'}>Resume</Button>
							<div>
								{/* TODO: Placeholders for now */}
								<p className={'switch-text'}>
									<i>
										{this.state.showRecommendations ?
												'hide recommendations' : 'show recommendations'}
									</i>
								</p>
								<Switch checked={this.state.showRecommendations}
												className={'switch'}
												color={'primary'} onChange={evt => this.handleChange(evt, 'showRecommendations')}/>
							</div>
						</div>
						<p><span className={"bold-text"}>Examples</span></p>
						{conceptInfo.examples.map((item, index) => {
              return this.renderMarkdown(item, index);
            })}

						<div>
							<p className={'bold-text'}>Reading {this.props.title}</p>
							<div className={"overview-container"}>
							<div>
									<p>{LEARN}</p>
										{this.state.readInstructions.map((item, index) => {
											return (
													<Link key={'r' + index} 
                          onClick={() => this.props.getInstruction(this.props.conceptCode, "READ", index)}
                          to={`/instruction/${this.props.conceptCode}/learn-to-read-code/page=${index}`}
                          style={{textDecoration: 'none', color: 'black'}}>
														{/* <div style={{width: '100%'}}>{item}</div> */}
                            <ConceptDialogButton name={item} read={true} suggestionText={"asdf"} 
                            showInitially={false} 
                            color={"#ffffff"} />
													</Link>
											);
										})}
								</div>
								<div>
									<p>{PRACTICE}</p>
								</div>
							</div>
						</div>

						<div>
							<p className={'bold-text'}>Writing {this.props.title}</p>
							<div className={"overview-container"}>
								<div>
									<p>{LEARN}</p>
									
										{this.state.writeInstructions.map((item, index) => {
											return (
													<Link key={'w' + index}to={`/instruction/${this.props.conceptCode}/learn-to-write-code/page=${index}`}
                          onClick={() => this.props.getInstruction(this.props.conceptCode, "WRITE", index)}>
														<div style={{width: '100%'}}>{item}</div>
													</Link>
											);
										})}
									
								</div>
								<div>
									<p>{PRACTICE}</p>
								</div>
							</div>
						</div>
					</DialogContent>
				</Dialog>
		);
	}
}

export default ConceptDialog;

