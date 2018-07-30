//@flow
import React, {Component} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
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

    this.state = {
      checkboxItems: {},
      selectedItems: []
    }
  }

  /**
   * Allows for toggling of checkboxes
   * @param {event} e event of the form
   * @param {string} choice choice from the choices
   */
  handleChange(e: any, choice: string) {
    let choices = this.state.checkboxItems;
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
      <FormControl component={"fieldset"}>
        <FormGroup>
          {this.props.choices && this.props.choices.map((item, index) => {
            return (
                <FormControlLabel style={formGroupLabelStyles} key={index} control={
                  <Checkbox
                      checked={this.state.checkboxItems[item]}
                      disabled={this.props.feedback ? true : false}
                      onChange={(e) => {
                          if(!this.props.feedback) {
                            this.handleChange(e, item)
                          }
                        }}
                      value={item}
                  />
                } label={<div>{item} 
                  {this.props.feedback && 
                    <span style={{marginLeft: 5}}>
                      <svg height={10} width={10}>
                        <circle cx={5} cy={5} r={5} fill={
                          (this.state.checkboxItems[item] && this.props.question.answer.indexOf(item) > -1) || 
                          (!this.state.checkboxItems[item] && this.props.question.answer.indexOf(item) < 0) ? "green" : "red"
                        }/>
                      </svg>
                    </span>
                  }
                </div>} />
            );
          })}
        </FormGroup>
      </FormControl>
    );
  }
}

export default CheckboxQuestion;