import React, {Component} from 'react';
import './ConceptDialogButton.css';

export default class ConceptDialogButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      read: props.read,
      suggestionText: props.suggestionText || '',
      showInitially: props.showInitially || true,
      color: props.color || '#3F51B5' //should factor out
    }
  }
  render() {
    let {name, read, suggestionText, showInitially, color} = this.state;
    return <div role="button" style={{
        width: '100%',
        cursor: 'pointer',
        textDecoration: 'none',
        marginBottom: 10,
        borderRadius: 10,
        padding: '5px 20px 5px 20px'
      }}
      className="dialogbutton">
      <div style={{width: '100%'}}>
        <div>
          {name}{read && <span style={{fontSize: 20, color: 'white', marginLeft: 5}}>✓</span>}
        </div>
        <div style={{backgroundColor: 'blue'}}></div>
      </div>
    </div>
  }
}