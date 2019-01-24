import React from 'react';

export default (props) => {
  console.log(props.children);
  return <div>{createAppName(20)}</div>
}

const createAppName = (size) => {
  return <><span style={{
    fontSize: size
  }}>Code</span><span style={{
    color: "#0088d5",
    fontSize: size
  }}>itz</span></>
}