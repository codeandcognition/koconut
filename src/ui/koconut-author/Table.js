import React, {Component} from 'react';
import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Cell from './Cell';

class Table extends Component {
	constructor(props) {
		super(props);

		this.addToTable = this.addToTable.bind(this);
		this.updateCurrentCell = this.updateCurrentCell.bind(this);

		let table  = Object.assign({}, this.props.data);

		this.state = {
			currentTable: table,
			currColName: '',
			currNumRows: 0,
			currentCell: {
				index: this.props.currentlyOpen,
				format: this.props.cellFormat,
				instructionType: this.props.cellInstructionType
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
	};

	componentWillReceiveProps(nextProps) {
		let cell = {
			index: nextProps.currentlyOpen,
			format: nextProps.cellFormat,
			instructionType: nextProps.cellInstructionType
		}
		this.setState({
			currentTable: nextProps.data,
			currentCell: cell
		})
	}

	/**
	 * Renders a table question
	 * @returns {*}
	 */
	renderTableQuestion() {
		return (
				<div>
					{this.renderColumnNamesForm()}
					{this.renderNumRowsForm()}
					<br/>
					{this.renderTablePromptForm()}
					<br />
					{this.renderTableCodeForm()}
					<br />
					<Button variant={'outlined'} onClick={() => this.writeQuestion()}>Add Table</Button>
				</div>
		);
	}

  /**
	 * Renders the form to indicate the table's overarching prompt
   */
	renderTablePromptForm() {
		return(
				<div>
          <p style={{color: '#3F51B5'}}>Table Prompt <span style={this.fieldReqs.optional}>optional</span></p>
					<TextField fullWidth={true} value={this.state.currentTable.prompt} onChange={(evt) => {
						let table = Object.assign({}, this.state.currentTable);
						table.prompt = evt.target.value;
						this.setState({
							currentTable: table
						});
					}} />
				</div>
		);
	}

	renderTableCodeForm() {
    let code = {
      border: '1px solid darkgray',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
      width: '100%',
      height: '10em',
      display: 'block'
    };

		return (
			<div>
        <p style={{color: '#3F51B5'}}>Table Code <span style={this.fieldReqs.optional}>optional</span></p>
        <textarea style={code} onChange={(evt) => {
        	let table = Object.assign({}, this.state.currentTable);
        	table.code = evt.target.value;
        	this.setState({
						currentTable: table
					});
				}} />
			</div>
		);
	}

	/**
	 * Renders the UI to indicate the column names
	 * @returns {*}
	 */
	renderColumnNamesForm() {
		return(
				<div>
					<p style={{color: '#3F51B5'}}>Column Names <span style={this.fieldReqs.required}>required</span></p>
					<TextField fullWidth={true} value={this.state.currColName} onChange={evt => this.setState({currColName: evt.target.value})}/>
					<Button style={{margin: '15px'}}
									color={'secondary'}
									variant={'outlined'}
									onClick={() => {
										let temp = Object.assign({}, this.state.currentTable);
										temp.colNames.push(this.state.currColName);
										this.setState({
													currentTable: temp, currColName: ''},
												() => this.props.updateCurrentQuestion(this.state.currentTable , this.state.currentCell));
									}}>
						Add column name
					</Button>
					<div>
						{this.state.currentTable.colNames && this.state.currentTable.colNames.map((colName, key) => {
								return <Button style={{backgroundColor: '#ffecb3', margin: '3px'}}
															 key={key}
															 onClick={(evt) => {
																 let table = Object.assign({}, this.state.currentTable);
																 let index = table.colNames.indexOf(evt.target.value);
																 let colNamesCopy = [...Object.assign({}, this.state.currentTable.colNames)];
																 colNamesCopy.splice(index, 1);
																 table.colNames = colNamesCopy;
																 this.setState({currentTable: table}, () => this.props.updateCurrentQuestion(Object.assign({}, this.state.currentTable), this.state.currentCell));
															 }}>{colName}
								</Button>
							})
						}
					</div>
				</div>
		);
	}

	/**
	 * Renders the UI to indicate the number of rows in the table
	 * @returns {*}
	 */
	renderNumRowsForm() {
		return(
				<div>
					<p style={{color: '#3F51B5'}}>Number of Rows <span style={this.fieldReqs.required}>required</span></p>
					<TextField fullWidth={true}
										 value={this.state.currNumRows}
										 onChange={evt => {
										 	this.setState({currNumRows: evt.target.value}, () => {this.props.updateCurrentQuestion(this.state.currentTable, this.state.currentCell)})
										 }}/>

					{ !isNaN(parseInt(this.state.currNumRows, 10)) &&
						(this.state.currentTable.colNames && this.state.currentTable.colNames.length > 0) &&
						this.renderTableShape()
					}

				</div>
		);
	}

	/**
	 * Renders the cell tiles for the table
	 * @returns {*}
	 */
	renderTableShape() {
		let rows = parseInt(this.state.currNumRows, 10);
		let width = this.state.currentTable.colNames.length;
		return (
				<div>
					<p style={{color: '#3F51B5'}}>Fill in the Table <span style={this.fieldReqs.required}>required</span></p>
					<p style={{color: '#3F51B5'}}><i>Click on a cell to edit its contents</i></p>
					<p style={{color: '#3F51B5'}}>{this.state.currNumRows} x {this.state.currentTable.colNames.length}</p>
					{
							// Note: React JSX doesn't regular for loops; hence the current outer loop.
							Array.apply(null, Array(rows)).map((item, rowNum) => {
								let row = [];
								this.state.currentTable.colNames.forEach((colName, colNum) => {
									// index to map from 2d table to 1d table since a table is
									// represented as an array
									const index = (rowNum * width) + colNum;
									row.push(<Cell key={colNum}
																 index={index}
																 addToTable={this.addToTable}
																 data={this.state.currentTable.data[index]}
																 open={this.state.currentlyOpen === index}
																 updateCurrentCell={this.updateCurrentCell} // extend the functionality
																 cellFormat={this.state.currentCell.format}
																 cellInstructionType={this.state.currentCell.instructionType}/>);
								});
								return(
										<div key={rowNum} style={{display: 'flex', justifyContent: 'center'}}>
											{row}
										</div>
								)
							})
					}
				</div>
		);
	}

	/**
	 * Invoked in Cell.js to add a cell's content to the table
	 */
	addToTable(cell, cellProps) {
		let table = Object.assign({}, this.state.currentTable);
		let data = table.data;
		data[cellProps.currentCellIndex] = cell;
		table['data'] = data;
		this.setState({
			currentTable: table
		}, () => {
			this.props.updateCurrentQuestion(Object.assign({}, this.state.currentTable), cellProps);
		});
	}

	/**
	 * Writes the current question to the table
	 */
	writeQuestion() {
		let items = this.state.currentTable.colNames.length * parseInt(this.state.currNumRows, 10);
		if (this.state.currentTable.colNames.length > 0 &&
				parseInt(this.state.currNumRows, 10) > 0 &&
				this.state.currentTable.data.length === items) {
			this.props.updateCurrentQuestion(Object.assign({}, this.state.currentTable), this.state.currentCell);
			this.props.addQuestion(Object.assign({}, this.state.currentTable));
		} else {
			console.log("number of columns: ", this.state.currentTable.colNames.length);
			console.log("number of rows: ", this.state.currNumRows);
			console.log("number of items: ", this.state.currentTable.data.length);
			window.alert("Required fields are missing!");
		}
	}

	updateCurrentCell(index, format, instructionType) {
		let cell = {
			currentlyOpen: index,
			cellFormat: format,
			instructionType: instructionType
		};
		this.setState({currentCell: cell}, () => {
			this.props.updateCurrentQuestion(this.state.currentTable, this.state.currentCell);
		});
	}

	render() {
		return(
				<Card>
					<CardContent>
						{this.renderTableQuestion()}
					</CardContent>
				</Card>
		);
	}
}

export default Table;