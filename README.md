# koconut
> :sparkles: *a very cool assess pool* :sparkles:

## Index
* [Project Information](https://github.com/RESPRiT/koconut#project-information)
* [Style Guide](https://github.com/RESPRiT/koconut#style-guide)
* [Setup and Usage](https://github.com/RESPRiT/koconut#setup-and-usage)
* [Resources](https://github.com/RESPRiT/koconut#resources)

## Other Docs
* Flow

## Project Information
### Technology Stack
Currently, *koconut* is built using [React](https://facebook.github.io/react/). In the future, the backend will
use Node.js, Express, and an undetermined database system.

### Tools
Development of *koconut* is assisted by the usage of:

* [Node.js](https://nodejs.org/en/): a JavaScript runtime
* [Flow](https://flow.org/): a type-checking system for JavaScript
* [Sass](http://sass-lang.com/): a CSS pre-processor
* [Storybook](https://storybook.js.org/): a live development environment
* [documentation.js](http://documentation.js.org/): a documentation generator

## Style Guide
### JavaScript
#### Style
JavaScript is written in [ES6](https://babeljs.io/learn-es2015/) with Flow style static typing.

#### Format
Code should be formatted similarly to [Google JavaScript Style](https://google.github.io/styleguide/jsguide.html).

For formatting this means:
* Block indents are +2 spaces
* Continuation indents are +4 space
* Tab character are not used
* Column limit (right margin) of 80 characters

Other formatting should also be consistent. It is worth noting that many IDEs
(including WebStorm) can automatically reformat code.

#### Documentation
JavaScript classes and functions should be commented with [JSDoc](http://usejsdoc.org/) style comments to help with documentation.

Not every tag needs to be used. The most important tags to use are:
* `@class`
* `@param`
* `@returns`

Comments should also have a brief description.

### CSS
Sass is written using SCSS syntax.

## Setup and Usage
### Installation
After cloning the repo, you can quickly install all the project dependencies
using the following command within the project directory:

`npm install`

Alternatively (and better-ly), you can use [Yarn :cat:](https://yarnpkg.com/en/):

`yarn install`

*You should know that [all npm commands can be replaced with Yarn commands](https://yarnpkg.com/en/docs/migrating-from-npm)!*

### Using the Development Scripts
To have a live preview of the application, simply run the following command:

`npm start`

This command does the following:
* Starts a development server that will host a live preview of the application
* Starts a Sass watcher which automatically generates CSS from SCSS files as
they are updated

To use the React Storybook and the documentation tools:

`npm run start-dev`

Storybook is hosted on port `:9009` and the docs are on `:4001`.

To start the development environment and the documentation tools:

`npm run start-all`

It is worth noting that for some reason this script doesn't like how start and start-dev play together, so it is generally better to run them separately.

To type check your code:

`npm run flow`

**If Flow is being mean to you** :cry::

`npm run make-flow-nicer`

### Using the Build Scripts
To build the application, simply run:

`npm run build`

It is worth noting that the project will not build if it does not correctly type check. Type checking can be ignore will the following:

`npm run build-ignore`

To build the React Storybook:

`npm run build-storybook`

To build the documentation:

`npm run build-docs`

To build everything:

`npm run build-all`

Similar to before, type checking can be ignored:

`npm run build-all-ignore`

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

**Note:** The default Flow directory that WebStorm will fill in will not work. It should look something like this: `[parent directories]/koconut/node_modules/.bin/flow`. Instead, use the following Flow executable: `[parent directories]/koconut/node_modules/flow-bin/vendor/flow`.

#### Using GitHub Version Control with WebStorm
You can register your GitHub account in WebStorm for easy version control:
[Registering GitHub Account in WebStorm](https://www.jetbrains.com/help/webstorm/registering-github-account-in-webstorm.html)

It is recommended that you use token authentication: [Personal API Tokens](https://github.com/blog/1509-personal-api-tokens)

#### ~~Using Floobits in WebStorm~~
**Floobits is buggy and no longer maintained, do not use it for general development** :sob:

*(We still use Floobits sometimes :ok_hand:)*

~~[Floobits](https://floobits.com) is a plugin for WebStorm (and other editors, like Atom) that enables Google Docs-like editing. This allows for live pair programming and ability to work remotely in a live environment.~~

~~To begin, you will want to create a Floobits account by either signing up or signing in using your GitHub account.~~

~~Next, install the Floobits plugin in WebStorm (or your preferred editor). To do this in WebStorm, you can simply navigate to `Preferences -> Plugins -> Browse repositories...` and search for "Floobits".~~

~~To join the Floobits project, go to `Tools -> Floobits -> Join Workspace by URL` and enter the following URL: `https://floobits.com/leannehwa/koconut/`. This will create a *new* WebStorm project that is separate from your normal local copy. You may either open a new project window or replace your current one with the new Floobits window.~~

~~To minimize the number of files that need to communicate between developers, you will need to `npm install` all the project dependencies.~~

## Todo
* Provide examples for Flow, Sass, Storybook
* Consider testing (Jest)
