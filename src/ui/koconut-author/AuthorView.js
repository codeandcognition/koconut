import React, {Component} from 'react';
import { withRouter} from "react-router-dom";
import ExerciseTool from './ExerciseTool';
import InstructTool from './InstructTool';
import ConceptEditorView from './ConceptEditorView';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LoadingView from './../koconut/components/LoadingView';
import firebase from 'firebase';
import Routes from './../../Routes';

class AuthorView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			activeTab: 0
		}
	}

	componentWillMount() {
		this.authUnsub = firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({currentUser: user}, () => {
					this.checkAuthorStatus();
				})
			} else {
				this.setState({loading: false}, () => {
					this.props.history.push(Routes.signin);
				})
			}
		});
	}

	/**
	 * checks if the current firebase user is permitted to view the authoring page
	 */
	checkAuthorStatus() {
		let databaseRef = firebase.database().ref("Users/" + this.state.currentUser.uid);
		databaseRef.once("value", snapshot => {
			if (snapshot && snapshot.val()) {
				let snap = snapshot.val();
				if (snap.permission === "author") {
					this.setState({loading: false});
				} else {
					this.props.history.push(Routes.signin);
				}
			}
		});
	}


	componentWillUnmount() {
		this.authUnsub();
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
				<div>
					{
						this.state.loading ?
								<LoadingView/> :
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
					}
				</div>
		);
	}
}

export default withRouter(AuthorView);