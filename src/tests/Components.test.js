import WorldView from '../ui/koconut/containers/WorldView';
import {g, t} from '../data/ConceptAbbreviations';
import {conceptInventory} from '../data/ConceptMap';
import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// configure enzyme to work with React version 16
Enzyme.configure({ adapter: new Adapter() });

// WorldView component tests
describe('<WorldView /> component', () => {
  const generateExercise = () => {
    return null;
  }

  const getInstruction = () => {
    return null;
  }

  const wrapper = shallow(
    <WorldView 
      generateExercise={generateExercise}
      getInstruction={getInstruction}/>
  );

  it('getOrderedConcepts contains only concepts in ConceptAbbreviations', () => {
    const concepts = wrapper.instance().getOrderedConcepts();
    concepts.forEach((concept) => {
      expect(g[concept.name] !== undefined).toBe(true);
    });
  });

  it('getConceptsByType filters correctly', () => {
    const orderedConcepts = [{type: "a"}, {type: "b"}, {type: "c"},
                            {type: "a"}, {type: "b"}, {type: "c"},
                            {type: "a"}, {type: "b"}, {type: "c"},
                                         {type: "b"}, {type: "c"},
                                         {type: "b"}, {type: "c"},
                                                      {type: "c"}];
    const getConceptsByType = wrapper.instance().getConceptsByType;
    expect(getConceptsByType(orderedConcepts, "a").length).toBe(3);
    expect(getConceptsByType(orderedConcepts, "b").length).toBe(5);
    expect(getConceptsByType(orderedConcepts, "c").length).toBe(6);
  })
});