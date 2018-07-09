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
 * The TableView component renders a table exercise type
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
    if(!this.props.question) {
      return "";
    }
    let colNames = this.props.question.colNames;
    let allCells = this.props.question.data;
    let augmentedCells = [];
    allCells.forEach((d, i) => {
      let arrayIndexToPushTo = Math.floor(i/colNames.length);
      if(!augmentedCells[arrayIndexToPushTo]) {
        augmentedCells[arrayIndexToPushTo] = [];
      }
      let subArrayIndex = i % colNames.length;
      augmentedCells[arrayIndexToPushTo][subArrayIndex] = d;
    });


    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {colNames.map((d, i)=> {
                return <TableCell key={"table-head" + i}>{d}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {augmentedCells.map((d, i) => {
              return (
                  <TableRow key={"row-" + i}>
                  {
                    d.map((e, j) => {
                      return <TableCell key={"cell"+i+j}>
                        {e.prompt}
                      </TableCell>
                    })
                  }
                </TableRow> );
            })}
          </TableBody>
        </Table>
      </Paper>
    );


  }

  render() {
    console.log("aa");
    return (
        <div className='table-view'>
          {this.generateTableView()}
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
