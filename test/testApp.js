var path = require('path');
var express = require('express');

var app = express();

//app.use('/static', express.static(path.join(__dirname, '../test-dist')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  setTimeout(next, 2000);
});

app.get('/images-test', function(req, res) {
  res.sendFile(path.join(__dirname, '../test/images-test/index.html'));
});

app.get('/api-test', function(req, res) {
  res.sendFile(path.join(__dirname, '../test/api-test/index.html'));
});

app.get('/echo', function(req, res) {
  res.send(req.query);
});

app.get('/static/:dirname/:filename', function(req, res) {
  res.sendFile(path.join(__dirname, '../test-dist/', req.params.dirname, req.params.filename));
});

app.get('/static/:filename', function(req, res) {
  res.sendFile(path.join(__dirname, '../test-dist/', req.params.filename));
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
