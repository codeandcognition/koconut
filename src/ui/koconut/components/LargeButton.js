// @flow
import React, {Component} from 'react';
import './LargeButton.css'
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

// type LargeButtonTypes = {
//   prev: string,
//   next: string
// }

// type Props = {
//   types: LargeButtonTypes,
//   type: string,
//   click: Function,
//   instructionIndex: number,
//   maxInstruction: number
// }
/**
 * LargeButton is the side buttons for the InstructView.
 * In reality I probably should have named this something else.
 * @class
 */
export default class LargeButton extends Component {
  render() {
    let greyed = false;
    let type = this.props.type;
    let prevType = this.props.types.prev;
    let nextType = this.props.types.next;
    let instrIndex = this.props.instructionIndex;
    let maxInstr = this.props.maxInstruction;
    if((type === prevType && instrIndex === 0) || (type === nextType && instrIndex+1 === maxInstr)) {
      greyed = true;
    }

    // probably went overboard with abstraction here, but it's very
    // simple to understand at least.
    return(
        <div className={"outerPart"}>
        <div className={`buttonPart ${greyed?"greyed":""}`}
          onClick={this.props.click}>
          {type===prevType &&
          <div><ChevronLeft className={"chevron"}/> <span className={"textPart"}>previous</span></div>
          }
          {type===nextType &&
          <div><span className={"textPart"}>next</span> <ChevronRight className={"chevron"}/></div>

          }
        </div>

        </div>
    )
  }
}