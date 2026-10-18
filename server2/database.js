require("dotenv").config();
const mysql = require("mysql2");

exports.Database = class {
  constructor() {
    this.readOnlyConnection = mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER_READONLY,
      password: process.env.MYSQLPASSWORD_READONLY,
      database: process.env.MYSQLDATABASE,
    });
    this.insertConnection = mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER_INSERT,
      password: process.env.MYSQLPASSWORD_INSERT,
      database: process.env.MYSQLDATABASE,
    });
    this.creatorConnection = mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER_CREATE,
      password: process.env.MYSQLPASSWORD_CREATE,
      database: process.env.MYSQLDATABASE,
    });
  }

  createPatientTable(onCreate, onError) {
    const sql = `
      CREATE TABLE IF NOT EXISTS patient (
        patientId INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          dateOfBirth DATETIME NOT NULL
      ) ENGINE = InnoDB;
    `;
    this.creatorConnection.query(sql, (error, results) => {
      if (error) {
        console.error(error);
        onError();
        return;
      }
      onCreate();
    });
  }

  insertPatients(values, onInsert, onError) {
    if (values.length % 2 !== 0) {
      console.error("Odd number of values sent to insert.");
      onError();
      return;
    }
    let placeholderPairs = "(?, ?)";
    for (let i = 0; i < (values.length - 2) / 2; i++) {
      placeholderPairs = "(?, ?), " + placeholderPairs;
    }
    const sql = `INSERT INTO patient (name, dateOfBirth)
    VALUES
    ${placeholderPairs}
    `;
    this.createPatientTable(() => {
      this.insertConnection.query(sql, values, (error, results) => {
        if (error) {
          console.error(error);
          onError();
          return;
        }
        onInsert(results.affectedRows);
      });
    }, onError);
  }

  readQuery(statement, onResults, onError) {
    this.readOnlyConnection.query(statement, (error, results) => {
      if (error) {
        console.error(error);
        onError();
        return;
      }
      onResults(results);
    });
  }
};
