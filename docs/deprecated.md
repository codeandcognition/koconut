# deprecated
> :skull: _it's **not** just floobits lol_ :skull:

## To Be Clear
**None of this documentation is relevant to anything that is currently being worked on.**

**Everything here exists for the sake of having a historical reference if for whatever reason old commits/tools need be used.**

## Project Information

### Tools
- [Storybook](https://storybook.js.org/): a live development environment

## Setup and Usage

### Development Scripts

Command                    | Description
-------------------------- | -----------------------------------------------------------------------------------------------
`yarn run storybook`       | Starts the Storybook server on `:9009`
`yarn run start-dev`       | Starts both the Storybook and documentation.js servers

### Build Scripts

Command                    | Description
-------------------------- | -----------------------------------------------------------------------------------------------
`yarn run build-storybook`  | Builds the Storybook and dumps it in `/dev/storybook`
`yarn run build-all`        | Builds the application, Storybook, and documentation.js
`yarn run build-all-ignore` | Builds the application, Storybook, and documentation.js, ignoring type-checking

## Resources

### WebStorm

#### Using Floobits in WebStorm
**Floobits is buggy and no longer maintained, do not use it for general development** :sob:

> *(But we still use Floobits sometimes :ok_hand:)*

[Floobits](https://floobits.com) is a plugin for WebStorm (and other editors, like Atom) that enables Google Docs-like editing. This allows for live pair programming and ability to work remotely in a live environment.

To begin, you will want to create a Floobits account by either signing up or signing in using your GitHub account.

Next, install the Floobits plugin in WebStorm (or your preferred editor). To do this in WebStorm, you can simply navigate to `Preferences -> Plugins -> Browse repositories...` and search for "Floobits".

To join the Floobits project, go to `Tools -> Floobits -> Join Workspace by URL` and enter the following URL: `https://floobits.com/leannehwa/koconut/`. This will create a *new* WebStorm project that is separate from your normal local copy. You may either open a new project window or replace your current one with the new Floobits window.

To minimize the number of files that need to communicate between developers, you will need to `npm install` all the project dependencies.

#### William edit:

Floobits seems similar to VS Code Live Share plugin. It is in beta and is maintained by Microsoft. I saw it recently in a video and thought it looked fantastic. It's a very similar to Google Docs experience, and you even have console access. If you really want to edit stuff with more than one computer, use this. Though, you'll have to set up the flow environment (which is not as supported in VS Code than in Webstorm)
