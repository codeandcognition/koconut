import React, {Component} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './NavItem.css';

// icons corresponding to instruction vs exercise
const FA_ICONS = {
	"INSTRUCTION": "fa-check",
	"EXERCISE": "fa-star"
}

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
		let complete = this.state.read ? { color: "#80B948" } : { color: "#F5F5F5"}; // checkmark is green if complete
		let highlight = this.state.suggestionText ? { borderLeft: "5px solid #4054B2"} : {}; // recommendation adds blue accent
		let icon = this.props.isExercise ? FA_ICONS.EXERCISE : FA_ICONS.INSTRUCTION;
		highlight["color"] = "black"; // poor code style
		return(
				<div>
					<ListItem className={"nav-item"} selected={this.props.index==this.props.selectedIndex} style={highlight}>
						{this.state.suggestionText && 
						<p className={"recommendation"}>
							<i className={`fa ${this.props.icon}`}/>
							{this.state.suggestionText}
						</p>}
						<div className={"nav-item-info"}>
							<ListItemText className={"nav-item-text"} primary={this.state.name} />
							<div className={"item-status"} style={complete}>
								<i className={`fas ${icon}`} ></i>
							</div>
						</div>
					</ListItem>
				</div>
		);
	}
}

export default NavItem;