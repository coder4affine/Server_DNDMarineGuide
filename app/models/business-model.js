/* eslint-disable no-restricted-syntax */
const db = require('../../config/database');
const dbFunc = require('../../config/db-function');

function getCityByEdition(query) {
  return new Promise((resolve, reject) => {
    const { edition, service } = query;
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

function getAllMarinas(query) {
  return new Promise((resolve, reject) => {
    const { edition } = query;
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

function getAllCategories(query) {
  return new Promise((resolve, reject) => {
    const { edition, service } = query;
    let whereClause = 'WHERE business.bus_city IS NOT NULL';
    if (edition) {
      whereClause = `${whereClause} AND business.ed_cd = '${edition}'`;
    }
    if (service) {
      whereClause = `${whereClause} AND cat_codes.ddb = '${service}'`;
    }

    db.query(
      `SELECT cat_codes.* FROM cat_codes
      LEFT JOIN business
      ON cat_codes.bus_cat_cd = business.bus_cat_cd
      ${whereClause}
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
      if (value) {
        if (key === 'cities') {
          const cities = value
            .split(',')
            .map(i => `'${i}'`)
            .join(',');
          whereClause = `${whereClause} AND business.bus_city IN (${cities})`;
        }
        if (key === 'edition') {
          whereClause = `${whereClause} AND business.ed_cd = '${value}'`;
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
    }

    console.log(whereClause);
    db.getConnection((error, conn) => {
      if (error) {
        conn.release();
        reject(error);
      }

      conn.query(
        `SELECT SQL_CALC_FOUND_ROWS business.bus_cd, business.*,cat_codes.*, states.st_name as stateName, countries.co_name as countryName  FROM business 
      LEFT JOIN cat_codes
      ON cat_codes.bus_cat_cd = business.bus_cat_cd
      LEFT JOIN states
      ON states.st_cd = business.bus_st
      LEFT JOIN countries
      ON countries.co_cd = business.bus_co
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

function getAdvertisements(query) {
  return new Promise((resolve, reject) => {
    const { addType, businessCode } = query;

    let whereClause = `WHERE curr_ads.ad_type_cd=${addType}`;
    if (businessCode) {
      whereClause = `${whereClause} AND curr_ads.bus_cd=${businessCode}`;
    }

    db.query(
      `SELECT * FROM curr_ads
    ${whereClause}`,
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
  getBusinesses,
  getAdvertisements,
};

module.exports = businessModel;
