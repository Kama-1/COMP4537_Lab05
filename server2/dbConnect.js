require("dotenv").config();
const mysql = require("mysql2");


const dbReadOnly = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER_READONLY,
    password: process.env.DB_PASSWORD_READONLY,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

const dbInsertOnly = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER_INSERTONLY,
    password: process.env.DB_PASSWORD_INSERTONLY,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});


dbReadOnly.connect((err) => {
    if (err) {
        console.error("Read only database connection failed:", err.message);
        return;
    }
    console.log("ReadOnly connected to MySQL database!");
});

dbInsertOnly.connect((err) => {
    if (err) {
        console.error("Insert only database connection failed:", err.message);
        return;
    }
    console.log("InsertOnly connected to MySQL database!");
});

module.exports = { dbReadOnly, dbInsertOnly };