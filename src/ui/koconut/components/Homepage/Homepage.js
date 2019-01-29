import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';

/**
 * @class Homepage
 * @classdesc Homepage takes in the element that appears on the right side
 * of the homepage (Sign in box or Sign up box)
 */
export default (props) => {
  // console.log(props.children);
  return <div>
    <Grid>
      <Row>
        <Col>
          <h1>{createAppName(40)}</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6} style={{textAlign: 'left'}}>
          <p>An intelligent tutoring system for introductory Python programming</p>
          <ul>
            <li>Are you new to programming?</li>
            <li>Are you currently enrolled in a Python course?</li>
            <li>Are you studying for a Python exam?</li>
            <li>Do you want to brush up on your Python knowledge?</li>
          </ul>
          <p>If you answer <strong>yes</strong> to any of these questions, {createAppName(15)} is perfect for you!</p>
          <p>Create an account to try it now!</p>
        </Col>
        <Col md={6}>
        {props.children}
        </Col>
      </Row>
      <Row style={{fontSize: 18, marginTop: '10vh'}}>
        <Col style={{margin: 'auto'}}>Built at the Code and Cognition Lab</Col>
      </Row>
      <Row>
        <Col style={{margin: 'auto'}}>Information School | University of Washington</Col>
      </Row>
    </Grid>
  </div>
}

const createAppName = (size) => {
  return <><span style={{
    fontSize: size
  }}>Code</span><span style={{
    color: "#0088d5",
    fontSize: size
  }}>itz</span></>
}