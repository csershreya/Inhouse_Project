const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3060;

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
app.post('/admin-form/index.html/submit', (req, res) => {
    console.log('POST request received at /admin-form/index.html/submit');
    const {smartId, rollNo, name, dob, program, subject, year, fatherName, motherName, email, phone, parentPhone, address, city, state, pincode } = req.body;
    //console.log('ID:', smartId);
    //console.log('Name:', name);
    const sql = `INSERT INTO shms.admin_master_tbl (st_id,st_roll,st_name,dob,program,sub,yr,st_phno,email,f_name,m_name,f_phno,address,city,state,pincode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    connection.query(sql, [smartId, rollNo, name, dob, program, subject, year, phone, email, fatherName, motherName, parentPhone, address, city, state, pincode], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
        } else {
            console.log('Data inserted successfully');
            res.send('Data inserted successfully');
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});








