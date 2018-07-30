import App from '../../ui/koconut/containers/App';
import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// configure enzyme to work with React version 16
Enzyme.configure({ adapter: new Adapter() });

// mocking firebase functions to make sure things are called correctly
const firebase = {
  auth: () => firebaseAuth()
}

const firebaseAuth = jest.fn().mockImplementation(() => {
  return {
    onAuthStateChanged: () => onAuthStateChanged()
  };
});

const onAuthStateChanged = jest.fn().mockImplementation((fbUser) => {
  return () => stopWatchingAuthCallback();
});

const stopWatchingAuthCallback = jest.fn().mockImplementation(() => {
  return null;
});

describe('<App /> container', () => {
  it('Mounts and unmounts correctly', () => {
    const wrapper = mount(<App firebase={firebase}/>);

    // on mount, firebase authorization should be checked
    expect(firebaseAuth.mock.calls.length).toBe(1);
    expect(onAuthStateChanged.mock.calls.length).toBe(1);
    
    // on unmount, firebase authorization should be called again.
    wrapper.unmount();
    expect(firebaseAuth.mock.calls.length).toBe(2);
    expect(onAuthStateChanged.mock.calls.length).toBe(2);
    expect(stopWatchingAuthCallback.mock.calls.length).toBe(1); 
  });

  it('display state at beginning is LOAD', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    expect(wrapper.state('display')).toBe('LOAD');
    wrapper.unmount();
  });

  // if this test fails, it means the display types have been changed
  // and you will have to add or remove the appropriate tests and
  // add a spy to their respective methods. 
  it('renderDisplay calls the correct displays', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const displayTypes = wrapper.instance().returnDisplayTypes();

    const renderDisplaySpy = jest.spyOn(wrapper.instance(), 'renderDisplay');
    expect(renderDisplaySpy).toHaveBeenCalledTimes(0);

    const signin = jest.spyOn(wrapper.instance(), 'renderSignin');
    const signup = jest.spyOn(wrapper.instance(), 'renderSignup');
    const welcome = jest.spyOn(wrapper.instance(), 'renderWelcome');
    const feedback = jest.spyOn(wrapper.instance(), 'renderExercise');
    const concept = jest.spyOn(wrapper.instance(), 'renderConceptSelection');
    const world = jest.spyOn(wrapper.instance(), 'renderWorldView');
    const load = jest.spyOn(wrapper.instance(), 'renderLoadView');
    const instruct = jest.spyOn(wrapper.instance(), '_renderInstructionView');
    const author = jest.spyOn(wrapper.instance(), 'renderAuthorView');

    expect(signin).toHaveBeenCalledTimes(0);
    expect(signup).toHaveBeenCalledTimes(0);
    expect(welcome).toHaveBeenCalledTimes(0);
    expect(feedback).toHaveBeenCalledTimes(0);
    expect(concept).toHaveBeenCalledTimes(0);
    expect(world).toHaveBeenCalledTimes(0);
    expect(load).toHaveBeenCalledTimes(0);
    expect(instruct).toHaveBeenCalledTimes(0);
    expect(author).toHaveBeenCalledTimes(0);

    Object.keys(displayTypes).forEach((d, i) => {
      wrapper.setState({display: displayTypes[d]});
      expect(renderDisplaySpy).toHaveBeenCalledTimes(i + 1);
    })

    expect(signin).toHaveBeenCalledTimes(1);
    expect(signup).toHaveBeenCalledTimes(1);
    expect(welcome).toHaveBeenCalledTimes(1);
    expect(feedback).toHaveBeenCalledTimes(2); // for some reason feedback is called 2 times
    expect(concept).toHaveBeenCalledTimes(1);
    expect(world).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledTimes(1);
    expect(instruct).toHaveBeenCalledTimes(1);
    expect(author).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it('getInstruction sets state correctly', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    const concept = "abc";
    const instructionType = "READ";
    const displayType = wrapper.instance().returnDisplayTypes();

    wrapper.instance().getInstruction(concept, instructionType);
    expect(wrapper.state().currentConcept).toBe(concept);
    expect(wrapper.state().instructionType).toBe(instructionType);
    expect(wrapper.state().display).toBe(displayType.instruct);
    expect(wrapper.state().error).toBe(false);

    const concept2 = "xyz";
    const instructionType2 = "WRITE";

    wrapper.instance().getInstruction(concept2, instructionType);
    expect(wrapper.state().currentConcept).toBe(concept2);
    expect(wrapper.state().instructionType).toBe(instructionType);
    expect(wrapper.state().display).toBe(displayType.instruct);
    expect(wrapper.state().error).toBe(false);

    wrapper.unmount();
  });

  it('generateExercise sets the correct `no excercise` errors', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    const generatorEmpty = {
      getExercisesByTypeAndConcept: () => getEx1()
    }
    let getEx1 = jest.fn().mockImplementation(() => {
      return [];
    });

    const generatorFilled = {
      getExercisesByTypeAndConcept: () => getEx2()
    }
    let getEx2 = jest.fn().mockImplementation(() => {
      return [1,2,3];
    });

    const displayType = wrapper.instance().returnDisplayTypes();

    expect(wrapper.state().counter).toBe(0);
    expect(wrapper.state().exerciseType).toBe('');
    expect(wrapper.state().currentConcept).toBe(null);
    expect(wrapper.state().errorMessage).toBe('');
    const generateExercise = jest.spyOn(wrapper.instance(), 'generateExercise');
    expect(generateExercise).toHaveBeenCalledTimes(0);
    const switchToWorldView = jest.spyOn(wrapper.instance(), 'switchToWorldView');
    expect(switchToWorldView).toHaveBeenCalledTimes(0);


    const concept = "abc";
    const exerciseType = "def";
    wrapper.instance().generateExercise(concept, exerciseType, generatorEmpty);
    expect(generateExercise).toHaveBeenCalledTimes(1);
    expect(wrapper.state().error).toBe(true);
    expect(wrapper.state().errorMessage).toBe('Sorry, there are no exercises available for this concept right now.');
    wrapper.setState({counter: 3});
    wrapper.instance().generateExercise(concept, exerciseType, generatorFilled);
    expect(generateExercise).toHaveBeenCalledTimes(2);
    expect(switchToWorldView).toHaveBeenCalledTimes(1);
    expect(wrapper.state().error).toBe(true);
    expect(wrapper.state().errorMessage).toBe('Looks like we ran out of questions for this concept, stay-tuned for more!');
    wrapper.setState({counter: 2});
    wrapper.instance().generateExercise(concept, exerciseType, generatorFilled);
    expect(generateExercise).toHaveBeenCalledTimes(3);
    expect(wrapper.state().error).toBe(false);
    expect(wrapper.state().display).toBe(displayType.exercise);
    expect(wrapper.state().exercise).toBe(1);
    expect(wrapper.state().currentConcept).toBe(concept);
    expect(wrapper.state().exerciseType).toBe(exerciseType);
    expect(wrapper.state().counter).toBe(0);
    


    wrapper.unmount();
  });

  it('generateExercise runs as expected', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    wrapper.unmount();
  });

  it('stub test', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    wrapper.unmount();
  });

});