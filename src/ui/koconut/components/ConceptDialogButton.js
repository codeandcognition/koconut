import React, {Component} from 'react';
import './ConceptDialogButton.css';

/**
 * ConceptDialogButton is the class for each button on the world view concept dialog
 * popup.
 * @class
 */
export default class ConceptDialogButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      read: props.read,
      suggestionText: props.suggestionText || '',
      showInitially: props.showInitially || true,
      color: props.color || '#3F51B5', //should factor out,
      maximized: props.maximized || false
    }


    // width of hover box
    this.hoverWidth = '95%';

    // appearing initial height of hover box
    this.initHeight = 5;

    // total height the hover box goes to
    this.hoverHeight = '90%';

    this.types = {
      READ: 'read',
      UNREAD: 'unread'
    }
  }

  componentWillReceiveProps({name, read, suggestionText, showInitially, color, hover, maximized}) {
    this.setState({name, read, suggestionText, showInitially, color, hover, maximized});
  }



  render() {
    let {name, read, suggestionText, showInitially, color, hover, maximized} = this.state;
    return <div role="button" style={{
        width: '100%',
        cursor: 'pointer',
        textDecoration: 'none',
        marginBottom: 10,
        borderRadius: 10,
        padding: '5px 20px 0px 20px'
      }}
      className="dialogbutton"
      onMouseEnter={() => {this.setState({hover:true})}}
      onMouseLeave={() => {this.setState({hover:false})}}>
      <div style={{width: '100%', 
        position: 'relative',
        textAlign: 'center'}}>
        <div style={{
          marginBottom: 5
        }}>
          {name}{read === this.types.READ && <span style={{fontSize: 20, color: 'white', marginLeft: 5}}>✓</span>}
        </div>
        {suggestionText !== '' && <div style={{backgroundColor: color,
          position: 'absolute', 
          bottom: 0, 
          left:0,
          right:0,
          height: hover || (maximized && showInitially) ? this.hoverHeight : showInitially ? this.initHeight : 0,   
          width: this.hoverWidth, 
          margin: 'auto',
          transition: 'height 0.25s',
        }}><div style={{
          display: hover || (maximized && showInitially) ? 'inline' : 'none',
          color: 'white',
          transition: 'display 0.25s'
        }}>{suggestionText}</div></div>}
      </div>
    </div>
  }
}