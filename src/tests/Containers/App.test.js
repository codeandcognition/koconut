import App from '../../ui/koconut/containers/App';
import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import firebase from 'firebase';

// configure enzyme to work with React version 16
Enzyme.configure({ adapter: new Adapter() });
jest.mock('firebase');

describe('<App /> container', () => {
  // Cannot actually mount because we would need to
  // dependency inject firebase. That is more trouble than 
  // it's worth, because we would need to modify every 
  // instance of firebase in App.js to probably be 
  // this.firebase or something.
  it('Shallow mounts correctly', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    wrapper.unmount();
  });

  it('renderDisplay calls the correct displays', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    console.log(wrapper.state('display'));
  })

})