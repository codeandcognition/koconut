import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from "@material-ui/core/Button/Button";
import {Link} from 'react-router-dom';

/**
 * ExerciseNavigation is the navigation bar that appears under the 
 * exercise when on the ExerciseView. It can be modified to support
 * more buttons, it uses React-Flexbox-Grid for easy layouting.
 *
 * @class
 */
export default class ExerciseNavigation extends Component {

  render() {
    // This next few lines of code finds the nextConcept based on the current concept.
    // It chooses order based on the relevance to the user from the BKT algorithm.
    // It is important to note that this relevance does not necessarily follow the order
    // of the concepts in the world view.
    let currentConceptIndex = 0;
    let orderedConcepts = this.props.getOrderedConcepts();
    orderedConcepts.forEach((d,i)=> {
      if(d.name === this.props.concept) {
        currentConceptIndex = i;
      }
    });
    let nextConcept = orderedConcepts[currentConceptIndex < orderedConcepts.length - 1 ? currentConceptIndex + 1 : 0].name
    
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
                <Link onClick={()=>this.props.generateExercise(nextConcept, "READ")}
                to={`/practice/${nextConcept}/practice-reading-code`} style={{textDecoration: 'none'}}>
                  <Button variant={"outlined"} color={"primary"} style={{margin: 5, textDecoration: 'none'}}>
                    NEXT Exercise
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