const mysql = require("mysql");

module.exports = mysql.createPool({
  connectionLimit: 100,
  host: "162.245.237.26",
  port: "3306",
  user: "dnd_shalin",
  password: "F*jhX(x^oWjI",
  database: "dnd_db_web"
});
