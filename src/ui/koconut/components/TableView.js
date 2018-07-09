// @flow
import React, {Component} from 'react';
// import './TableView.css'; // TODO: Create this
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


type Props = {
  inputHandler: Function,
  questionIndex: number,
  question: any
}

/**
 * The TableView component renders a memory table exercise type
 * @class
 */
class TableView extends Component {
  state: {
  };

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  generateTableView() {
    let colNames = this.props.questions[this.props.questionIndex].colNames;

    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {colNames.map((d)=> {
                return <TableCell>{d}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {/*WIP*/}
          </TableBody>
        </Table>
      </Paper>
    );


  }

  render() {
    return (
        <div className='table-view'>
          {/*return <TableView question={this.props.question} inputHandler={update} questionIndex={index}/>;*/}

          {/*<h3>Type your response here:</h3>*/}
          {/*{*/}
            {/*<div className="short-response-value">*/}
              {/*<textarea onChange={(event) => {*/}
                {/*this.setState({value: event.target.value});*/}
                {/*this.props.inputHandler(event.target.value, this.props.questionIndex);*/}
              {/*}}>*/}
              {/*</textarea>*/}
              {/*<p>{this.state.value}</p>*/}
            {/*</div>*/}
          {/*}*/}
        </div>
    );
  }
}

export default TableView;
