// @flow
import React, {Component} from 'react';
import './TableView.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';


type Props = {
  inputHandler: Function,
  questionIndex: number,
  question: any,
  fIndex: number,
  hintFor: number,
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
      answer: [],
      hintFor: -1
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
    let cols = this.props.question.colNames.length;
    let rows = this.props.question.data.length / cols;
    let tempAns = this.state.answer;

    console.log(choice, row, col);
    console.log(this.props.feedback);

    for (let i = 0; i < rows; i++) {
      if (!tempAns[i]) {
        let temp = [];
				for (let j = 0; j < this.props.question.colNames.length; j++) {
					temp.push("");
        }
        tempAns[i] = temp;
      }
    }

    tempAns[row][col] = choice;

    this.setState({
      answer: tempAns,
    }, () => {
      this.props.inputHandler(tempAns, this.props.questionIndex, this.props.fIndex);
    });

    console.log(tempAns);
  }

  /**
   * On mount, make sure the answer is set to the answer props if set
   * This allows for the question to remember the state if the window ever disappears
   * (Feedback window used to replace this window)
   */
  componentWillMount() {
    this.setState({answer: this.props.answer ? this.props.answer : []});
  }

	/**
	 * The TableView is only being constructed once. When switching between different
	 * questions, the props are being updated. We need this method to update
	 * some table props (such as answer).
	 *
	 * @param nextProps
	 */
  componentWillReceiveProps(nextProps : Props) {
		this.setState({answer: nextProps.answer ? nextProps.answer : [], hintFor: nextProps.hintFor});
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
    if(question.type === "" && question.prompt) {
      return question.prompt;
    }

    if (question.code) {
      return this.renderMarkdown(question.code);
    }

    // to support hints, don't disable the buttons
    if(question.type === "multipleChoice") {
      let selected = this.state.answer[row] ? this.state.answer[row][col] : null;
      return <div>
        {question.choices && question.choices.map((d,i) => {
            return <span key={`choice${i}-${row}-${col}`}>
              <span onClick={() => {
                // if(!this.props.feedback) {
                //   this.updateAnswer(d, row, col);
                // }
								this.updateAnswer(d, row, col);
              }}
                  className={"custmct choicet " + (selected === d ? "answert":"" ) /* + " " + (this.props.feedback ? "disabledt" : "notdisabledt") */}
              >{d}</span>
            </span>
          })
        }
      </div>
    }

    // to support hints, don't disable the fields
    if(question.type === "fillBlank") {
      return <div>
        <textarea onChange={(event) => {
          // if(!this.props.feedback) {
          //   this.updateAnswer(event.target.value, row, col);
          // }
					this.updateAnswer(event.target.value, row, col);
        }} value={this.state.answer[row] ? this.state.answer[row][col] : ''} className={"blank"}>
        </textarea>
      </div>
    }
  }

  /**
   * Renders given string as code block markdown
   * @param cellData
   * @returns {*}
   */
  renderMarkdown(cellData: string) {
    let code = "```python\n" + cellData + "\n```";
    return <ReactMarkdown className={"flex-grow-1"}
                          source={code}
                          renderers={{code: CodeBlock}}
                          escapeHtml={true}
    />
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
      <div style={{width: "100%"}}>
      <Paper style={{width: "100%"}}>
        <Table>
          <TableHead>
            <TableRow>
              {colNames.map((d, i)=> {
                return <TableCell key={"table-head" + i} style={{backgroundColor: "white"}}>{d}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {augmentedCells.map((d, i) => {
              return (
                  <TableRow key={"row-" + i}>
                  {
                    d.map((e, j) => {
                      let correctness = "";
                      if (this.props.feedback && this.props.feedback[i]) { 
                        let temp = this.props.feedback[i][j];
                        if (temp.pass) {
                          correctness = "table-correct";
                        } else if (temp.pass === false) {
                          correctness = "table-wrong";
                        }
                      }

											let cols = this.props.question.colNames.length;
											let activeHint =  ((i * cols) + j) + 1;

											if (this.state.hintFor === activeHint && (correctness === "table-wrong" || correctness === "")) {
											  correctness += " table-hint"
                      }

                      return <TableCell key={"cell"+i+j} className={correctness !== "" ? correctness : "reg"}>
                        {this.generateCell(e,i,j)}
                      </TableCell>
                    })
                  }
                </TableRow> );
            })}
          </TableBody>
        </Table>
      </Paper>
      </div>
    );
  }

  render() {
    return (
        <div className='table-view' style={{textAlign: "left"}}>
          <ReactMarkdown className={"flex-grow-1"}
                         source={this.props.prompt}
                         renderers={{CodeBlock: CodeBlock}}/>
          {this.generateTableView()}
        </div>
    );
  }
}

export default TableView;
