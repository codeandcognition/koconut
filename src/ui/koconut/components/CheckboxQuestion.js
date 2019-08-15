//@flow
import React, {Component} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

type Props = {
    choices: string[],
    prompt: string,
    inputHandler: Function,
    questionindex: number,
    feedback: any;
};

class CheckboxQuestion extends Component {
  state: {
    checkboxItems: any,
    selectedItems: any
  }

  constructor(props: Props) {
    super(props);

    // to ensure checkboxes are controlled input
    this.state = {
      checkboxItems: this.getDefaultCheckboxObject(),
      selectedItems: []
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // going between checkbox exercises. React still throws error on controlled vs uncontrolled input but doesn't affect behavior
    if(prevProps.choices !== this.props.choices) {
      this.setState({
        checkboxItems: this.getDefaultCheckboxObject(),
        selectedItems: []
      });
    }
  }

  /**
   * Return object with each checkbox item as key and value as false
   * For setting state.checkboxItems at beginning
   */
  getDefaultCheckboxObject() {
    let checkboxItems = {};
    this.props.choices.forEach(item => checkboxItems[item]=false);
    return checkboxItems;
  }

  /**
   * Allows for toggling of checkboxes
   * @param {event} e event of the form
   * @param {string} choice choice from the choices
   */
  handleChange(e: any, choice: string) {
    let choices = Object.assign({}, this.state.checkboxItems); // deep copy
    choices[choice] = e.target.checked;
    let selected = [];
    Object.keys(choices).forEach((item) => {
      if (choices[item]) {
        selected.push(item);
      }
    });
    this.setState({
      checkboxItems: choices,
      selectedItems: selected
    }, () => {
      this.props.inputHandler(this.state.selectedItems, this.props.questionIndex, this.props.fIndex);
    });
  }

  render() {
    let formGroupLabelStyles = {
      margin: "0"
    };

    return(
      <div>
        <p>{this.props.question.prompt}</p>
        <FormControl component={"fieldset"}>
          <FormGroup>
            {this.props.choices && this.props.choices.map((item, index) => {
              return (
                  <FormControlLabel style={formGroupLabelStyles} key={index} control={
                    <Checkbox
                        checked={this.state.checkboxItems[item]}
                        onChange={(e) => {
                            this.handleChange(e, item)
                          }}
                        value={item}
                    />
                  } label={<div>{item}
                    {this.props.feedback &&
                      <span style={{marginLeft: 5}}>
                        {(this.state.checkboxItems[item] && this.props.question.answer.indexOf(item) > -1) || 
                        (!this.state.checkboxItems[item] && this.props.question.answer.indexOf(item) < 0) 
                          ? <i className="fa fa-check" aria-hidden="true" style={{color: "#A6E84B"}}/>
                          : <i className="fa fa-times" aria-hidden="true" style={{color: "#D92722"}}/>
                        }
                      </span>
                    }
                  </div>} />
              );
            })}
          </FormGroup>
        </FormControl>
      </div>
    );
  }
}

export default CheckboxQuestion;