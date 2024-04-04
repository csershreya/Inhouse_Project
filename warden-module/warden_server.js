const express = require('express');
const mysql = require('mysql');
const app = express();
const port1 = 3050;
const port2 = 3051;
const port3 = 3052;
const port4 = 3087;
const port5 = 3055;
const port6 = 3056;

const bodyParser = require('body-parser');
const path = require('path');

const port = 3053;

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

//Warden Login
app.get('/wlogin', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index_wlogin.html');
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

//Route to fetch data from room request table
app.get('/requests', (req, res) => {
    const sql = `SELECT s_id,request_id,room_no FROM room_allocation_requests where sts='pending'`; 
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.render('viewreq', { data: rows });
        }
    });
});


// Endpoint for the warden to approve or decline room allocation requests
app.post('/warden-module/views/viewreq.ejs', (req, res) => {
    const { requestId, approvalStatus } = req.body;

    if (approvalStatus === 'approved') {
        // Fetch the s_id before updating the request status
        const getStudentIdQuery = `SELECT s_id, room_no, h_id FROM room_allocation_requests WHERE request_id = ?`;
        connection.query(getStudentIdQuery, [requestId], (err, results) => {
            if (err) {
                console.error('Error fetching student ID:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Request ID not found' });
            }

            const { s_id, room_no, h_id } = results[0];

            const updateRequestStatusQuery = `UPDATE room_allocation_requests SET sts = 'approved' WHERE request_id = ?`;
            connection.query(updateRequestStatusQuery, [requestId], (err, results) => {
                if (err) {
                    console.error('Error updating request status:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Insert the record into hostel_room_stu_reln_tbl
                const insertRoomAllocationQuery = `INSERT INTO hostel_room_stu_reln_tbl (s_id, room_no, h_id) VALUES (?, ?, ?)`;
                connection.query(insertRoomAllocationQuery, [s_id, room_no, h_id], (err, results) => {
                    if (err) {
                        console.error('Error inserting room allocation:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    return res.status(200).json({ message: "Room allocated successfully" });
                });
                // Update vacant seats count
                const update_vacant = `UPDATE room_master_tbl SET vaccant = vaccant-1 WHERE h_id = ? AND room_no = ?`;
                connection.query(update_vacant, [h_id, room_no], (err, results) => {
                    if (err) 
                    {
                    
                    console.error('Error updating vacant seats count: ' + err);
                    return res.status(500).json({ error: 'Internal server error' });
                    }
                    
                    return res.status(200).json({ message: "Room allocated successfully" });
                });
            });
        });
    } else if (approvalStatus === 'declined') {
        const deleteRequestQuery = `DELETE FROM room_allocation_requests WHERE request_id = ?`;
        connection.query(deleteRequestQuery, [requestId], (err, results) => {
            if (err) {
                console.error('Error deleting request:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            return res.status(200).json({ message: "Room allocation request declined" });
        });
    } else {
        return res.status(400).json({ error: 'Invalid approval status' });
    }
});


   
// function generateRequestId() {
//     // Implement your logic to generate a unique request ID (e.g., using a UUID library)
//     return 'unique_request_id';
// }


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
    console.log(`Server for student_master_tbl is running on http://localhost:${port5}/requests`);
});

app.listen(port6, () => {
    console.log(`Server for student_master_tbl is running on http://localhost:${port6}/allocation`);
});

