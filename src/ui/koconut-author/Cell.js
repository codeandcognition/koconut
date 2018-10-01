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
			open: this.props.open,
			currentCellFormat: this.props.cellFormat,
			currentInstType: this.props.cellInstructionType,
			cell: {
				prompt: '',
				code: '',
				difficulty: -1,
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
			this.setState({
				currentCellFormat: nextProps.cellFormat,
				currentInstType: nextProps.cellInstructionType,
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

		let cell = {
			currentCellIndex: this.props.index,
			format: this.state.currentCellFormat,
			instructionType: this.state.currentInstType
		};

		return (
				<Dialog fullScreen={true} open={this.state.open}>
					<DialogTitle>Placeholder</DialogTitle>
					<DialogContent>
						{/* render different UI if the cell content is informational */}
						{this.renderCellFormatPrompt()}
						{this.state.currentCellFormat === 'prompt' ?
								this.renderInstructionTypeForm() :
								<Question
									addQuestion={this.addQuestionCell}
									isFollowup={false}
									insideTable={true}
									data={this.state.cell}
									updateCurrentQuestion={this.props.addToTable}
									currentCell={cell}/>
						}
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
		return (
				<div>
					<p>Does this cell contain a question? <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<RadioGroup value={this.state.currentCellFormat} onChange={(evt) => {
							this.setState({
								currentCellFormat: evt.target.value
							}, () => {
								let cellProps =  {
									currentCellIndex: this.props.index,
									format: this.state.currentCellFormat,
									instructionType: this.state.currentInstType
								};
								this.props.updateCurrentCell(this.props.index, this.state.currentCellFormat, this.state.currentInstType);
								this.props.addToTable(this.state.cell, cellProps);
							});
						}}>
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
		return (
				<div>
					<p>How do you want to format the instruction? <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<RadioGroup value={this.state.currentInstType} onChange={(evt) => {
							let currentCell = Object.assign({}, this.state.cell);
							if (evt.target.value === "prompt") {
								currentCell["code"] = "";
							}	else {
								currentCell["prompt"] = "";
							}
							this.setState({
								currentInstType: evt.target.value,
								cell: currentCell
							}, () => {
								let cellProps =  {
									currentCellIndex: this.props.index,
									format: this.state.currentCellFormat,
									instructionType: this.state.currentInstType
								};
								this.props.updateCurrentCell(this.props.index, this.state.currentCellFormat, this.state.currentInstType);
								this.props.addToTable(this.state.cell, cellProps);
							});
						}}>
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

		return (
				<div>
					<p>Code <span style={this.fieldReqs.required}>required</span></p>
					<textarea style={style} value={this.state.cell.code} onChange={this.handleChange('code')}/>
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
	 * Opens the cell popover and stores the index
	 */
	handleOpen() {
		this.setState({open: true});
	}

	/**
	 * Updates the current cell in the state with the latest values
	 *
	 * @param field
	 * @param value
	 */
	updateCell(field, value) {
		let temp = Object.assign({}, this.state.cell);
		temp[field] = value;
		this.setState({cell: temp}, () => {
			let cellProps =  {
				currentCellIndex: this.props.index,
				format: this.state.currentCellFormat,
				instructionType: this.state.currentInstType
			};
			this.props.addToTable(Object.assign({}, this.state.cell), cellProps)
		});
	}

	/**
	 * Triggers a function in the parent class (Table.js) to write cell content
	 * to the table structure
	 *
	 */
	addContent() {
		let cellProps =  {
			currentCellIndex: this.props.index,
			format: this.state.currentCellFormat,
			instructionType: this.state.currentInstType
		};

		this.handleClose();
		this.props.addToTable(Object.assign({}, this.state.cell), cellProps);
	}

	/**
	 * Invoked in Question.js
	 */
	addQuestionCell(cell) {
		let cellProps =  {
			currentCellIndex: this.props.index,
			format: this.state.currentCellFormat,
			instructionType: this.state.currentInstType
		};

		this.handleClose();
		this.props.addToTable(cell, cellProps);
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
					<div style={styles} onClick={() => this.handleOpen()}/>
					{this.state.open && this.renderPopOver()}
				</div>

		);
	}
}

export default Cell;