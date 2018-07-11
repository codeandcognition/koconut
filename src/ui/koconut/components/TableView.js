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
   * updateAnswer will update the current answer's state and also pass it to
   * the app to be handled
   * @param choice answer chosen or typed in (sorry, bad name)
   * @param row row of question
   * @param col col of question
   */
  updateAnswer(choice: string, row: number, col: number) {
    let tempAns = this.state.answer;

    if(!tempAns[row]) {
      tempAns[row] = [];
    }

    tempAns[row][col] = choice;
    this.props.inputHandler(tempAns, this.props.questionIndex);
    this.setState({answer: tempAns});
  }

  /**
   * On mount, make sure the answer is set to the answer props if set
   * This allows for the question to remember the state if the window ever disappears
   * (Feedback window used to replace this window)
   */
  componentWillMount() {
    this.setState({answer: this.props.answer});
  }

  /**
   * generateCell generates a single cell and provides the logic for
   * updating the answer of the cell
   *
   * todo: add cases when necessary
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

  /**
   * generateTableView does the calculations for the contents of each cell
   * and creates the entire table to render.
   * @returns {jsx} Table for the entire problem
   */
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
    return (
        <div className='table-view'>
          {this.generateTableView()}
        </div>
    );
  }
}

export default TableView;
