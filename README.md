![very cool status](https://img.shields.io/badge/very%20cool-passing-green.svg) ![flow status](https://img.shields.io/badge/flow-happy-yellow.svg) ![emoji status](https://img.shields.io/badge/emojis-active-blue.svg) ![productivity status](https://img.shields.io/badge/productivity-infinity-lightgrey.svg) ![reactmarkdown inline html](https://img.shields.io/badge/reactmarkdown%20inline%20html-finally%20working-green.svg)

# Codeitz (formerly Koconut)

## Index

- [Project Information](#project-information)
- [Style Guide](#style-guide)
- [Setup and Usage](#setup-and-usage)
- [Resources](#resources)

## Other Docs

- [Architecture + Design](docs/architecture.md)
- [Flow](docs/flow.md)
- [Jest](docs/jest.md)
- [Deprecated](docs/deprecated.md)
- [Accessing the authoring tool](src/ui/koconut-author/README.md)

## Project Information

### Technology Stack

Currently, _koconut_ is built using the following stack:

#### Frontend
- [React](https://facebook.github.io/react/): a visual framework
- [Sass](http://sass-lang.com/): a CSS pre-processor

#### Backend
- [Node.js](https://nodejs.org/en/): a JavaScript runtime
- [Firebase](https://firebase.google.com/): an easy-to-use storage and authentication system

#### Custom APIs
- [koconut-api](https://github.com/codeandcognition/koconut-api) is a Python API we built which checks correctness and handles user modeling

### Tools

Development of _koconut_ is assisted by the usage of:

- [Flow](https://flow.org/): a type-checking system for JavaScript
- [Jest](https://facebook.github.io/jest/): a JavaScript testing framework
- [documentation.js](http://documentation.js.org/): a documentation generator

## Style Guide

### JavaScript

#### Style

JavaScript is written in [ES6](https://babeljs.io/learn-es2015/) with Flow style static typing.

#### Format

Code should be formatted similarly to [Google JavaScript Style](https://google.github.io/styleguide/jsguide.html).

For formatting this means:

- Block indents are +2 spaces
- Continuation indents are +4 space
- Tab character are not used
- Column limit (right margin) of 80 characters

Other formatting should also be consistent. It is worth noting that many IDEs (including WebStorm) can automatically reformat code.

#### Documentation

JavaScript classes and functions should be commented with [JSDoc](http://usejsdoc.org/) style comments to help with documentation.

Not every tag needs to be used. The most important tags to use are:

- `@class`
- `@param`
- `@returns`

Comments should also have a brief description.

> Render methods do not need Flow annotations or `@returns` tags because typing is easily inferred and obvious to the reader.

### CSS

Sass is written using SCSS syntax.

## Setup and Usage

### Installation

After cloning the repo, you can quickly install all the project dependencies using the following command within the project directory:

`yarn install`

If you don't already have Yarn, you can install it using npm (which diplomatically lets you install its direct competitor :+1:):

`npm install yarn`

> Yarn is an alternative package manager that we use because it's both faster and cuter (_npm has no cats_ :cat:). [All `npm` commands can be replaced with `yarn` commands](https://yarnpkg.com/en/docs/migrating-from-npm)!

It may be necessary to change your version of Node and update package.json. Node v8.11.2 worked at time or writing. Run `n 8.11.2` to set the version of Node (download may be required) and then update package.json with `npm update`.

### Quick Start

To have a live preview of the application, simply run the following command:

`yarn start`

> This command does the following:

> - Starts a development server that will host a live preview of the application
> - Starts a Sass watcher which automatically generates CSS from SCSS files as they are updated

To also run the backend api, use a similar command:

`yarn start-all`

> - Starts a nodemon server that will host the backend server and update automatically when files are changed

n.b.: SASS has been behaving unusually (as of May 2019, node v10.15.3, npm v6.9.0, mac OS 10.14.3), so running `npx react-scripts start` can circumvent any SASS errors that prevent start-up.

### Development Scripts

Command                    | Description
-------------------------- | -----------------------------------------------------------------------------------------------
`yarn run start-docs`      | Starts the documentation.js server on `:4001`
`yarn run flow`            | Starts a Flow server and type-checks your code
`yarn run make-flow-nicer` | (Usually) fixes [Flow being mean to you](docs/flow.md#importing-a-new-module-from-node_modules)

### Build Scripts

Command                     | Description
--------------------------- | -------------------------------------------------------------------------------------------------------------------
`yarn run build`            | Builds the application and dumps it in `/build` and `/build_node`. **The project will not build if it does not correctly type-check**
`yarn run build-ignore`     | Builds the application, ignoring type-checking
`yarn run build-docs`       | Builds documentation.js and dumps it in `/dev/docs`

### Test Script~~s~~
Jest tests can be quickly run using `yarn test`.

## Resources

### WebStorm

[WebStorm](https://www.jetbrains.com/webstorm/) is a JavaScript (and more!) IDE that can assist with development. WebStorm (and all JetBrains software) is free to use for students through a yearly license which can be obtained [**here**](https://www.jetbrains.com/student/).

#### Using the Google Style Guide in WebStorm

You can automatically import the Google Style Guide into your settings by choosing it from the existing style guides:

`Preferences -> Editor -> Code Style -> JavaScript -> Set from… -> Predefined Style -> Google JavaScript Style Guide`

To automatically reformat code, you can simply `Code -> Reformat Code`.

#### Using Flow in WebStorm

You can use the follow instructions to add Flow support to WebStorm (you will probably already have Flow installed and will not need to add or change the project's `.flowconfig`): [Using Flow in WebStorm](https://blog.jetbrains.com/webstorm/2016/11/using-flow-in-webstorm/)

> **Note:** The default Flow directory that WebStorm will fill in will not work. It should look something like this:

> `[parent directories]/koconut/node_modules/.bin/flow`.

> Instead, use the following Flow executable:

> `[parent directories]/koconut/node_modules/flow-bin/vendor/flow`.

#### Using GitHub Version Control with WebStorm

You can register your GitHub account in WebStorm for easy version control: [Registering GitHub Account in WebStorm](https://www.jetbrains.com/help/webstorm/registering-github-account-in-webstorm.html)

It is recommended that you use token authentication: [Personal API Tokens](https://github.com/blog/1509-personal-api-tokens)

### VS Code
You can use Visual Studio Code instead of Webstorm, but you will find that it is harder to use Flow with. Visual Studio has an add-on for Flow that is a lot slower and feels a bit buggier, whereas Webstorm's feels very smooth. 

If you're just getting started, I highly suggest using Webstorm. Once you get more familiar with the code base, then you can choose to switch to Visual Studio Code.

### Tutorials and API References

#### JavaScript
- [MDN - A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
- [MDN - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

#### React
- [Official Docs (semi-tutorial)](https://facebook.github.io/react/docs/hello-world.html)
- [Intro to React](https://facebook.github.io/react/tutorial/tutorial.html)
- [React Developer Tools](https://github.com/facebook/react-devtools)

#### React Libraries
- [react-loadable](https://github.com/jamiebuilds/react-loadable):  A higher order component for loading components with promises

#### Sass
- [Sass Basics](http://sass-lang.com/guide)
- [Official Docs](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)

#### Flow
- [Official Docs](https://flow.org/en/docs/)

#### Jest
- [Getting Started](https://facebook.github.io/jest/docs/en/getting-started.html)
- [API reference](https://facebook.github.io/jest/docs/en/api.html)

#### Node.js
- [Official Docs](https://nodejs.org/en/docs/)
- [Getting Started](https://nodejs.org/en/docs/guides/getting-started-guide/)

#### Express
- [MDN - Express Web Framework (Node.js/JavaScript)](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)
- [API reference](http://expressjs.com/en/4x/api.html)

## A note for future developers on Koconut - September 2018

### The state of Koconut is a little jumbled up. 
I wouldn't entirely call it bad code, but there is repeated code, and it feels messy at some points. This was necessary in order to build upon the existing code architecture, and we tried to do it as neat as we could without introducing too much complexity. I encourage you to think about the complexity of your code before you program it in. 

### Conventions
The existing code for the most part is split into a container/component structure. Normally components means it's reused universally throughout the app in different places, but we found that the existing code before us had it split to where containers were the large entire-page views and components were subcomponents of the view. I highly suggest following existing conventions, because if you don't, the people who work on this codebase after you will be even more confused than you are.

### "i am now dizzy"
There is a lot to take in. It's normal to be lost on an entire structure of an app, especially when being put smack dab in the middle of it all. Take it one issue at a time. See what needs to be fixed or added, trace to where a component is by using the React developer tools and browser developer console. Add a BUNCH of `console.log` statements to get your bearings. Eventually you will slowly understand more and more of the system. But you won't understand all of it-- I (William) would say that I don't. 

### Exercise view structure
Probably the most important view to understand is the Exercise view. There are a lot of moving parts to this container, and it spans over more than 5 different files. Like I mentioned, this was because there was an existing architecture that we didn't want to destroy. 

Note that there is a distinction between **exercise** and **question**. Exercise is the entire exercise, which can have multiple questions or follow up questions.

Understanding the schemas first is key to actually understanding how it is all passed down. I encourage you to take a look through the firebase database and seeing how things link to one another, what an exercise looks like in the App as well as as-raw-data. Essentially, this complexity is for turning the data from json to an interactive experience.

* In essence, the `App.js` controls the logic for the entire app. (It might be beneficial to think about restructuring part of the app and using [Redux](https://redux.js.org/)). It has functions that check the answer, connect the exercises to firebase, etc. That's why it's so large!
* The `ExerciseView` component is imported at the top using the `react-loadable` library. This library allows code splitting to make the final output bundle to be split into multiple different bundles, reducing the maximum file size. See issue [#118](https://github.com/codeandcognition/koconut/issues/118) to learn more. It works seamlessly with React Router.
```
const ExerciseView = Loadable({
    loader: () => import('./ExerciseView'),
    loading: Loading,
});
```
* `renderExercise()` is called in the `renderDisplay()` method, and is based on the Route.
* `renderExercise()` actually creates the `ExerciseView` component, and passes a whole bunch of methods from `App` down. These methods are bound to `App` in the constructor. Some data from the state and such get passed down as well.
* In the `ExerciseView`, we display the `BreadCrumbs`, and we also conditionally display a `LoadingView` component or call the `renderQuestion()` method, based on if the exercise has loaded or not. This is due to the app waiting for the firebase database. 
* `ExerciseView` also keeps track of the answers that the user has entered, and passes it all the way back up to `App` when the submit button is pressed.
* In `renderQuestion()` we have a `Prompt` and `ReactMarkdown` component which pretty much displays prompt information about the specific exercise. We also have an `Information` component, which is the actual meaty part of the **exercises**. 
* The `Information` component has many of the props that were passed to `ExerciseView` from `App`. We're passing down the functions another layer.
* The `Information` component renders every question and also has the continue button logic. It also has subcomponents like the `Code` and `Response` components that are part of the questions, depending on what type of question it is. There is also the `Feedback` component which gives the user detailed information about their answer or the correct answer. The `Information` class holds more logic that is core to exercises than the `ExerciseView` does. 
* `Response` will conditionally render the question based on what type of question it is. If you want to add more types of problems, this is the place to add stuff to! You will also want to modify your Authoring tool to support the new types, and also modify the `ExerciseTypes.js` file to support the new types as well. 
* `Response` passes down specific props to each question that are key to answering the problem, like `inputHandler`, which is actually the prop passed to `Response`, `updateHandler`. This `updateHandler` method comes all the way from `ExerciseView`-- you can see it in the `renderExercise()` method. 
