const express = require('express');
const mysql = require('mysql');
const app = express();
const port1 = 3050;
const port2 = 3051;
const port3 = 3052;

const bodyParser = require('body-parser');
const path = require('path');

const port = 3081;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (like CSS files)
app.use(express.static(path.join(__dirname, 'public')));




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
        throw err;
    } else {
        console.log('Connected to MySQL database');
    }
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

// route for warden page 
app.get('/warden', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index.html');
});

// Route for data from update_tbl

app.get('/update', (req, res) => {
    const sql = 'SELECT * FROM update_tbl';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data from update_tbl:', err);
            res.status(500).send('Error fetching data from update_tbl');
        } else {
            res.render('index1', { data: rows });
        }
    });
});

// Route for data from feedback_tbl
app.get('/feedback', (req, res) => {
    const sql = 'SELECT * FROM feedback_tbl';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data from feedback_tbl:', err);
            res.status(500).send('Error fetching data from feedback_tbl');
        } else {
            res.render('index2', { data: rows });
        }
    });
});


// Route to fetch data from database and render HTML
app.get('/records', (req, res) => {
    const sql = 'SELECT * FROM student_master_tbl'; // Change this to your table name
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.render('index3', { data: rows });
        }
    });
});
// Start servers

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/warden`);
});


app.listen(port1, () => {
    console.log(`Server for update_tbl is running on http://localhost:${port1}/update`);
});

app.listen(port2, () => {
    console.log(`Server for feedback_tbl is running on http://localhost:${port2}/feedback`);
});

app.listen(port3, () => {
    console.log(`Server for student_master_tbl is running on http://localhost:${port3}/records`);
});