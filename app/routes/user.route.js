const userService = require('../services/user.service');
const schema = require('../schema/userValidationSchema.json');
const iValidator = require('../../common/iValidator');
const mail = require('./../../common/mailer.js');

function getAllUsers(req, res) {
  userService
    .getAllUser()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      mail.mail(err);
      res.send(err);
    });
}

function getUserById(req, res) {
  const userId = req.params;

  const json_format = iValidator.json_schema(schema.getSchema, userId, 'user');
  if (json_format.valid === false) {
    return res.status(422).send(json_format.errorMessage);
  }

  userService
    .getUserById(userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      mail.mail(err);
      res.send(err);
    });
}

function addUser(req, res) {
  const userData = req.body;

  // Validating the input entity
  const json_format = iValidator.json_schema(schema.postSchema, userData, 'user');
  if (json_format.valid === false) {
    return res.status(422).send(json_format.errorMessage);
  }

  userService
    .addUser(userData)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      mail.mail(err);
      res.json(err);
    });
}

function updateUser(req, res) {
  const userData = req.body;
  const { id } = req.params;
  userService
    .updateUser(id, userData)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      mail.mail(err);
      res.json(err);
    });
}

function deleteUser(req, res) {
  const delId = req.params.id;
  userService
    .deleteUser(delId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      mail.mail(err);
      res.json(err);
    });
}

function init(router) {
  router
    .route('/user')
    .get(getAllUsers)
    .post(addUser);
  router
    .route('/user/:id')
    .get(getUserById)
    .delete(deleteUser)
    .put(updateUser);
}

module.exports.init = init;
