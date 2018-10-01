const {exec} = require('child_process');
const fs = require('fs');

// createfile will first create the file based on the body and content
// it will either throw an error if it fails, or will call next() if it succeeds
exports.createfile = (req, res, next) => { 
  console.log(`generating code from the following:\n${req.body.content}`);

  let code = req.body.content || '';

  // Make sure the user isn't trying to bug up our server
  // We definitely will have to sanity check!
  if(code.length > 10000) {
    res.json({
      status: "Error: too long",
      error: "Code provided too long",
      stderr: ''
    });
  } else if(code.indexOf("import") !== -1) {
    res.json({
      status: "Error: invalid import",
      error: "import command not allowed",
      stderr: ''
    })
  } else {
    fs.writeFile(`api/python/tmp/${req.body.id}.py`, code, (err) => {
      if(err) throw err;
      console.log('successful write');
      next();
    });
  }
}

// execute will run the python code with a 1 second timeout so that 
// nothing resource intensive happens
exports.execute = (req, res, next) => {
  exec(`python api/python/tmp/${req.body.id}.py`, {timeout: 1000}, (err, stdout, stderr) => {
    if(err) {
      console.log(`runtime error`);
      res.json({
        status: 'runtime error',
        error: err,
        stderr: stderr
      });
    } else {
      console.log(`success`);
      res.json({
        status: `execution success`,
        stdout: stdout,
        stderr: stderr
      });
    }
    next();
  })
}

// clean will delete the temporary files created
exports.clean = (req, res) => {
  console.log('cleaning temporary files');

  let callback = err => {
    if(err) return console.log(err);
    console.log('successful delete');
  }

  fs.unlink(`api/python/tmp/${req.body.id}.py`, callback);
}