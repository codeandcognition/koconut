// @flow
import React, {Component} from 'react';
import { Link, withRouter} from "react-router-dom";
import firebase from 'firebase';
import BreadCrumbs from '../components/BreadCrumbs';
import InstructionTitle from '../components/InstructionTitle';
import InstructionContent from '../components/InstructionContent';
import LoadingView from '../components/LoadingView';
import './InstructionView.css';
import Routes from './../../../Routes';

type Props = {
  conceptType: string,
  readOrWrite: string,
	generateExercise: Function,
	storeUserState: Function
}

/**
 * InstructionView component will show the instructions page
 * to the user.
 * @class
 */
class InstructionView extends Component {
  state: {
		readOrWrite: string;
    currInstructionIndex: number,
    instructionList: any, // will always be an instruction object from firebase
		conceptType: string
  };
  mounted: boolean;
  prevInstruction: Function;
  nextInstruction: Function;

  constructor(props: Props) {
    super(props);
    this.state = {
      currInstructionIndex: 0,
      instructionList: null,
			readOrWrite: "",
			conceptType: ""
    };
    this.prevInstruction = this.prevInstruction.bind(this);
    this.nextInstruction = this.nextInstruction.bind(this);
  }

  /**
   * prevInstruction sets the currentInstructionIndex state to 1 less
   * and to 0 if 0 or less.
   */
  prevInstruction() {
  	if (this.mounted) {
			let index = this.state.currInstructionIndex;
			this.setState({currInstructionIndex:
						index <= 0 ?
								0 :
								index - 1}, () => {
				// store user location on firebase
				this.storeUserState("instruction");
			});
		}
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
    	if (this.mounted) {
				this.setState({currInstructionIndex:
							index >= this.state.instructionList.length-1  ?
									this.state.instructionList.length-1 :
									index + 1}, () => {
					// store user location on firebase
					this.storeUserState("instruction");
				});
			}
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
   * sets the firebaseListener to null regardless if the link doesn't work
   *
   * Also sets a boolean this.mounted to true. This is so that when component
   * unloads, the firebase listener won't act.
   */
  componentDidMount() {
    this.mounted = true;
    this.authUnsub = firebase.auth().onAuthStateChanged(user => {
    	if (user && this.mounted) {
    		this.setState({conceptType: this.props.conceptType, readOrWrite: this.props.readOrWrite}, () => {
					// set the instruction list in state
					this.getUserState();
				})
			}
		});
		document.addEventListener("keydown", (e: any) => this.handleKeyPress(e.key));
  }

  handleKeyPress(key: string) {
    if (key === "ArrowRight") {
      this.nextInstruction();
    } else if (key === "ArrowLeft") {
      this.prevInstruction();
    }
  }

  /**
   * Reset the firebaseListener to be instructions from the new props.
   * I don't think the way our program is structured will ever require this to
   * be called, but better safe than sorry.
   * @param nextProps- the new prop object being received
   */
  componentWillReceiveProps(nextProps: Props) {
		this.updateInstructions();
  }

  /**
   * unmount the component and set this.mounted to be false, so firebaseListener
   * event doesn't continue firing uselessly.
   */
  componentWillUnmount() {
    this.mounted = false;
		window.removeEventListener('scroll', this.handleScroll);
    this.authUnsub();
  }

  navigateToPage(index: number) {
  	if (this.mounted) {
			this.setState({
				currInstructionIndex: index
			}, () => {
				// store user location on firebase
				this.storeUserState("instruction");
			});
		}
  }

	/**
	 * retrieve instruction data from firebase
	 */
	updateInstructions() {
		this.firebaseListener = firebase.database().
				ref(`Instructions/${this.state.conceptType}/${this.state.readOrWrite}`);
		this.firebaseListener.on('value', (snap) => {
			if (this.mounted) {
				this.setState({instructionList: snap.val()});
			}
		});
	}

	/**
	 * retrieve user's location on the instruction view
	 */
	getUserState() {
		if (firebase.auth().currentUser) {
			let userId = firebase.auth().currentUser.uid;
			let userRef = firebase.database().ref('Users/' + userId + '/state');
			let state = {};
			userRef.on('value', snap => {
				if (snap !== null) {
					state = snap.val();
					if (this.mounted) {
						this.setState({
							conceptType: state.concept,
							currInstructionIndex: state.counter,
							readOrWrite: state.type
						}, () => {
							this.updateInstructions();
						});
					}
				}
			});
		}
	}

	// store user's current location on the instruction view to firebase
	storeUserState(mode: string) {
		let state = {
			mode: mode,
			type: this.state.readOrWrite,
			concept: this.state.conceptType,
			counter: this.state.currInstructionIndex
		}
		let userId = firebase.auth().currentUser.uid;
		let userRef = firebase.database().ref('Users/' + userId + '/state');
		userRef.set(state);
	}

  render() {
    let chosenInstruction = null;
    if (this.state.instructionList) {
      chosenInstruction = this.state.instructionList[this.state.currInstructionIndex];
    }
    return (
				<div ref={"instructionView"}>
					{
						this.state.instructionList === null && chosenInstruction ? <LoadingView loadDisplay={() => {return}}/>
								:
								<div className={"overallView"}>
									<BreadCrumbs
											conceptType={this.props.conceptType}
											readOrWrite={this.props.readOrWrite}
											chosenInstruction={chosenInstruction}
											instructionOrPractice={"INSTRUCTION"}
											generateExercise={this.props.generateExercise}
											storeUserState={this.props.storeUserState}
											progress={(this.state.currInstructionIndex + 1) + " out of " + (this.state.instructionList && this.state.instructionList.length)}
									/>
									{this.state.instructionList && chosenInstruction &&
                  <div className={"content-container"}>
                    <button className={"nav-arrow-btn left-arrow"}
														onClick={() => this.navigateToPage(this.state.currInstructionIndex - 1 >= 0 ? this.state.currInstructionIndex - 1 : this.state.currInstructionIndex)}><i className="fas fa-chevron-left"></i></button>
                    <div className={"instruct-content-container"}>
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
                    <button className={"nav-arrow-btn right-arrow"} onClick={() => this.navigateToPage(this.state.currInstructionIndex + 1 < this.state.instructionList.length ? this.state.currInstructionIndex + 1 : this.state.currInstructionIndex)}><i className="fas fa-chevron-right"></i></button>
                  </div>
									}
								</div>
					}
					<div className={"dot-navigation-container"}>
						<div className={"dot-navigation-container2"}>
							<ul className={"dot-navigation"}>
								{this.state.instructionList && this.state.instructionList.map((item, index) => {
									var selectedStyle = {};
									if (index === this.state.currInstructionIndex) {
										selectedStyle = {
											color: "#3f51b5"
										}
									}
									return (
											<li className="dot" key={index} style={selectedStyle} onClick={() => this.navigateToPage(index)}><i className="fas fa-circle"></i></li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
    )
  }
}

export default withRouter(InstructionView);