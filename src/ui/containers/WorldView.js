// @flow
import React, {Component} from 'react';
import {ConceptKnowledge, MasteryModel} from '../../data/MasteryModel';

/**
 * WorldView is the world view for the app, where the user can see all the
 * exercises they can do and are suggested to do
 * @class
 */
class WorldView extends Component {

  /**
   * Returns sorted concepts list sorted by relevance to the user.
   * Only includes concepts where concept.teach is true and concept.container
   * is false
   * @returns {Array.<*>}
   */
  getOrderedConcepts(): ConceptKnowledge[] {
    return MasteryModel.model.filter((concept) => concept.teach && !concept.container).sort(
        (a, b) => (b.dependencyKnowledge / b.knowledge -
            a.dependencyKnowledge / a.knowledge));
  }


  render() {
    console.log(this.getOrderedConcepts());
    return (
        <div>

        </div>
    );
  }
}

export default WorldView;
