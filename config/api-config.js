const express = require('express');

const app = express();
const path = require('path');
// const mysql = require('mysql');
// const jwt = require('jsonwebtoken');
// const http = require('http');
const bodyParser = require('body-parser');
// const db = require('./database');
const dbfunc = require('./db-function');
const UserRoute = require('../app/routes/user.route');
// const AuthenticRoute = require('../app/routes/authentic.route');
// const errorCode = require('../common/error-code');
// const errorMessage = require('../common/error-methods');
// const checkToken = require('./secureRoute');

// var schedule = require('node-schedule');

// var j = schedule.scheduleJob('*/1 * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });

dbfunc.connectionCheck
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.json());

// var router = express.Router();
// app.use('/api',router);
// AuthenticRoute.init(router);

const secureApi = express.Router();

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware

app.use('/api', secureApi);
// secureApi.use(checkToken);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// index route
app.get('/', (req, res) => {
  res.send('hello world');
});

const ApiConfig = {
  app,
};

UserRoute.init(secureApi);

module.exports = ApiConfig;
