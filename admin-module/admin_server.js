const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port1 = 3040;
const port2 = 3041;
const port3 = 3042;
const port4 = 3043; 
const port5 = 3044;
const port6 = 3070;
const port7 = 3036;
const port8 = 3045;
const port9 = 3046;
const port10 = 3047;
const port11 = 3048;
const port12 = 3049;
//generating random string for the session:
const crypto = require('crypto');
const generateRandomSecret = () => {
    return crypto.randomBytes(32).toString('hex'); 
    // Generate a 32-byte (256-bit) random string
};
const secret = generateRandomSecret();
console.log(secret); // Print the random secret

//session
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (like CSS files)
app.use(express.static(path.join(__dirname, 'public')));



// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sh@1210520', //sh@1210520
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




//-----------------------logout--------------------------------------

app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        // Redirect to the login page
        res.redirect('/alogin');
    });
});


//------------------------login server-----------------------------------
app.get('/alogin', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index_alogin.html');
});
// Route to handle Admin Login
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
app.post('admin-module/views/index1.ejs/save', (req, res) => {
    const tableData = req.body; // Received table data from the front-end

    // Assuming your table has a structure similar to { h_id, h_name, no_floors, no_rooms }
    const updateQuery = 'UPDATE hostel_master_table SET h_name = ?, no_floors = ?, no_rooms = ? WHERE h_id = ?';

    // Loop through the received table data and update the database accordingly
    tableData.forEach(rowData => {
        const { h_id, h_name, no_floors, no_rooms } = rowData;
        connection.query(updateQuery, [h_name, no_floors, no_rooms, h_id], (err, result) => {
            if (err) {
                console.error('Error updating database:', err);
                return res.status(500).json({ message: 'Failed to save changes to the database' });
            }
            console.log(`Row with h_id ${h_id} updated successfully`);
        });
    });

    // Respond to the client indicating that changes were saved successfully
    res.status(200).json({ message: 'Changes saved successfully' });
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

//profile
app.get('/profile',(req,res)=>{
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index_aprofile.html');
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

// Start server
app.listen(port7, () => {
    console.log(`Server is running on http://localhost:${port7}/logout`);
});

// Start server
app.listen(port8, () => {
    console.log(`Server is running on http://localhost:${port8}/profile`);
});

// app.listen(port9, () => {
//     console.log(`Server listening at http://localhost:${port9}/save`);
// });

// app.listen(port10, () => {
//     console.log(`Server listening at http://localhost:${port10}/save`);
// });

// app.listen(port11, () => {
//     console.log(`Server listening at http://localhost:${port11}/save`);
// });

// app.listen(port12, () => {
//     console.log(`Server listening at http://localhost:${port12}/save`);
// });
