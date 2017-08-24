const express = require('express');
const app = express();
const {exec} = require('child_process');
const path = require('path');

app.get('/api', (req, res, next) => {
  console.log('i\'ll have your coffee right up');
  exec('javac ./tmp/test.java', (error, stdout, stderr) => {
    if(error) {
      console.error(`eh ${error}`);
      return;
    }
    if(stderr === '') {
      next()
    } else {
      console.log('oh... i couldn\'t find the coffee??');
    }
  });
}, (req, res) => {
  console.log('one second... it\'s boiling or something...');
  exec('java -cp tmp test', (error, stdout, stderr) => {
    if(error) {
      console.error(`ahh ${error}`);
      res.end('your coffee spilled... sorry :(\n' + stderr);
      return;
    }
    if(stderr === '') {
      console.log('oh goody it\'s done');
      console.log(stdout);
      res.end(stdout);
    } else {
      console.log('ah damn... i spilled it...');
      console.log(stderr);
    }
  })
});

app.listen(3001);

console.log('hey do you like coffee');
console.log('i think there\'s coffee in here:');
console.log(path.join('..', __dirname));