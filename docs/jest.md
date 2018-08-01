# jest and unit testing packages
> :crown: _try and test me!_ :crown:

## Overview

[Jest](https://facebook.github.io/jest/) is a testing library for JavaScript, built by Facebook, which allows for the creation and execution of unit tests.

[Enzyme](http://airbnb.io/enzyme/) is a React component testing library built by Airbnb, which allows you to mount virtual components and test outputs.

## Usage

### Introduction 

See existing tests for more examples if this isn't exactly clear.

First you want to import everything

```javascript
import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../../ui/koconut/containers/App';
```
* React needs to be imported for the JSX to compile later on
* Enzyme's shallow and mount are what will be 'mounting' the component later on
* Adapter is what tells Enzyme that we're using version 16 of React
* App is the component we want to test

### Mocking functions and dependency injection

[This series](https://www.youtube.com/watch?v=Eu35xM76kKY) by MPJ on youtube will teach you a lot about the mindset here for dependency injection.

I will go into the basics: You might often hear about function mocking and dependency injections. When unit testing, we want to isolate the problem to a specific function, and not worry much about any complicated moving parts. For example, if we had a function `foo()` that looked like this:

```javascript
const foo = (url) => {
  fetch(url).then(() => {doSomething()});
}

foo('totallyrealurl.com/apiendpoint?=params');
```

In order for you to test it, you would have to make a call to a **real url** every single time you wanted to test this function. Imagine if `foo()` was larger, and had a million functionalities that you wanted to test. Obviously not ideal.

Something to do instead is to actually **pass in** actual `fetch` to the function as a parameter:

```javascript
const foo = (url, fetchIn) => {
  fetchIn(url).then(() => {doSomething()});
}

foo('totallyrealurlagain.com/apiendpoint?=params', fetch);
```

(In reality, `doSomething()` should be dependency injected too). Doing something like this, you can now do what is called "mocking" a function during a test. You can pass in a function that will always return something, will return a random thing, return different things on the first call and second call, count calls to the function, see parameters and return values of the function. Basically everything in [this](https://jestjs.io/docs/en/mock-functions) page!

What does this look like in practice?

Well, I mocked the `firebase` package in `App.js` in `App.test.js`, because I didn't want to make real firebase calls every single time the App was mounted/initialized.

What I did was:

```javascript
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
```

Why this mess of chains? Well, I wanted it to be verbose so that we can see exactly what a function returns and where the chains are. In this case, calling `firebase.auth().onAuthStateChanged()` returns a function that when called, will return `null` (the real implementation just stops the authentication listener). When I made the function using `jest.fn().mockImplementation(() => {})`, I can now do a whole bunch of data grabbing from it. For example, I can write a test like this:

```javascript
it('getInstruction sets state correctly', () => {
  const wrapper = shallow(<App firebase={firebase}/>);
  const getInstruction = jest.spyOn(wrapper.instance(), 'getInstruction');
  expect(getInstruction).toHaveBeenCalledTimes(0);

  const displayType = wrapper.instance().returnDisplayTypes();

  const concept = "abc";
  const instructionType = "def";
  wrapper.instance().getInstruction(concept, instructionType);
  expect(getInstruction).toHaveBeenCalledTimes(1);

  expect(wrapper.state().currentConcept).toBe(concept);
  expect(wrapper.state().instructionType).toBe(instructionType);
  expect(wrapper.state().display).toBe(displayType.instruct);
  expect(wrapper.state().error).toBe(false);
  
  wrapper.unmount();
});
```
Let's take it a few lines at a time.

```javascript
it('getInstruction sets state correctly', () => {
```
`it` is part of the jest package. Notice how we didn't have to `import` any jest packages at the beginning of our file. This is because it is automatically invoked when we call the `jest` command in the terminal. 

`getInstruction sets state correctly` is the title of the test, that will appear nicely when we call the test, and give us a nice checkmark or x by it if it passes or fails.

The callback function it calls will be our own defined function.

```javascript
const wrapper = shallow(<App firebase={firebase} />);
```
We plug in the React component like we would in a regular React app. We can pass it props normally as well. In this case, I pass in my **fake** firebase that I showed earlier. Mount will mount the app in the `wrapper` object. This will let us call commands on it, or keep track of things. The Enzyme documentation really helps you learn about what you can do with this. 

`shallow` will only mount a 'shallow' copy, and I don't think it mounts the children. I believe it doesn't call the `componentDidMount()` function either. `mount` (in the place of shallow) will mount an actual copy, and as such, will take longer during the test. (`shallow` tests are around ~5ms, `mount` tests are around ~60ms)

```javascript
const getInstruction = jest.spyOn(wrapper.instance(), 'getInstruction');
```
This stores a spy on the function in App.js called `getInstruction`. This allows me to later on count using

```javascript
expect(getInstruction).toHaveBeenCalledTimes(0);
```
how many times the function has been invoked.

```javascript
expect(wrapper.state().currentConcept).toBe(concept);
expect(wrapper.state().instructionType).toBe(instructionType);
expect(wrapper.state().display).toBe(displayType.instruct);
expect(wrapper.state().error).toBe(false);
```
You can use `wrapper.state()` to get the state of the app. It also works like `wrapper.state('currentConcept')` for only a single state if you want.

`expect(x).toBe(y)` is what jest uses to test if your actual equals the expected.

```javascript
wrapper.unmount()
```
Unmount the wrapper to not use any unecessary memory.

You can also use things like `wrapper.setState({a: b})` or `wrapper.setProps({a: b})` to invoke the component's `render()` method or `componentWillReceiveProps()` method.

## Content

- [Error watching file for changes: EMFILE](#error-watching-file-for-changes-emfile)

## Error watching file for changes: EMFILE

On MacOS machines, running Jest can sometimes give an error that looks like [this](https://github.com/facebook/jest/issues/3436#issue-225756491):

```
2017-05-02 09:49 node[8980] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
2017-05-02 09:49 node[8980] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
2017-05-02 09:49 node[8980] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
events.js:163
      throw er; // Unhandled 'error' event
      ^

Error: Error watching file for changes: EMFILE
    at exports._errnoException (util.js:1050:11)
    at FSEvent.FSWatcher._handle.onchange (fs.js:1376:11)
error Command failed with exit code 1.
```

This is a [documented issue](https://github.com/facebook/jest/issues/3436) and can be solved by installing `watchman` using `brew`:

`brew install watchman`

[Alpha builds](https://github.com/facebook/jest/issues/1767#issuecomment-313434888) of Jest also fix this issue, so an update may be the final solution at some point.

## See also
https://github.com/codeandcognition/koconut/issues/70#issuecomment-400870734