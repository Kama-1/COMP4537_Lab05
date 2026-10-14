require('dotenv').config();
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const {dbReadOnly, dbInsertOnly} = require("./dbConnect");
app.use(express.static(__dirname));


app.get('/read-query', (req, res) => {
    const customQuery = req.query.customQuery;
    dbReadOnly.query(customQuery, (err, results) => {
        if (err) {
            console.error("Error executing query:", err.message);
            res.status(500).send("Error executing query");
        } else {
            res.json(results);
        }
    });
});

app.post('/post-text', (req, res) => {
    const sql = `INSERT INTO patient (name, dateofbirth)
    VALUES
    ('Sara Brown', '1901-01-01'),
    ('John Smith', '1941-01-01'),
    ('Jack Ma', '1961-01-30'),
    ('Elon Musk', '1999-01-01')`;

    dbInsertOnly.query(sql, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err.message);
        } else {
            console.log("Data inserted successfully");
        }
    });

    res.redirect('/');
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../server1/index.html'));
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});