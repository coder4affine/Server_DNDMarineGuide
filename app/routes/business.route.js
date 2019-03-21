const businessModel = require('../models/business-model');
// const schema = require('../schema/userValidationSchema.json');
// const iValidator = require('../../common/iValidator');
const mail = require('./../../common/mailer.js');

const getCityByEdition = async (req, res) => {
  try {
    const { edition, service } = req.query;
    const data = await businessModel.getCityByEdition(edition, service);
    res.send(data);
  } catch (err) {
    mail.mail(err);
    res.send(err);
  }
};

const getAllMarinas = async (req, res) => {
  try {
    const { edition, service } = req.query;
    const data = await businessModel.getAllMarinas(edition, service);
    res.send(data);
  } catch (err) {
    mail.mail(err);
    res.send(err);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { edition } = req.query;
    const data = await businessModel.getAllCategories(edition);
    res.send(data);
  } catch (err) {
    mail.mail(err);
    res.send(err);
  }
};

const getBusinesses = async (req, res) => {
  try {
    const data = await businessModel.getBusinesses(req.query);
    res.send(data);
  } catch (err) {
    mail.mail(err);
    res.send(err);
  }
};

function init(router) {
  router.route('/cities').get(getCityByEdition);
  router.route('/marinas').get(getAllMarinas);
  router.route('/categories').get(getAllCategories);
  router.route('/businesses').get(getBusinesses);
}

module.exports.init = init;
