import React, {Component} from 'react';
import './Signpost.css';

type Props = {
  direction: string,
  message: string,
  style: any
}

const DIRECTIONS = ['left', 'right', 'up', 'down']
const Signpost = (props) => {

  return (
    <div className={'direction'}>
      <p>
        {DIRECTIONS.includes(props.direction.toLowerCase()) &&
          <i className={`fa fa-arrow-${props.direction.toLowerCase()}`} 
            aria-hidden="true"></i>
        }
        {` ${props.message}`}
      </p>
    </div>
  )
}

export default Signpost