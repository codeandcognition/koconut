import React, {Component} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class NavSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    {this.props.title}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {this.props.body}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default NavSection;