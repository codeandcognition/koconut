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

Flow gets upset if you import a `.css` file from `node_modules`. There doesn't appear to be any great solution. Just copy the file from `node_modules` and store it somewhere locally in `src`. ¯\_(ツ)_/¯
