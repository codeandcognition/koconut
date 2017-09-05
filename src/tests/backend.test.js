// Utility
import async from 'async';
import ace from 'brace';

// Files to test
import CodeParser from '../backend/CodeParser';

// Node imports
const fs = require('fs');
const {Range} = ace.acequire('ace/range');

// this is a test case
type TestCase = {
  input: string,
  output: string
};

// test case extensions
const test_ext = {
  input: 'IN',
  output: 'OUT',
};

// test case directory
const test_dir = 'src/tests/cases';

// shoutouts to Promises
// promise resolves to an object like this:
// [string]: TestCase
// TODO: no rejection case
function testCases(directory: string) {
  return new Promise((resolve, reject) => {
    // get all code files
    fs.readdir(`${test_dir}/${directory}`, (err, files) => {
      if (err) throw err;

      async.map(files,
          // callback that returns an object with the file name and the file content
          (file, callback) => {
            fs.readFile(`${test_dir}/${directory}/${file}`, (err, data) => {
              if (err) throw err;

              callback(err, {name: file, content: data.toString()});
            });
          },
          // callback to handle the result of the map
          (err, readFiles) => {
            if (err) throw err;

            let codes = {};

            readFiles.forEach((readFile) => {
              // extract file name and extension
              let [name, ext] = readFile.name.split('.');

              // normalize the extension
              ext = ext.toUpperCase();

              // create TestCase if it doesn't exist
              if (codes[name] === undefined) {
                codes[name] = {input: '', output: ''};
              }

              // check if file is input or output
              if (ext === test_ext.input.toUpperCase()) {
                // add file's content a test case by key
                codes[name].input = readFile.content.toString();
              } else if (ext === test_ext.output) {
                codes[name].output = readFile.content.toString();
              }
            });

            resolve(codes);
          },
      );
    }); // ew, callbacks
  });
}

test('Sanity Check', () => {
  expect(1).toBe(1);
});

test('CodeParser.clean', () => {
  testCases('clean').then((tests: { [string]: TestCase }) => {
    Object.values(tests).forEach((test) => {
      //console.log(`Testing ${test}`);
      expect(CodeParser.clean(test.input)).toBe(test.output);
    });
  });
});

// TODO: this doesn't really work
test('CodeParser.ranges', () => {
  //let results = {};
  //results.no_tags = [];

  testCases('ranges').then((tests) => {
    Object.keys(tests).forEach((test) => {
      console.log(test + ": " + CodeParser.ranges(tests[test].input));
      //expect(CodeParser.ranges(tests[test].input)).toEqual(results[test]);
    });
  });
});
