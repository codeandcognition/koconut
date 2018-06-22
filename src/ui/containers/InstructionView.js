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
  mounted: boolean;
  prevInstruction: Function;
  nextInstruction: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      currInstructionIndex: 0,
      instructionList: null
    };
    this.prevInstruction = this.prevInstruction.bind(this);
    this.nextInstruction = this.nextInstruction.bind(this);
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
        index > this.state.instructionList.length-2  ? // TODO probably better way to detect edge case
            this.state.instructionList.length-1 :     // mind fried atm
            index + 1});
    }
  }

  /**
   * On component mount, grab the data for the specific instruction off of
   * firebase.
   *
   * Filtering of which instruction list to show is based off the firebase
   * path rather than grabbing ALL the instructions and filtering here.
   * Might as well do that instead of calculations here because we call
   * firebase when instructions change anyways.
   *
   * Also sets a boolean this.mounted to true. This is so that when component
   * unloads, the firebase listener won't act.
   */
  componentDidMount() {
    this.mounted = true;
    this.firebaseListener = firebase.database()
      .ref(`Instructions/${this.props.conceptType}/${this.props.readOrWrite}`);
    this.firebaseListener.on('value', (snap) => {
      if(this.mounted) {
        this.setState({instructionList: snap.val()});
      }
    });
  }

  /**
   * Reset the firebaseListener to be instructions from the new props.
   * I don't think the way our program is structured will ever require this to
   * be called, but better safe than sorry.
   * @param nextProps- the new prop object being received
   */
  componentWillReceiveProps(nextProps: Props) {
    this.firebaseListener = firebase.database()
    .ref(`Instructions/${this.nextProps.conceptType}/${this.nextProps.readOrWrite}`);
    this.firebaseListener.on('value', (snap) => {
      if(this.mounted) {
        this.setState({instructionList: snap.val()});
      }
    });
  }

  /**
   * unmount the component and set this.mounted to be false, so firebaseListener
   * event doesn't continue firing uselessly.
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let chosenInstruction = null;
    if(this.state.instructionList) {
      chosenInstruction = this.state.instructionList[this.state.currInstructionIndex];
    }
    return (
      <div style={{marginTop: "100px", marginLeft: 40}}> {/* TODO REPLACE MARGIN */ }
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