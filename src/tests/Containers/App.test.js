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

  it('display state at beginning is on LOAD', () => {
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


    wrapper.unmount();
  });


  it('stub test', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    wrapper.unmount();
  });

});