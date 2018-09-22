
const {exec} = require('child_process');
const fs = require('fs');

// TODO: Modularize debug messages
// TODO: Un-hardcode directories

/**
 * Generates the requested Java code named {req.body.id} from the template
 */
exports.generate = (req, res, next) => {
  console.log('attempting to generate code from the following');
  console.log(req.body);

  // Reads the Java template
  fs.readFile('api/java/template.txt', (err, data) => {
    if(err) throw err;

    // Fills in the template
    let code = data.toString();
    code = code.replace('%%ID%%', req.body.id)
               .replace('%%CONTENT%%', req.body.content || '');

    // Writes the Java code to a file
    console.log(code);
    fs.writeFile(`api/java/tmp/${req.body.id}.java`, code, (err) => {
      if (err) throw err;

      console.log('successful write');
      next();
    });
  });

  // TODO: Un-hardcode template
};

/** 
 * Compiles the requested Java code named {req.body.id}
 */
exports.compile = (req, res, next) => {
  console.log('attempting to compile the following');
  console.log(req.body);

  exec(`javac api/java/tmp/${req.body.id}.java`, (error, stdout, stderr) => {
    if(error) {
      // returns the Error object on compilation failure
      console.log('compilation failed');
      res.json({
        status: 'compile error',
        error: error,
        stderr: stderr
      });
    } else {
      console.log('compilation successful');
      next();
    }
  });
};

/**
 * Executes the requested Java class named {req.body.id}
 */
exports.execute = (req, res, next) => {
  console.log('attempting to execute the following');
  console.log(req.body);

  exec(`java -cp api/java/tmp ${req.body.id}`, (error, stdout, stderr) => {
    if(error) {
      console.log('runtime error');
      res.json({
        status: 'runtime error',
        error: error,
        stderr: stderr
      });
    } else {
      console.log('execution successful');
      res.json({
        status: 'executation success',
        stdout: stdout,
        stderr: stderr
      });
    }
    next();
  });
};

/**
 * Removes the requested Java program named {req.body.id}
 */
exports.clean = (req, res) => {
  console.log('attempting to clean temporary files');

  let callback = (err) => {
    if(err) return console.log(err);
    console.log('successful delete');
  };

  // unlink == rm
  fs.unlink(`api/java/tmp/${req.body.id}.java`, callback);
  fs.unlink(`api/java/tmp/${req.body.id}.class`, callback);
};
