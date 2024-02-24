const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3070;
const path = require('path');

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sh@1210520',
    database: 'shms'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (like CSS files)
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch data from database and render HTML
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM shms.admin_master_tbl'; // Change this to your table name
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.render('index', { data: rows });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
