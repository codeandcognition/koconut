import React, {Component} from 'react';
import Question from './Question';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Cell extends Component {
	constructor(props) {
		super(props);

		this.handleClose = this.handleClose.bind(this);
		this.addQuestionCell = this.addQuestionCell.bind(this);

		this.state = {
			open: false,
			currentCellFormat: 'prompt',
			currentInstType: 'prompt',
			cell: {
				prompt: '',
				code: '',
				difficulty: 0,
				choices: [],
				type: "",
				answer: '',
				hint: '',
				feedback: '',
				followupPrompt: '',
				followupQuestions: []
			}
		}
	}

	fieldReqs = {
		required: {
			float: 'right',
			color: '#EF5350'
		},
		optional: {
			float: 'right',
			color: '#4DD0E1'
		}
	}

	/**
	 * Sets the state based on the props
	 *
	 * @param nextProps
	 */
	componentWillReceiveProps(nextProps) {
		let data = nextProps.data;
		if (data !== undefined) {
			let cellFormat = data.answer === '' ? 'prompt' : 'question';
			let cellInstType = data.prompt === '' ? 'code' : 'prompt';
			this.setState({
				currentCellFormat: cellFormat,
				currentInstType: cellInstType,
				cell: data
			});
		}
	}

	/**
	 * Renders the pop over dialog when a cell is clicked
	 */
	renderPopOver() {
		let styles = {
			margin: '5px'
		};
		return (
				<Dialog open={this.state.open}>
					<DialogTitle>Placeholder</DialogTitle>
					<DialogContent>
						{/* render different UI if the cell content is informational */}
						{this.renderCellFormatPrompt()}
						{this.state.currentCellFormat === 'prompt' && this.renderInstructionTypeForm()}
						{this.state.currentCellFormat === 'question' && <Question addQuestion={this.addQuestionCell} isFollowup={false} insideTable={true} data={this.state.cell}/>}
						<br/>
						<div style={{display: 'flex', justifyContent: 'flex-end'}}>
							{
								this.state.currentCellFormat === 'prompt' &&
								<Button style={styles} variant={'outlined'} color={'secondary'} onClick={() => this.addContent()}>Add Content</Button>
							}
							<Button style={styles} variant={'outlined'} onClick={() => this.handleClose()}>Close</Button>
						</div>
					</DialogContent>
				</Dialog>
		);
	}

	/**
	 * Renders the form to indicate whether this cell contains a question
	 * @returns {*}
	 */
	renderCellFormatPrompt() {
		return(
				<div>
					<p>Does this cell contain a question? <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<RadioGroup value={this.state.currentCellFormat} onChange={(evt) => this.setState({currentCellFormat: evt.target.value})}>
							<FormControlLabel value={"question"} control={<Radio color={"primary"}/>} label={"Yes"}/>
							<FormControlLabel value={"prompt"} control={<Radio color={"primary"}/>} label={"No"}/>
						</RadioGroup>
					</FormControl>
				</div>
		);
	}

	/**
	 * Renders the form to indicate the instruction type if the cell is
	 * purely informational
	 *
	 * @returns {*}
	 */
	renderInstructionTypeForm() {
		return(
				<div>
					<p>How do you want to format the instruction? <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<RadioGroup value={this.state.currentInstType} onChange={(evt) => this.setState({currentInstType: evt.target.value})}>
							<FormControlLabel value={"prompt"} control={<Radio color={"primary"}/>} label={"Prompt"}/>
							<FormControlLabel value={"code"} control={<Radio color={"primary"}/>} label={"Code"}/>
						</RadioGroup>
					</FormControl>
					{this.state.currentInstType === 'prompt' ? this.renderPromptFields(): this.renderCodeField()}
				</div>
		);
	}

	/**
	 * Renders the form to enter the prompt for a cell
	 * @returns {*}
	 */
	renderPromptFields() {
		return (
				<div>
					<p>Prompt <span style={this.fieldReqs.required}>required</span></p>
					<TextField fullWidth={true} value={this.state.cell.prompt} onChange={this.handleChange('prompt')}/>
				</div>
		);
	}

	/**
	 * Renders the form to enter the code for a cell
	 *
	 * @returns {*}
	 */
	renderCodeField() {
		let style = {
			width: '100%',
			fontFamily: 'monospace'
		}

		return(
				<div>
					<p>Code <span style={this.fieldReqs.required}>required</span></p>
					<textarea style={style} onChange={this.handleChange('code')}/>
				</div>
		);
	}

	/**
	 *
	 * @param field
	 * @returns {Function}
	 */
	handleChange(field) {
		return (e) => {
			this.updateCell(field, e.target.value);
		}
	}

	/**
	 * Closes the cell pop over
	 */
	handleClose() {
		this.setState({open: false});
	}

	/**
	 * Updates the current cell in the state with the latest values
	 *
	 * @param field
	 * @param value
	 */
	updateCell(field, value) {
		let temp = this.state.cell;
		temp[field] = value;
		this.setState({cell: temp});
	}

	/**
	 * Triggers a function in the parent class (Table.js) to write cell content
	 * to the table structure
	 *
	 */
	addContent() {
		this.handleClose();
		this.props.addToTable(this.state.cell, this.props.index);
	}

	/**
	 * Invoked in Question.js
	 */
	addQuestionCell(cell) {
		this.handleClose();
		this.props.addToTable(cell, this.props.index);
	}

	render() {
		let styles = {
			pointer: 'cursor',
			border: 'solid',
			borderColor: '#00BCD4',
			padding: '25px',
			margin: '5px',
			display: 'inline-block'
		};

		// indicates whether or not the cell has been filled in
		styles["backgroundColor"] = this.props.data === undefined ? '#B2DFDB' : '#FFF59D';

		return(
				<div>
					<div style={styles} onClick={() => this.setState({open: true})}></div>
					{this.state.open && this.renderPopOver()}
				</div>

		);
	}
}

export default Cell;