const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port1 = 3050;
const port2 = 3051;
const port3 = 3052;
const port4 = 3053; 
const port5 = 3054;
const port6 = 3055;

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
    } else {
        console.log('Connected to MySQL database');
    }
});

// Set EJS as the view engine
app.set('view engine', 'ejs');


// Route to serve HTML form

app.get('/alogin', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index_alogin.html');
});


// Route to handle form submission and update data
app.post('/admin-module/index_alogin.html/submit', (req, res) => {
    console.log('POST request received at /admin-module/index_alogin.html/submit');
    const {loginId, password } = req.body;
    console.log('Received loginId:', loginId);
    console.log('Received password:', password);
    const sql = 'SELECT username,pswd FROM user_master_tbl WHERE username = ? and u_type = "admin"';
    console.log(sql);
    connection.query(sql, [loginId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 1 && result[0].pswd === password) {
            // Successful login
            return res.status(200).json({ message: 'Login successful' });
            
        } 
        
        else {
            // Incorrect credentials
            return res.status(401).json({ message: 'Incorrect username or password' });
        }
    });
});

// route for admin page 
app.get('/adminp', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index_apage.html');
});

// Route for data from hostel_master_tbl
app.get('/hostel_tbl', (req, res) => {
    const sql = 'SELECT * FROM hostel_master_tbl';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data from hostel_master_tbl:', err);
            res.status(500).send('Error fetching data from hostel_master_tbl');
        } else {
            res.render('index1', { data: rows });
        }
    });
});

// Route for data from warden_master_tbl
app.get('/warden_tbl', (req, res) => {
    const sql = 'SELECT * FROM warden_master_tbl';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data from warden_master_tbl:', err);
            res.status(500).send('Error fetching data from warden_master_tbl');
        } else {
            res.render('index2', { data: rows });
        }
    });
});

// Route for data from user_master_tbl
app.get('/user_tbl', (req, res) => {
    const sql = 'SELECT * FROM user_master_tbl';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data from user_master_tbl:', err);
            res.status(500).send('Error fetching data from user_master_tbl');
        } else {
            res.render('index3', { data: rows });
        }
    });
});


// Route to fetch data from hostel_course_table
app.get('/course_tbl', (req, res) => {
    const sql = 'SELECT * FROM hostel_course_tbl'; 
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data from hostel_course_tbl:', err);
            res.status(500).send('Error fetching data from hostel_course_tbl');
        } else {
            res.render('index4', { data: rows });
        }
    });
});



// Start server
app.listen(port1, () => {
    console.log(`Server is running on http://localhost:${port1}/alogin`);
});

// Start server
app.listen(port2, () => {
    console.log(`Server is running on http://localhost:${port2}/adminp`);
});

// Start server
app.listen(port3, () => {
    console.log(`Server is running on http://localhost:${port3}/hostel_tbl`);
});

// Start server
app.listen(port4, () => {
    console.log(`Server is running on http://localhost:${port4}/warden_tbl`);
});

// Start server
app.listen(port5, () => {
    console.log(`Server is running on http://localhost:${port5}/user_tbl`);
});

// Start server
app.listen(port6, () => {
    console.log(`Server is running on http://localhost:${port6}/course_tbl`);
});
