import WorldView from '../../ui/koconut/containers/WorldView';
import {g, t} from '../../data/ConceptAbbreviations';
import {conceptInventory} from '../../data/ConceptMap';
import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ConceptCard from '../../ui/koconut/components/ConceptCard';
import {MemoryRouter} from 'react-router';

const firebase = {
  auth: () => firebaseAuth(),
  database: () => firebaseDatabase()
}

const firebaseDatabase = jest.fn().mockImplementation(() => {
  return {
    ref: (a) => {return {set: () => {return "set"}}}
  }
})
const firebaseAuth = jest.fn().mockImplementation(() => {
  return {
    onAuthStateChanged: () => onAuthStateChanged(),
    currentUser: {uid: 'asdf'}
  };
});

const onAuthStateChanged = jest.fn().mockImplementation((fbUser) => {
  return () => stopWatchingAuthCallback();
});

const stopWatchingAuthCallback = jest.fn().mockImplementation(() => {
  return null;
});

// configure enzyme to work with React version 16
Enzyme.configure({ adapter: new Adapter() });

// WorldView component tests
describe('<WorldView /> container', () => {
  const generateExercise = () => {
    return 2;
  }
  const getInstruction = () => {
    return 3;
  }

  it('WorldView mounts correctly', () => {
    const wrapper = mount(<MemoryRouter initialEntries={['/']}>
      <WorldView 
        firebase={firebase}
        generateExercise={generateExercise}
        getInstruction={getInstruction}/></MemoryRouter>
    );
    
    // test prop calls
    expect(wrapper.props().children.props.generateExercise()).toBe(2);
    expect(wrapper.props().children.props.getInstruction()).toBe(3);
    wrapper.unmount();
  });

  it('getOrderedConcepts contains only concepts in ConceptAbbreviations', () => {
    const wrapper = shallow(
      <WorldView 
        generateExercise={generateExercise}
        getInstruction={getInstruction}/>
    );
    const concepts = wrapper.instance().getOrderedConcepts();
    expect(concepts.length > 0).toBe(true);
    concepts.forEach((concept) => {
      expect(g[concept.name] !== undefined).toBe(true);
    });
    wrapper.unmount();
  });

  it('getConceptsByType filters correctly', () => {
    const wrapper = shallow(
      <WorldView 
        generateExercise={generateExercise}
        getInstruction={getInstruction}/>
    );
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
    wrapper.unmount();
  });

  it('renders correct amount of ConceptCards', () => {
    const wrapper = shallow(
      <WorldView
        generateExercise={generateExercise}
        getInstruction={getInstruction} />
    );
    const concepts = wrapper.instance().getOrderedConcepts();
    expect(wrapper.find(ConceptCard).length).toBe(concepts.length);
    wrapper.unmount();
  });
});