import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from "@material-ui/core/Button/Button";
import {Link} from 'react-router-dom';


export default class ExerciseNavigation extends Component {
  render() {

    return <Paper elevation={6} style={{textAlign: 'center', padding: 20}}>
      <Grid fluid>
        <Row>
          {/* <Col md={6}> Use this space for a second set of buttons</Col> */}
          <Col md={12}>
            <Row>
              <div style={{textAlign: 'center', margin: 'auto', fontSize: 30}}>Move on</div>
            </Row>
            <Row>
              <Col md={12}>
                <Button variant={"outlined"} 
                  color={"primary"} 
                  disabled={!this.props.hasNextQuestion()} 
                  onClick={this.props.nextQuestion} 
                  style={{margin: 5, textDecoration: 'none'}}>
                  MORE EXERCISE
                </Button>
                <Link to="/test" style={{textDecoration: 'none'}}>
                  <Button variant={"outlined"} color={"primary"} style={{margin: 5, textDecoration: 'none'}}>
                    NEXT INSTRUCTION
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    </Paper>
  }
}