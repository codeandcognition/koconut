// @flow
import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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
		this.state = {
			hasOutput: Object.keys(this.props.question.answer).includes(OUTPUT),
			response: {} // {index: {"variableName": <var name>, "history": <histroy>}}
		}
	}

	fields = {
		variableName: 'variableName',
		history: 'history'
	}

	componentDidMount(){
		// add OUTPUT if necessary & not already existing
		if(this.state.hasOutput && !Object.keys(this.state.response).includes(OUTPUT)) {
			this.updateResponse(this.fields.variableName, OUTPUT, Object.keys(this.props.question.answer).length-1);
		}
	}

	handleChange(field: string, index: number) {
		return (e: any) => {
			this.updateResponse(field, e.target.value, index);
		}
	}

	/**
	 * updates the learner's response object
	 *
	 * @param field variableName or history
	 * @param value
	 * @param index
	 */
	updateResponse(field: string, value: any, index: number) {
		value = value.trimLeft();
		value = value.trimRight();
		index = String(index);

		// update the key value
		let tempResponses = Object.assign({}, this.state.response);

		if(tempResponses && typeof(tempResponses) === 'object') {
			if(!Object.keys(tempResponses).includes(index)) {
				tempResponses[index] = {};
			}

			if (field === this.fields.variableName) {
				tempResponses[index][this.fields.variableName] = value;
			} else if (field === this.fields.history) {
				tempResponses[index][this.fields.history] = String(value).split(",").map(s => String.prototype.trim.apply(s)); // split by comma and trim whitespace
			} else throw `field is malformed. Is ${field}`;
		}

		// update the state with the new response object
		this.updateResponseState(tempResponses);	
	}

	/**
	 * 
	 * @param {*} updatedResponse 
	 * Update response state in both MemoryTable and parent componet with this.props.update
	 * Tricky part is because this.state.response is of form {index: {fields.variableName: <var name>, fields.history: <value>}, index: {...}} 
	 * and this.props.update first param is of form {<var name>: <value>, ...}
	 */
	updateResponseState(updatedResponse: object) {
		this.setState({
			response: updatedResponse
		}, () => {
			let out = {};
			Object.keys(this.state.response).forEach((i) => {out[this.state.response[Number(i)][this.fields.variableName]] = this.state.response[i][this.fields.history] ? this.state.response[i][this.fields.history] : "";});
			this.props.update(out, this.props.questionIndex, this.props.fIndex);
		})
	}

	render () {
		let size = Object.keys(this.props.question.answer).length;
  
		// determine the number of rows in the memory table
		let rows = [];
		for (let i = 0; i < size; i++) {
			let disabled = this.props.feedback === "correct" || this.props.feedback === "incorrect";
			let isBottomRowAndOutput = (i == (size-1) && Object.keys(this.props.question.answer).includes(OUTPUT));
			
			let row = (
					<TableRow key={i}>
						<TableCell>
						{isBottomRowAndOutput
							? <TextField fullWidth onChange={this.handleChange('variableName', i)} disabled={disabled} value={OUTPUT}/>
							: <TextField fullWidth onChange={this.handleChange('variableName', i)} disabled={disabled}/>
						}
						</TableCell>
						<TableCell><TextField fullWidth
																	onChange={this.handleChange('history', i)}
																	disabled={disabled}/></TableCell>
					</TableRow>
			);
			rows.push(row);
		}


		return(
				<Paper>
					<p>Enter the values as a list of comma separated values</p>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Variable name</TableCell>
								<TableCell>Value history</TableCell>
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
