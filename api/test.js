const express = require('express');
const app = express();

app.get('/api', (req, res) => {
  res.json({test: 'hi I am a test'});
  console.log('I did do something');
});

app.listen(3001);

console.log('We did it');
console.log(__dirname);