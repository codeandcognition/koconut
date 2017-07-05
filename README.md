# koconut
:sparkles: *a very cool assess pool* :sparkles:

## Project Information
### Technology Stack
Currently, *koconut* is built using [React](https://facebook.github.io/react/). In the future, the backend will
use Node.js, Express, and an undetermined database system.

### Tools
Development of *kokonut* is assisted by the usage of:
* [Node.js](https://nodejs.org/en/): a JavaScript runtime
* [Flow](https://flow.org/): a type-checking system for JavaScript
* [Sass](http://sass-lang.com/): a CSS pre-processor
* [Storybook](https://storybook.js.org/): a live development environment
* [documentation.js](http://documentation.js.org/): a documentation generator

### Style Guide
#### JavaScript
JavaScript is written in ES6 with Flow style static typing. Code should be
formatted similarly to [Google JavaScript Style](https://google.github.io/styleguide/jsguide.html).

For formatting this means:
* Block indents are +2 spaces
* Continuation indents are +4 space
* Tab character are not used
* Column limit (right margin) of 80 characters

Other formatting should also be consistent. It is worth noting that many IDEs
(including WebStorm) can automatically reformat code.

JavaScript classes and functions should be commented with [JSDoc](http://usejsdoc.org/) style comments to help with documentation.

Not every tag needs to be used. The most important tags to use are:
* `@class`
* `@param`
* `@returns`

As well as

#### CSS
Sass is written using SCSS syntax.

## Setup and Usage
### Installation
After cloning the repo, you can quickly install all the project dependencies
using the following command within the project directory:

`npm install`

### Using the Development Scripts
To have a live preview of the application, simply run the following command:

`npm start`

This command does the following:
* Starts a development server that will host a live preview of the application
* Starts a Sass watcher which automatically generates CSS from SCSS files as
they are updated

To use the React Storybook:

`npm run storybook`

To serve the documentation:

`npm run doc-serve`

To start the development environment and the documentation tools:

`npm run start-all`

To type check your code:

`npm run flow`

### Using the Build Scripts
To build the application, simply run:

`npm run build`

To build the React Storybook:

`npm run build-storybook`

To build the documentation:

`npm run doc-build`

To build everything:

`npm run build-all`

## Resources
### WebStorm
[WebStorm](https://www.jetbrains.com/webstorm/) is a JavaScript (and more!) IDE that can assist with development.
WebStorm (and all JetBrains software) is free to use for students through a
yearly license which can be obtained [**here**](https://www.jetbrains.com/student/).

#### Using the Google Style Guide in WebStorm
You can automatically import the Google Style Guide into your settings by
choosing it from the existing style guides:

`Preferences -> Editor -> Code Style -> JavaScript -> Set from… -> Predefined
 Style -> Google JavaScript Style Guide`

To automatically reformat code, you can simply `Code -> Reformat Code`.

#### Using Flow in WebStorm
You can use the follow instructions to add Flow support to WebStorm (you will
probably already have Flow installed and will not need to add or change the
project's `.flowconfig`): [Using Flow in WebStorm](https://blog.jetbrains.com/webstorm/2016/11/using-flow-in-webstorm/)

#### Using GitHub Version Control with WebStorm
You can register your GitHub account in WebStorm for easy version control:
[Registering GitHub Account in WebStorm](https://www.jetbrains.com/help/webstorm/registering-github-account-in-webstorm.html)

It is recommended that you use token authentication: [Personal API Tokens](https://github.com/blog/1509-personal-api-tokens)

## Todo
* Provide examples for Flow, Sass, Storybook
* Consider testing (Jest)
* Determine file structure to some degree
