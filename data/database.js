const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "blockyland",
  user: "root",
  password: "your password",
});

module.exports = pool;
