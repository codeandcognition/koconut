import React, {Component} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

type Props = {
    defaultExpanded: Boolean
}

class NavSection extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.getInstructionTitles) {
            this.props.getInstructionTitles();
        }
    }

    render() { 
        let column = {
            flexBasis: '33.33%',
        };

        return(
            <ExpansionPanel defaultExpanded={this.props.defaultExpanded ? this.props.defaultExpanded : false}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <p>{this.props.title}</p>
                    {this.props.progress}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {this.props.body}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default NavSection;