import React from 'react';

let style = {
  maxWidth: '80%',
  maxHeight: '40%',
  width: 'auto',
  height: 'auto',
}

function Image(props) {
  return <img {...props} style={style} />
}

export default Image;