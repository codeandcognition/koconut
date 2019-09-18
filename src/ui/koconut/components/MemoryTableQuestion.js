// @flow
import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';

type Props = {
	question: any,
	fIndex: number,
	questionIndex: number,
	update: Function,
	feedback: string
}

const OUTPUT = 'OUTPUT';

class MemoryTableQuestion extends Component {
	constructor(props: Props) {
		super(props);

		let numRows = Object.keys(this.props.question.answer).length;

		this.state = {
			numRows: numRows,
			hasOutput: Object.keys(this.props.question.answer).includes(OUTPUT),
			values: this.getEmpty2dArray(numRows) 
		}
	}

	fields = {
		variableName: 'variableName',
		history: 'history'
	}

	componentDidMount(){
		this.addOutputToMemoryTable();
	}

	componentDidUpdate(prevProps) {
		// reset state on new question
		if(prevProps.question !== this.props.question) {
			let numRows = Object.keys(this.props.question.answer).length;
			this.setState({
				numRows: numRows,
				hasOutput: Object.keys(this.props.question.answer).includes(OUTPUT),
				values: this.getEmpty2dArray(numRows)
			}, () => this.addOutputToMemoryTable());
		}
	}

	/**
	 * get 2D array (num rows in answer x 2 cols) where first value is empty string (for var name) and 2nd is empty array (for values) 
	 * each array and value are unique (not references to each other)
	 */
	getEmpty2dArray(numRows) {
		// setting values in all rows and both columns to null
		let values = new Array();
		for(let i = 0; i < numRows; i++) { // do NOT use Array.fill() for objects b/c that makes all objects reference same one https://stackoverflow.com/a/47057799
			values[i] = new Array("", []); 
		}
		return values;
	}

	// add OUTPUT if necessary & not already existing
	addOutputToMemoryTable(){
		if(this.state.hasOutput && (this.state.values[this.state.numRows-1][0] !== OUTPUT)) {
			this.updateValuesInState(this.state.numRows-1, 0, OUTPUT);
		}
	}

	/**
	 * Given a column (0,1) or row (0 to rowNum-1), update value of state.values with val.
	 * Throw error if column or row not in that range
	 * @param {number} row  
	 * @param {number} col 
	 * @param {string} inputVal 
	 */
	updateValuesInState(row: number, col: number, inputVal: string) {
		if(row < 0 || row >= this.state.numRows || col < 0 || col > 1) throw "memory table state update: row or column out of range"; // #rollSafe

		let val = inputVal.trimLeft();
		val = val.trimRight();

		if(col == 1) { // turn comma separated values of string to array
			val = String(val).split(",").map(s => String.prototype.trim.apply(s)); // split by comma and trim whitespace
		}

		let tempValues = _.cloneDeep(this.state.values)
		tempValues[row][col] = val;
		this.setState(
			{values: tempValues},
			() => {
				let output = {};
				this.state.values.forEach(row => {
					if(typeof(row[0]) === 'string' && row[0].length>0) { // don't include row if variable name empty
						output[row[0]] = row[1];
					}
				});
				this.props.update(output, this.props.questionIndex, this.props.fIndex);
			}
		);
	}

	handleChange(field: string, index: number) {
		return (e: any) => {
			this.updateValuesInState(index, Object.keys(this.fields).indexOf(field), e.target.value);
		}
	}

	render () {
		// determine the number of rows in the memory table
		let rows = [];
		for (let i = 0; i < this.state.numRows; i++) {
			let disabled = this.props.feedback === "correct" || this.props.feedback === "incorrect";
			let isBottomRowAndOutput = (i == (this.state.numRows-1) && Object.keys(this.props.question.answer).includes(OUTPUT));
			
			let row = (
					<TableRow key={i}>
						<TableCell>
						{/* {isBottomRowAndOutput
							? <TextField fullWidth onChange={this.handleChange('variableName', i)} disabled={disabled} value={OUTPUT}/>
							: <TextField fullWidth onChange={this.handleChange('variableName', i)} disabled={disabled}/>
						} */}
						<TextField fullWidth onChange={this.handleChange('variableName', i)} disabled={disabled} value={this.state.values[i][0]} placeholder={'my_variable_name'} />
						</TableCell>
						<TableCell><TextField fullWidth
																	onChange={this.handleChange('history', i)}
																	disabled={disabled}
																	value={this.state.values[i][1]}
																	placeholder={`'value1', 'updated value1'`}
																	/>
																	</TableCell>
					</TableRow>
			);
			rows.push(row);
		}


		return(
				<Paper>
					{/* <p>Enter the values as a list of comma separated values</p> */}
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Variable Name</TableCell>
								<TableCell>Value History</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows}
						</TableBody>
					</Table>
				</Paper>
		);
	}
}

export default MemoryTableQuestion;
