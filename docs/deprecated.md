# deprecated
> :skull: _it's just floobits lol_ :skull:

## Using Floobits in WebStorm
**Floobits is buggy and no longer maintained, do not use it for general development** :sob:

> *(But we still use Floobits sometimes :ok_hand:)*

[Floobits](https://floobits.com) is a plugin for WebStorm (and other editors, like Atom) that enables Google Docs-like editing. This allows for live pair programming and ability to work remotely in a live environment.

To begin, you will want to create a Floobits account by either signing up or signing in using your GitHub account.

Next, install the Floobits plugin in WebStorm (or your preferred editor). To do this in WebStorm, you can simply navigate to `Preferences -> Plugins -> Browse repositories...` and search for "Floobits".

To join the Floobits project, go to `Tools -> Floobits -> Join Workspace by URL` and enter the following URL: `https://floobits.com/leannehwa/koconut/`. This will create a *new* WebStorm project that is separate from your normal local copy. You may either open a new project window or replace your current one with the new Floobits window.

To minimize the number of files that need to communicate between developers, you will need to `npm install` all the project dependencies.
