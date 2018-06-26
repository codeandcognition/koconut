import React, {Component} from 'react';
import ExerciseTool from './ExerciseTool';
import InstructTool from './InstructTool';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class AuthorView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: 0,
			exerciseToolIsActive: true
		}
	}

	toggleDisplay(tabKey, showExerciseTool) {
		this.setState({
			activeTab: tabKey,
			exerciseToolIsActive: showExerciseTool
		})
	}

	render() {
		let menuStyle = {
			marginBottom: "4vh"
		};

		return(
				<div style={{marginTop: "100px"}} className="container">
					<div className="header">
						<h1>This is the super cool authoring tool</h1>
					</div>
					<Paper style={menuStyle}>
						<Tabs value={this.state.activeTab} fullWidth centered>
							<Tab label={"Exercise Tool"} id="EXERCISE TAB" onClick={() => this.toggleDisplay(0, true)}/>
							<Tab label={"Instruction Tool"} id="INSTRUCT TAB" onClick={() => this.toggleDisplay(1, false)}/>
						</Tabs>
					</Paper>

					{this.state.exerciseToolIsActive ?
							<ExerciseTool /> : <InstructTool /> }
				</div>
		);
	}
}

export default AuthorView;