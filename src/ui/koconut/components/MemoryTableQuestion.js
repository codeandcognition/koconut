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
	update: Function
}

class MemoryTableQuestion extends Component {
	constructor(props: Props) {
		super(props);
		this.state = {
			response: {}
		}
	}

	fields = {
		variableName: 'variableName',
		history: 'history'
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

		if (field === this.fields.variableName) {
			this.updateResponseKeys(value, index);
		} else if (field === this.fields.history) {
			this.updateResponseValues(value, index);
		}
	}

	/**
	 * updates the keys in the learner's response object stored in the state
	 * @param value
	 * @param index
	 */
	updateResponseKeys(value: string, index: number) {
		// update the key value
		let keys = Object.assign([], Object.keys(this.state.response));
		keys[index] = value;

		// construct the new response object
		let currentKeys = Object.assign([], Object.keys(this.state.response));
		let result = {};

		keys.forEach((key, i) => {
			let currKey = currentKeys[i];
			let value = this.state.response[currKey];
			if (value !== undefined) {
				result[key] = value;
			} else {
				result[key] = [];
			}
		});

		// update the state with the new response object
		this.setState({
			response: result
		}, () => this.props.update(this.state.response, this.props.questionIndex, this.props.fIndex));
	}

	/**
	 * updates the values in the learner's response object stored in the state
	 * @param value
	 * @param index
	 */
	updateResponseValues(value: string, index: number) {
		let values = value.split(',');
		// trim spaces if any
		for (let i = 0; i < values.length; i++) {
			values[i] = values[i].trimLeft();
			values[i] = values[i].trimRight();
		}

		let keys = Object.keys(this.state.response);
		let key = keys[index];
		let result = Object.assign({}, this.state.response);
		result[key] = values;

		this.setState({
			response: result
		}, () => this.props.update(this.state.response, this.props.questionIndex, this.props.fIndex))
	}

	render () {
		let size = Object.keys(this.props.question.answer).length;
		if (this.props.fIndex !== -1) {
			size = Object.keys(JSON.parse(this.props.question.answer)).length;
		}
		// determine the number of rows in the memory table
		let rows = [];
		for (let i = 0; i < size; i++) {
			let row = (
					<TableRow key={i}>
						<TableCell><TextField fullWidth onChange={this.handleChange('variableName', i)}/></TableCell>
						<TableCell><TextField fullWidth onChange={this.handleChange('history', i)}/></TableCell>
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