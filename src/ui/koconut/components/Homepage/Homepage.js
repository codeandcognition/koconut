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
          <h1>{createAppName(40)}<small style={{color:'gray'}}><sup> (beta)</sup></small></h1>
        </Col>
      </Row>
      <Row>
        <Col md={6} style={{textAlign: 'left', fontSize: 18}}>
          <p>A better way to learn to code in Python.</p>
          <ul>
            <li>Are you about to start or starting your first Python course? 👩‍🏫</li>
            <li>Have you never programmed but are curious? 🤔</li>
            <li>Do you want to get paid to learn Python?** 🤑</li>
          </ul>
          <p>If you answer <strong>yes</strong> to any of these questions, {createAppName(18)} is perfect for you!</p>
          <p>Create an account and start learning now!</p>
          <small>**see study details after account creation for more information</small>
        </Col>
        <Col md={6}>
        {props.children}
        </Col>
      </Row>
      <Row style={{fontSize: 16, marginTop: '10vh'}}>
        <Col style={{margin: 'auto'}}>Built by <a style={{color: '#212529'}} href="http://benjixie.com/">Benjamin Xie</a> & the Code and Cognition Lab</Col>
      </Row>
      <Row>
        <Col style={{margin: 'auto'}}>The Information School | University of Washington</Col>
      </Row>
    </Grid>
  </div>
}

const createAppName = (size) => {
  return <><span style={{
    fontSize: size
  }}>Code</span><span style={{
    // color: "#607d8b",
    fontWeight: 'bold',
    fontSize: size
  }}>itz</span></>
}