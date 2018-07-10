import React, {Component} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class CheckboxQuestion extends Component {
  props: {
    choices: string[],
    prompt: string,
    inputHandler: Function
  }

  constructor(props) {
    super(props);

    this.state = {
      checkboxItems: {},
      selectedItems: []
    }
  }

  // TESTING
  componentWillReceiveProps() {
    this.forceUpdate();
  }

  handleChange(e, choice) {
    var choices = this.state.checkboxItems;
    choices[choice] = e.target.checked;
    var selected = [];
    Object.keys(choices).forEach((item) => {
      if (choices[item]) {
        selected.push(item);
      }
    });
    this.setState({
      checkboxItems: choices,
      selectedItems: selected
    }, () => {
      this.props.inputHandler(this.state.selectedItems, this.props.questionIndex);
    });
  }

  render() {
    var formGroupLabelStyles = {
      margin: "0"
    }

    return(
      <FormControl component={"fieldset"}>
        <FormLabel component={"legend"}>{this.props.prompt}</FormLabel>
        <FormGroup>
          {this.props.choices.map((item, index) => {
            return (
                <FormControlLabel style={formGroupLabelStyles} key={index} control={
                  <Checkbox
                      checked={this.state.checkboxItems[item]}
                      onChange={(e) => this.handleChange(e, item)}
                      value={item}
                  />
                } label={item} />
            );
          })}
        </FormGroup>
      </FormControl>
    );
  }
}

export default CheckboxQuestion;