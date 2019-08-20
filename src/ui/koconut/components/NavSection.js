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

        let styleTight = {
            marginTop:'0px', 
            marginBottom:'0px',
            padding: '0px 12px'
        }

        return(
            <ExpansionPanel defaultExpanded={this.props.defaultExpanded ? this.props.defaultExpanded : false} style={{marginTop:'8px', marginBottom:'8px'}} >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{maxHeight:'40px', minHeight:'auto', paddingTop: '4px'}}>
                    <span style={{marginTop: '0px', marginBottom:'0px', padding:'4px'}}>{this.props.title}</span>
                    {this.props.progress}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={styleTight}>
                    {this.props.body}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

export default NavSection;