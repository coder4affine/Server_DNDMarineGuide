const businessModel = require('../models/business-model');

function getCityByEdition(edition, service) {
  return new Promise((resolve, reject) => {
    businessModel
      .getCityByEdition(edition, service)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getAllMarinas(edition) {
  return new Promise((resolve, reject) => {
    businessModel
      .getAllMarinas(edition)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getAllCategories(edition) {
  return new Promise((resolve, reject) => {
    businessModel
      .getAllCategories(edition)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getAllCategories(edition) {
  return new Promise((resolve, reject) => {
    businessModel
      .getAllCategories(edition)
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

const businessService = {
  getCityByEdition,
  getAllMarinas,
  getAllCategories,
};

module.exports = businessService;
