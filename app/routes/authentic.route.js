const jwt = require('jsonwebtoken');
const authenticService = require('../services/authentic.service');
const schema = require('../schema/loginValidationSchema.json');
const iValidator = require('../../common/iValidator');
const errorCode = require('../../common/error-code');
const errorMessage = require('../../common/error-methods');
const mail = require('./../../common/mailer.js');


function init(router) {
  router.route('/login')
    .post(authentic);
  router.route('/signup')
    .post(signup);
}

function authentic(req, res) {
  const authenticData = req.body;

  // Validating the input entity
  const json_format = iValidator.json_schema(schema.postSchema, authenticData, 'authentic');
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }

  authenticService.authentic(authenticData).then((data) => {
    if (data) {
      const username = data.username;
      const token = jwt.sign({ username }, 'my_secret_key', { expiresIn: 60 * 60 * 24 });
      res.json({
        success: true,
        data,
        token,
      });
    }
  }).catch((err) => {
    mail.mail(err);
    res.json(err);
  });
}


function signup(req, res) {
  const signUpData = req.body;

  // Validating the input entity
  const json_format = iValidator.json_schema(schema.postSchema, signUpData, 'signUpData');
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }

  authenticService.signup(signUpData).then((data) => {
    if (data) {
      res.json({
        success: true,
        data,
      });
    }
  }).catch((err) => {
    mail.mail(err);
    res.json(err);
  });
}


module.exports.init = init;
