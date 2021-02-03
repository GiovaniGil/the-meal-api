var express = require('express')
  , app = express()
  , routes = require('../app/routes');

app.get('/', (req, res) => res.send('Hello World!'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

routes(app);

module.exports = app;