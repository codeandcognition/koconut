// @flow
import React, {Component} from 'react';
import './TableView.css'; // TODO: Create this
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
    answer: any
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      answer: []
    };
  }

  /**
   *
   * @param choice
   * @param row
   * @param col
   */
  updateAnswer(choice: string, row: number, col: number) {
    console.log(choice, row, col);
    let tempAns = this.state.answer;

    if(!tempAns[row]) {
      tempAns[row] = [];
    }

    tempAns[row][col] = choice;
    this.props.inputHandler(tempAns, this.props.questionIndex);
    this.setState({answer: tempAns});
  }

  componentWillMount() {
    this.setState({answer: this.props.answer});
  }

  /**
   *
   * @param question individual table cell question
   * @param row row of question
   * @param col col of question
   */
  generateCell(question: any, row: number, col: number) {
    if(question.type === "") {
      return question.prompt;
    }

    if(question.type === "multipleChoice") {
      let selected = this.state.answer[row] ? this.state.answer[row][col] : null;
      return <div>
        {
          question.choices.map((d,i) => {
            return <span key={`choice${i}-${row}-${col}`}>
              <span onClick={() => this.updateAnswer(d, row, col)}
                  className={"custmc choice " + (selected == d?"answer":"" )}
              >{d}</span>
            </span>
          })
        }
      </div>
    }

    if(question.type === "fillBlank") {
      return <div>
        <textarea onChange={(event) => {
          this.updateAnswer(event.target.value, row, col);
        }} value={this.state.answer[row] ? this.state.answer[row][col] : ''}>
        </textarea>
      </div>
    }


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
                        {this.generateCell(e,i,j)}
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
