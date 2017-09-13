![very cool status](https://img.shields.io/badge/very%20cool-passing-green.svg) ![flow status](https://img.shields.io/badge/flow-happy-yellow.svg) ![emoji status](https://img.shields.io/badge/emojis-active-blue.svg) ![productivity status](https://img.shields.io/badge/productivity-infinity-lightgrey.svg)

# koconut

> :sparkles: _a very cool assess pool_ :sparkles:

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

## Project Information

### Technology Stack

Currently, _koconut_ is built using the following stack:

#### Frontend
- [React](https://facebook.github.io/react/): a visual framework
- [Sass](http://sass-lang.com/): a CSS pre-processor

#### Backend
- [Node.js](https://nodejs.org/en/): a JavaScript runtime
- [Express](http://expressjs.com/): a web framework
- _TODO: unknown database_

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

### Quick Start

To have a live preview of the application, simply run the following command:

`yarn start`

> This command does the following:

> - Starts a development server that will host a live preview of the application
> - Starts a Sass watcher which automatically generates CSS from SCSS files as they are updated

To also run the backend api, use a similar command:

`yarn start-all`

> - Starts a nodemon server that will host the backend server and update automatically when files are changed

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

### Tutorials and API References

#### JavaScript
- [MDN - A re-introduction to JavaScript (JS tutorial)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
- [MDN - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

#### React
- [Official Docs (semi-tutorial)](https://facebook.github.io/react/docs/hello-world.html)
- [Intro to React](https://facebook.github.io/react/tutorial/tutorial.html)
- [React Developer Tools](https://github.com/facebook/react-devtools)

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
