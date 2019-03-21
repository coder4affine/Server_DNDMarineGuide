/* eslint-disable no-restricted-syntax */
const db = require('../../config/database');
const dbFunc = require('../../config/db-function');

function getCityByEdition(edition, service) {
  return new Promise((resolve, reject) => {
    let whereClause = 'WHERE business.bus_city IS NOT NULL';
    if (edition) {
      whereClause = `${whereClause} AND business.ed_cd = '${edition}'`;
    }
    if (service) {
      whereClause = `${whereClause} AND cat_codes.ddb = '${service}'`;
    }

    db.query(
      `SELECT DISTINCT business.bus_city FROM business 
      LEFT JOIN cat_codes
      ON cat_codes.bus_cat_cd = business.bus_cat_cd
      ${whereClause}
      ORDER BY business.bus_city ASC`,
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
      LEFT JOIN business
      ON cat_codes.bus_cat_cd = business.bus_cat_cd
      WHERE business.ed_cd='${edition}'
      GROUP BY cat_codes.bus_cat_cd
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

function getBusinesses(query) {
  return new Promise((resolve, reject) => {
    let whereClause = 'WHERE 1=1';
    for (const [key, value] of Object.entries(query)) {
      if (key === 'cities') {
        const cities = value
          .split(',')
          .map(i => `'${i}'`)
          .join(',');
        whereClause = `${whereClause} AND business.bus_city IN (${cities})`;
      }
      if (key === 'marinas') {
        whereClause = `${whereClause} AND business.marina_cd IN (${value})`;
      }
      if (key === 'category') {
        const categories = value
          .split(',')
          .map(i => `'${i}'`)
          .join(',');
        whereClause = `${whereClause} AND business.bus_cat_cd IN (${categories})`;
      }
      if (key === 'service') {
        whereClause = `${whereClause} AND cat_codes.ddb = '${value}'`;
      }
    }

    console.log(whereClause);
    db.getConnection((error, conn) => {
      if (error) {
        conn.release();
        reject(error);
      }

      conn.query(
        `SELECT SQL_CALC_FOUND_ROWS business.bus_cd, business.*,cat_codes.*  FROM business 
      LEFT JOIN cat_codes
      ON cat_codes.bus_cat_cd = business.bus_cat_cd
      ${whereClause}
      ORDER BY business.bus_cd
      LIMIT ${query.result} OFFSET ${(query.page - 1) * query.result}`,
        (error1, businesses) => {
          if (error) {
            conn.release();
            reject(error);
          }
          conn.query('SELECT FOUND_ROWS() as count', (error2, total) => {
            if (error1) {
              conn.release();
              reject(error1);
            }
            conn.release();
            resolve({
              businesses,
              recordsTotal: total[0].count,
            });
          });
        },
      );
    });
  });
}

const businessModel = {
  getCityByEdition,
  getAllMarinas,
  getAllCategories,
  getBusinesses,
};

module.exports = businessModel;
