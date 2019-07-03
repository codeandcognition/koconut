import React, {Component} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './NavItem.css';

class NavItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			read: props.read,
			suggestionText: props.suggestionText || '',
		}
	}

	componentWillReceiveProps({ name, read, suggestionText}) {
		this.setState({ name, read, suggestionText});
	}

	render() {
		let complete = this.state.read ? { color: "#80B948" } : { color: "#F5F5F5"};
		let highlight = this.state.suggestionText ? { borderLeft: "5px solid #4054B2"} : {};
		return(
				<div>
					<ListItem className={"nav-item"} style={highlight}>
						{this.state.suggestionText && <p className={"recommendation"}>{this.state.suggestionText}</p>}
						<div className={"nav-item-info"}>
							<ListItemText className={"nav-item-text"} primary={this.state.name} />
							<div className={"item-status"}>
							{/* <div className={"item-status"} style={complete}><i className={"fas fa-check"} /> */}
							</div>
						</div>
					</ListItem>
				</div>
		);
	}
}

export default NavItem;