const businessService = require('../services/business.service');
// const schema = require('../schema/userValidationSchema.json');
// const iValidator = require('../../common/iValidator');
const mail = require('./../../common/mailer.js');

const getCityByEdition = async (req, res) => {
  try {
    const { edition } = req.query;
    const data = await businessService.getCityByEdition(edition);
    res.send(data);
  } catch (err) {
    mail.mail(err);
    res.send(err);
  }
};

const getAllMarinas = async (req, res) => {
  try {
    const { edition } = req.query;
    const data = await businessService.getAllMarinas(edition);
    res.send(data);
  } catch (err) {
    mail.mail(err);
    res.send(err);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { edition } = req.query;
    const data = await businessService.getAllCategories(edition);
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
}

module.exports.init = init;
