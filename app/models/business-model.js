const db = require('../../config/database');
const dbFunc = require('../../config/db-function');

function getCityByEdition(edition) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT DISTINCT bus_city FROM business 
      WHERE ed_cd='${edition}' AND bus_city IS NOT NULL 
      ORDER BY bus_city ASC`,
      (error, rows, fields) => {
        if (error) {
          dbFunc.connectionRelease;
          reject(error);
        } else {
          dbFunc.connectionRelease;
          resolve(rows);
        }
      },
    );
  });
}

function getAllMarinas(edition) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM marinas 
    WHERE ed_code='${edition}'
    ORDER BY mar_name ASC`,
      (error, rows, fields) => {
        if (error) {
          dbFunc.connectionRelease;
          reject(error);
        } else {
          dbFunc.connectionRelease;
          resolve(rows);
        }
      },
    );
  });
}

function getAllCategories(edition) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT cat_codes.* FROM cat_codes
      INNER JOIN business
      ON cat_codes.bus_cat_cd = business.bus_cat_cd
      WHERE business.ed_cd='${edition}'
      ORDER BY bus_cat_cd_desc ASC`,
      (error, rows, fields) => {
        if (error) {
          dbFunc.connectionRelease;
          reject(error);
        } else {
          dbFunc.connectionRelease;
          resolve(rows);
        }
      },
    );
  });
}

const businessModel = {
  getCityByEdition,
  getAllMarinas,
  getAllCategories,
};

module.exports = businessModel;
