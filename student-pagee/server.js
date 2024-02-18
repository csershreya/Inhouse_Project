const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3062;

// Middleware
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
    } else {
        console.log('Connected to MySQL database');
    }
});

// Route to serve HTML form
app.get('/', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index.html');
});

// Route to handle form submission and update data
app.post('/student-pagee/index.html/submit', (req, res) => {
    console.log('POST request received at /student-pagee/index.html/submit');
    const {detail_type,current,detail_new} = req.body;
    
    const sql = `INSERT INTO shms.update_tbl (detail_type,detail_current,detail_new) VALUES (?,?,?)`;
    connection.query(sql, [detail_type,current,detail_new], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Error updating data');
        } else {
            console.log('Update request made');
            res.send('Update request made');
        }
    });
});

app.post('/student-pagee/index.html/send', (req, res) => {
    console.log('POST request received at /student-pagee/index.html/send');
    const {complain} = req.body;
    
    const sql = `INSERT INTO shms.feedback_tbl (feedback) VALUES (?)`;
    connection.query(sql, [complain], (err, result) => {
        if (err) {
            console.error('Error registering feedback:', err);
            res.status(500).send('Error registering feedback');
        } else {
            console.log('feedback registered');
            res.send('feedback registered');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
