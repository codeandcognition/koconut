# jest
> :crown: _try and test me!_ :crown:

## Overview

[Jest](https://facebook.github.io/jest/) is a testing library for JavaScript which allows for the creation and execution of unit tests.

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
