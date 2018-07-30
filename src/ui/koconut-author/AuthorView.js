import React, {Component} from 'react';
import ExerciseTool from './ExerciseTool';
import InstructTool from './InstructTool';
import ConceptEditorView from './ConceptEditorView';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class AuthorView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: 0
		}
	}

	toggleDisplay(tabKey) {
		this.setState({
			activeTab: tabKey,
		})
	}

	render() {
		let menuStyle = {
			marginBottom: "4vh"
		};

		const allTabs = [<ExerciseTool/>, <InstructTool/>, <ConceptEditorView/>];

		return(
				<div style={{marginTop: "100px"}} className="container">
					<Paper style={menuStyle}>
						<Tabs value={this.state.activeTab} fullWidth centered>
							<Tab label={"Create Exercises"} id="EXERCISE TAB" onClick={() => this.toggleDisplay(0)}/>
							<Tab label={"Create Instructions"} id="INSTRUCT TAB" onClick={() => this.toggleDisplay(1)}/>
							<Tab label={"Edit Concepts"} id="CONCEPTS TAB" onClick={() => this.toggleDisplay(2)}/>
						</Tabs>
					</Paper>
					{allTabs[this.state.activeTab]}
				</div>
		);
	}
}

export default AuthorView;