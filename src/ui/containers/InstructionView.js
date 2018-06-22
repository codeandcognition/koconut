// @flow
import React, {Component} from 'react';
import firebase from 'firebase';
import BreadCrumbs from '../components/BreadCrumbs';
import InstructionTitle from '../components/InstructionTitle';
import InstructionContent from '../components/InstructionContent';

type Props = {
  conceptType: string,
  readOrWrite: string
}

/**
 * InstructionView component will show the instructions page
 * to the user.
 * @class
 */
export default class InstructionView extends Component {
  state: {
    currInstructionIndex: number,
    instructionList: any // will always be an instruction object from firebase
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currInstructionIndex: 0,
      instructionList: null
    };
  }

  /**
   * prevInstruction sets the currentInstructionIndex state to 1 less
   * and to 0 if 0 or less.
   */
  prevInstruction() {
    let index = this.state.currInstructionIndex;
    this.setState({currInstructionIndex:
      index <= 0 ?
          0 :
          index - 1});
  }

  /**
   * nextInstruction sets the currentInstructionIndex state to 1 more
   * and to instructionList state length if that length or more.
   *
   * @pre this.state.instructionList must be non-null
   */
  nextInstruction() {
    let index = this.state.currInstructionIndex;
    // nextInstruction checks if instructionList exists, unlike prevInstruction
    // which doesn't rely on that existence.
    // InstructionList should always exist when this function is called,
    // so it's just to be safe (and possibly make flow not complain.
    if(this.state.instructionList) {
      this.setState({currInstructionIndex:
        index >= this.state.instructionList.length ?
            this.state.instructionList.length :
            index + 1});
    }
  }

  componentWillMount() {
    // set up firebase listener
    // set instructionlist to that.
  }

  render() {
    let chosenInstruction = null;
    if(this.state.instructionList) {
      chosenInstruction = this.state.instructionList[this.state.currInstructionIndex];
    }
    return (
      <div style={{marginTop: 40}}>
        <BreadCrumbs />
        {this.state.instructionList &&
            <div>
              <InstructionTitle
                  instruction={chosenInstruction}/>
              <InstructionContent
                  maxInstruction={this.state.instructionList.length}
                  instruction={chosenInstruction}
                  currentInstructionIndex={this.state.currInstructionIndex}
                  prev={this.prevInstruction}
                  next={this.nextInstruction}
                />
            </div>
        }
      </div>
    )
  }
}