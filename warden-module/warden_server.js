const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const app = express();
const port1 = 3050;
const port2 = 3051;
const port3 = 3052;
const port4 = 3087;
const port5 = 3054;
const port = 3053;

//generating random string for the session:
const crypto = require('crypto');
const generateRandomSecret = () => {
    return crypto.randomBytes(32).toString('hex'); 
    // Generate a 32-byte (256-bit) random string
};
const secret = generateRandomSecret();
console.log(secret); // Print the random secret
const bodyParser = require('body-parser');
const path = require('path');


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (like CSS files)
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));

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

//Warden Login
app.get('/wlogin', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index_wlogin.html');
});

//-----------------------logout--------------------------------------

app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        // Redirect to the login page
        res.redirect('/wlogin');
    });
});

// Route to handle form submission and update data
app.post('/warden-module/index_wlogin.html/submit', (req, res) => {
    console.log('POST request received at /warden-module/index_wlogin.html/submit');
    const {loginId, password } = req.body;
    console.log('Received loginId:', loginId);
    console.log('Received password:', password);
    const sql = 'SELECT username,pswd FROM user_master_tbl WHERE username = ? and u_type in("head","assistent")';
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

// route for warden page 
app.get('/wardenp', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index_wpage.html');
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
app.listen(port4, () => {
    console.log(`Server is running on http://localhost:${port4}/wlogin`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/wardenp`);
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

app.listen(port5, () => {
    console.log(`Server for student_master_tbl is running on http://localhost:${port5}/logout`);
});

