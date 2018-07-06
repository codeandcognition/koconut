import React, {Component} from 'react';
import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentTable: {
				colNames: [],
				data: [],
				followupPrompt: '',
				followupQuestions: []
			},
			currColName: '',
			currNumRows: 0,
			currentQuestionFormat: 'table',
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

	QuestionTypes = {
		survey: 'survey',
		writeCode: 'writeCode',
		fillBlank: 'fillBlank',
		highlightCode: 'highlightCode',
		multipleChoice: 'multipleChoice',
		shortResponse: 'shortResponse',
		memoryTable: 'memoryTable'
	};

	Difficulty = {
		low: 0,
		med: 1,
		high: 2
	};

	renderTableQuestion() {
		return (
				<div>
					{this.renderFormatForm()}
					{this.renderColumnNamesForm()}
					{this.renderNumRowsForm()}
					{this.renderTableShape()}
				</div>
		);
	}

	renderFormatForm() {
		return(
				<div>
					<p>How do you want to format the question? <span style={this.fieldReqs.required}>required</span></p>
					<FormControl>
						<RadioGroup value={this.state.currentQuestionFormat} onChange={(evt) => this.setState({currentQuestionFormat: evt.target.value})}>
							<FormControlLabel value={"standAlone"} control={<Radio color={"primary"}/>} label={"Stand alone question"}/>
							<FormControlLabel value={"table"} control={<Radio color={"primary"}/>} label={"Format as a table"}/>
						</RadioGroup>
					</FormControl>
				</div>
		);
	}


	renderColumnNamesForm() {
		return(
				<div>
					<p>Column Names <span style={this.fieldReqs.required}>required</span></p>
					<TextField fullWidth={true} value={this.state.currColName} onChange={evt => this.setState({currColName: evt.target.value})}/>
					<Button color={'secondary'}
									variant={'outlined'}
									onClick={() => {
										let temp = this.state.currentTable;
										temp.colNames.push(this.state.currColName)
										this.setState({currentTable: temp, currColName: ''});
									}}>
						Add column name
					</Button>
					<div>
						{
							this.state.currentTable.colNames.map((colName, key) => {
								return <Button style={{backgroundColor: '#ffecb3'}}
															 key={key}
															 onClick={(evt) => {
																 let table = this.state.currentTable;
																 let index = table.colNames.indexOf(evt.target.value);
																 let colNamesCopy = [...this.state.currentTable.colNames];
																 colNamesCopy.splice(index, 1);
																 table.colNames = colNamesCopy;
																 this.setState({currentTable: table});
															 }}>{colName}
								</Button>
							})
						}
					</div>
				</div>
		);
	}

	/**
	 *
	 * @returns {*}
	 */
	renderNumRowsForm() {
		return(
				<div>
					<p>Number of Rows <span style={this.fieldReqs.required}>required</span></p>
					<TextField fullWidth={true}
										 onChange={evt => this.setState({currNumRows: parseInt(evt.target.value)})}/>
				</div>
		);
	}

	renderTableShape() {
		return (
				<div>
					<p>Fill in the Table <span style={this.fieldReqs.required}>required</span></p>
					<p><i>Click on a cell to edit its contents</i></p>

				</div>
		);
	}

	render() {
		return(
				<div>
					{this.renderTableQuestion()}
				</div>
		);
	}
}

export default Table;