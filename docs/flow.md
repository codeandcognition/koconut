# flow

> :hibiscus: just my _type_! :hibiscus:

## Overview

[Flow](https://flow.org/) is a type-checking system for JavaScript which allows for the addition of simple annotations to specify variable types.

Flow is [well documented](https://flow.org/en/docs/) online for most general things, but has some bugs/nuances that are worth noting.

It is worthwhile to note the [Flow + React](https://flow.org/en/docs/frameworks/react/) page in the documentation for information on annotating state and props (although you should also read the section below that discusses props).

## Content

- [Binding this to a method in a constructor](#binding-this-to-a-method-in-a-constructor)
- [Missing props annotations in constructors](#missing-props-annotations-in-constructors)
- [Annotating React types](#annotating-react-types)
- [Importing a new module from `node_modules`](#importing-a-new-module-from-node_modules)
- [Importing CSS from from `node_modules`](#importing-css-from-node_modules)

## Binding `this` to a method in a constructor

Flow will throw an error for declarations like the following:

```
constructor(props: Props) {
  super(props);
  this.state = {
    example: 'cool'
  };

  this.iAmError = this.iAmError.bind(this); // does not type-check
}
```

As noted in [this issue here](https://github.com/facebook/flow/issues/1397), you can do one of two things to fix it:

### Add a field:

> Flow expects you to explicitly specify all expected instance properties on a class. Assigning to `this` means creating an instance property -- and when you bind methods in this way, you are copying them to the instance as a property.

> So the workaround is to explicitly specify these re-bound methods as properties on the class as such:

```
class Foo {
  _fetch;          // here
  _rowHasChanged;  // these fields
  ...

  constructor(props){
        super(props);
        this.state =  getInitState(this);
        this._fetch = this._fetch.bind(this);
        this._rowHasChanged = this._rowHasChanged.bind(this);
        ...
    }
}
```

### Cheekily ignore the situation:

> Another workaround we've seen is to write `(this:any).foo = this.foo.bind(this)` where the `(this:any)` tells Flow to shut up about this error.

Preferably, you choose the first.

## Missing props annotations in constructors

If you are working with a component that has a constructor, you might get an error from Flow that demands you annotate props. There are several ways to do this, but we use the following convention (example snippet from the source):

```
// Create a type outside your class
type Props = {
  question: {
    prompt: string,
    code: string,
    type: string,
    answers?: string[]
  }
}

/**
 * The Exercise container contains all components of an assessment problem.
 * @class
 */
class Exercise extends Component {
  // (State should also be annotated)
  state: {
    prompt: string,
    code: string,
    type: string,
    answers?: string[],
    selected: ?string
  };

  // Specify that props' type is the one you defined above
  constructor(props: Props) {
    super(props);
    this.state = {
      prompt: props.question.prompt,
      code: props.question.code,
      type: props.question.type,
      answers: props.question.answers,
      selected: null
  };
}
```

The main takeaway here is to define a type outside the class and use that as the type for props. You can also annotate inline (i.e. `props: { prompt: string, ... }`) but this can make the constructor very cluttered. An explanation can be found [here](https://github.com/facebook/flow/issues/1694#issuecomment-238259947).

## Annotating React types

[This cheat sheet](https://www.saltycrane.com/blog/2016/06/flow-type-cheat-sheet/#lib/react.js) provides a handy reference for all of Flow's types. If things are really not working, you can use `any` and leave a comment.

## Importing a new module from `node_modules`

Flow has had [an issue for a long time](https://github.com/facebook/flow/issues/869) that makes importing modules from `node_modules` frustrating.

The quick explanation is that if you tell Flow to:

1. Ignore `node_modules`, it will complain that it can't find modules that you try to import from `node_modules`.
2. Not ignore `node_modules`, it will complain that a bunch of modules in `node_modules` fail to type check and muck up your error reports.

There are a lot of different solutions, we just use the one that happened to work for us:

If Flow complains that `Required module not found`, use the following script: `npm run make-flow-nicer`.

If that command does not work for some reason, you can manually create a module in the `/flow-typed` folder [like so](https://github.com/facebook/flow/issues/869#issuecomment-256643823):

```
declare module 'express' {  declare var exports: any;  }
declare module 'serve-favicon' {  declare var exports: any;  }
declare module 'morgan' {  declare var exports: any;  }
declare module 'cookie-parser' {  declare var exports: any;  }
declare module 'body-parser' {  declare var exports: any;  }
```

## Importing CSS from `node_modules`

Flow gets upset if you import a `.css` file from `node_modules`. There doesn't appear to be any great solution. Just copy the file from `node_modules` and store it somewhere locally in `src`. ¯\\_(ツ)\_/¯

## William's addendum on a hopefully simple introduction to Flow

When first starting, it might be confusing if you have never used Flow before. What flow does should be explained in another document. If you haven't read it, all you really need to know is that it's a static type checker. Omitting stuff doesn't necessarily make the app fail, but it might not build correctly.

Here is my personal guide on getting started making a very simple class using the flow-typer.

Start at the top of the file by putting `// @flow` at it, above the `import React`

```javascript
// @flow
import React, { Component } from 'react';
```

If you have props coming into this class, you want to define those types to be used later in your constructor

```javascript
type Props = {
	propA: string,
	propB: number,
	propC: Map<string, Type>
	propD: number[]
	propE: ?number
	propF: mixed
	propG: any
}
```

You can see some of the different types that are possible there. Here is a description from my understanding:
  * Map is what you use for objects if an object is coming in. You can make a custom type, for example this entire Props type is a type you can use later. Or you can have that type just be a generic number
  * You can use arrays
  * ? before it means that it might not be necessary I believe. Documentation might clarify that better. I haven't used this much myself.
  * I don't know the distinction between mixed and any. These are useful if you just want to go and not worry about the type for this. I used this for the firebaseUser object, because we can trust from Firebase that it will always be a firebaseUser.
  * There are flow-types for some libraries already. For example, there is a FirebaseUser flow type defined, but there were reasons for not using this that we came across.

Next, the class.

```javascript
export default class NewClass extends Component {
	// Similar to props, we have to type the states.
	state: {
		stateA: number,
		stateB: any
	}

	// Along with that, we have to type the self-variables if you made any,
	// as well as Functions (ONLY IF you want to call .bind(this) on them.)
	privateBoolean: boolean;
	functionA: Function;
	functionB: Function;

	// constructor. Note how we have the Props type used here!
	constructor(props: Props) {
		super(props);
		this.state = {
			stateA: 0,
			stateB: null // can be any type we want without having flow complain
		}

		// because functionA later calls setState, you want to
		// setState on THIS object, so we bind it to THIS now.
		this.functionA = this.functionA.bind(this);
	}

	// I should have mentioned that you have to flow type your parameters to functions
	// which is what we do for the constructor with props
	functionA(numberIn: number) {
		this.setState({stateA: numberIn});
	}

	render() {
		return (<div>And the rest is normal react</div>)
	}
}
```
