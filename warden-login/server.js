const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3088;

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

// Route to serve HTML form

app.get('/', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index.html');
});


// Route to handle form submission and update data
app.post('/warden-login/index.html/submit', (req, res) => {
    console.log('POST request received at /warden-login/index.html/submit');
    const {loginId, password } = req.body;
    console.log('Received loginId:', loginId);
    console.log('Received password:', password);
    const sql = 'SELECT username,pswd FROM user_master_tbl WHERE username = ? and u_type in("head","assistant")';
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


// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
