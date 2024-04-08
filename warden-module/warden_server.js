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
const port6= 3055;
const port7= 3056;

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

//Warden Login page
app.get('/wlogin', (req, res) => {
    console.log('GET request received at /');
    res.sendFile(__dirname + '/index_wlogin.html');
});

// Route to handle Warden login
app.post('/warden-module/index_wlogin.html/submit', (req, res) => {
    console.log('POST request received at /warden-module/index_wlogin.html/submit');
    const {loginId, password } = req.body;
    console.log('Received loginId:', loginId); console.log('Received password:', password);
    const sql = 'SELECT username,pswd FROM user_master_tbl WHERE username = ? and u_type in("head","assistent")';
    console.log(sql);
    connection.query(sql, [loginId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 1 && result[0].pswd === password) {
            // Successful login
            req.session.loginId = loginId;
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

//--------------------PROFILE-------------------------------------------
//viewing profile of a student using student_master_tbl
app.get('/profile', (req, res) => {
    const userId = req.session.loginId;
    const sql = 'SELECT user_master_tbl.username, warden_master_tbl.w_name, warden_master_tbl.w_type, warden_master_tbl.h_id,warden_master_tbl.w_contact,user_master_tbl.pswd FROM user_master_tbl INNER JOIN warden_master_tbl ON user_master_tbl.username=warden_master_tbl.w_id where user_master_tbl.username=?'; 
    connection.query(sql,[userId],(err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.render('index_wprofile', { data: rows });
        }
    });
});

// Route for data from update_tbl having update requests

app.get('/update', (req, res) => {
    const sql = 'SELECT s_id, d_type, d_current,d_new,request_id, sts FROM update_requests_tbl';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching data from update_tbl:', err);
            res.status(500).send('Error fetching data from update_tbl');
        } else {
            res.render('index1', { data: rows });
        }
    });
});


// Route to handle warden's approval of update requests
app.post('/warden-module/view/index1.ejs', (req, res) => {
    const { requestId, approvalStatus } = req.body;

    if (approvalStatus === 'approved' || approvalStatus === 'declined') {
        const updateRequestStatusQuery = `UPDATE update_requests_tbl SET status = ? WHERE request_id = ?`;
        connection.query(updateRequestStatusQuery, [approvalStatus, requestId], (err, results) => {
            if (err) {
                console.error('Error updating request status:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (approvalStatus === 'approved') {
                // Fetch the update details and update the student database
                const fetchUpdateDetailsQuery = `SELECT s_id, d_type, d_current, d_new, request_id FROM update_requests_tbl WHERE request_id = ?`;
                connection.query(fetchUpdateDetailsQuery, [requestId], (err, results) => {
                    if (err) {
                        console.error('Error fetching update details:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    const { s_id, d_type, d_current, d_new } = results[0];
                    let updateAttributeQuery;
                    switch (d_type) {
                        case 'email':
                            updateAttributeQuery = `UPDATE student_master_tbl SET email = ? WHERE st_id = ? AND email = ?`;
                            break;
                        case 'number':
                            updateAttributeQuery = `UPDATE student_master_tbl SET st_phno = ? WHERE st_id = ? AND st_phno = ?`;
                            break;
                        case 'parents':
                            updateAttributeQuery = `UPDATE student_master_tbl SET f_phno = ? WHERE st_id = ? AND f_phno = ?`;
                            break;
                        case 'address':
                            updateAttributeQuery = `UPDATE student_master_tbl SET address = ? WHERE st_id = ? AND address = ?`;
                            break;
                        case 'city':
                            updateAttributeQuery = `UPDATE student_master_tbl SET city = ? WHERE st_id = ? AND city = ?`;
                            break;
                        case 'pincode':
                            updateAttributeQuery = `UPDATE student_master_tbl SET pincode = ? WHERE st_id = ? AND pincode = ?`;
                            break;
                        case 'state':
                            updateAttributeQuery = `UPDATE student_master_tbl SET state = ? WHERE st_id = ? AND state = ?`;
                            break;
                        default:
                            return res.status(400).json({ error: 'Invalid detail type' });
                    }

                    connection.query(updateAttributeQuery, [d_new, s_id, d_current], (err, results) => {
                        if (err) {
                            console.error('Error updating attribute:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }

                        return res.status(200).json({ message: "Attribute updated successfully" });
                    });
                });
            } else {
                const deleteRequestQuery = `DELETE FROM update_requests_tbl WHERE request_id = ?`;
                connection.query(deleteRequestQuery, [requestId], (err, results) => {
                    if (err) {
                        console.error('Error deleting request:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    return res.status(200).json({ message: "Update request declined" });
                });
            }
        });
    } else {
        return res.status(400).json({ error: 'Invalid approval status' });
    }
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

//Route to fetch data from room_allocation_request table containing requests for aquiring the room
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

            const updateRequestStatusQuery = `UPDATE room_allocation_requests SET sts = 'approved' WHERE request_id = ? `;
            connection.query(updateRequestStatusQuery, [requestId], (err, results) => {
                if (err) {
                    console.error('Error updating request status:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Insert the record into hostel_room_stu_reln_tbl
                const insertRoomAllocationQuery = `INSERT INTO hostel_room_stu_reln_tbl (s_id, room_no, h_id) VALUES (?, ?, ?)`;
                connection.query(insertRoomAllocationQuery, [s_id, room_no, h_id], (err, results) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            console.error('Duplicate entry error:', err);
                            return res.status(400).json({ error: 'Room allocation failed: Student already has a room' });
                        } else {
                            console.error('Error inserting room allocation:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                    }

                    // Update vacant seats count
                    const updateVacant = `UPDATE room_master_tbl SET vaccant = vaccant-1 WHERE h_id = ? AND room_no = ?`;
                    connection.query(updateVacant, [h_id, room_no], (err, results) => {
                        if (err) {
                            console.error('Error updating vacant seats count:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        return res.status(200).json({ success: true, message: 'Room allocated successfully' });
                    });
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
            return res.status(200).json({ message: 'Room allocation request declined' });
        });
    } else {
        return res.status(400).json({ error: 'Invalid approval status' });
    }
});



// // Endpoint for the warden to approve or decline room allocation requests
// app.post('/warden-module/views/viewreq.ejs', (req, res) => {
//     const { requestId, approvalStatus } = req.body;

//     if (approvalStatus === 'approved') {
//         // Fetch the request details before updating the request status
//         const getRequestDetailsQuery = `SELECT s_id, room_no, h_id FROM room_allocation_requests WHERE request_id = ?`;
//         connection.query(getRequestDetailsQuery, [requestId], (err, results) => {
//             if (err) {
//                 console.error('Error fetching request details:', err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }

//             if (results.length === 0) {
//                 return res.status(404).json({ error: 'Request ID not found' });
//             }

//             const { s_id, room_no, h_id } = results[0];

//             // Check if the student already has an allocated room
//             const checkExistingAllocationQuery = `SELECT * FROM hostel_room_stu_reln_tbl WHERE s_id = ?`;
//             connection.query(checkExistingAllocationQuery, [s_id], (err, existingResults) => {
//                 if (err) {
//                     console.error('Error checking existing allocation:', err);
//                     return res.status(500).json({ error: 'Internal server error' });
//                 }

//                 if (existingResults.length > 0) {
//                     return res.status(400).json({ error: 'Student already has an allocated room' });
//                 }

//                 // Update the request status to 'approved'
//                 const updateRequestStatusQuery = `UPDATE room_allocation_requests SET sts = 'approved' WHERE request_id = ?`;
//                 connection.query(updateRequestStatusQuery, [requestId], (err, updateResults) => {
//                     if (err) {
//                         console.error('Error updating request status:', err);
//                         return res.status(500).json({ error: 'Internal server error' });
//                     }

//                     // Insert the record into hostel_room_stu_reln_tbl
//                     const insertRoomAllocationQuery = `INSERT INTO hostel_room_stu_reln_tbl (s_id, room_no, h_id) VALUES (?, ?, ?)`;
//                     connection.query(insertRoomAllocationQuery, [s_id, room_no, h_id], (err, insertResults) => {
//                         if (err) {
//                             console.error('Error inserting room allocation:', err);
//                             return res.status(500).json({ error: 'Internal server error' });
//                         }

//                         // Update vacant seats count
//                         const updateVacantQuery = `UPDATE room_master_tbl SET vaccant = vaccant - 1 WHERE h_id = ? AND room_no = ?`;
//                         connection.query(updateVacantQuery, [h_id, room_no], (err, updateVacantResults) => {
//                             if (err) {
//                                 console.error('Error updating vacant seats count:', err);
//                                 return res.status(500).json({ error: 'Internal server error' });
//                             }

//                             return res.status(200).json({ message: "Room allocated successfully" });
//                         });
//                     });
//                 });
//             });
//         });
//     } else if (approvalStatus === 'declined') {
//         // Delete the request if declined
//         const deleteRequestQuery = `DELETE FROM room_allocation_requests WHERE request_id = ?`;
//         connection.query(deleteRequestQuery, [requestId], (err, results) => {
//             if (err) {
//                 console.error('Error deleting request:', err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }

//             return res.status(200).json({ message: "Room allocation request declined" });
//         });
//     } else {
//         return res.status(400).json({ error: 'Invalid approval status' });
//     }
// });



// // Endpoint for the warden to approve or decline room allocation requests
// app.post('/warden-module/views/viewreq.ejs', (req, res) => {
//     const { requestId, approvalStatus } = req.body;

//     if (approvalStatus === 'approved') {
//         // Fetch the s_id before updating the request status
//         const getStudentIdQuery = `SELECT s_id, room_no, h_id FROM room_allocation_requests WHERE request_id = ?`;
//         connection.query(getStudentIdQuery, [requestId], (err, results) => {
//             if (err) {
//                 console.error('Error fetching student ID:', err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }

//             if (results.length === 0) {
//                 return res.status(404).json({ error: 'Request ID not found' });
//             }
//             const { s_id, room_no, h_id } = results[0];

//             const updateRequestStatusQuery = `UPDATE room_allocation_requests SET sts = 'approved' WHERE request_id = ? `;
//             connection.query(updateRequestStatusQuery, [requestId, room_no, h_id], (err, results) => {
//                 if (err) {
//                     console.error('Error updating request status:', err);
//                     return res.status(500).json({ error: 'Internal server error' });
//                 }

//         // Insert the record into hostel_room_stu_reln_tbl
//         const insertRoomAllocationQuery = `INSERT INTO hostel_room_stu_reln_tbl (s_id, room_no, h_id) VALUES (?, ?, ?)`;
//         connection.query(insertRoomAllocationQuery, [s_id, room_no, h_id], (err, results) => {
//             if (err) {
//                 console.error('Error inserting room allocation:', err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }

//             return res.status(200).json({ message: "Room allocated successfully" });
//             });
//         // Update vacant seats count
//         const update_vacant = `UPDATE room_master_tbl SET vaccant = vaccant-1 WHERE h_id = ? AND room_no = ?`;
//         connection.query(update_vacant, [h_id, room_no], (err, results) => {
//             if (err) {
//                 console.error('Error updating vacant seats count: ' + err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }
//             return res.status(200).json({ message: "Room allocated successfully" });
//             });
//         });
//         });
//     } 
//     else if (approvalStatus === 'declined') {
//         const deleteRequestQuery = `DELETE FROM room_allocation_requests WHERE request_id = ?`;
//         connection.query(deleteRequestQuery, [requestId], (err, results) => {
//             if (err) {
//                 console.error('Error deleting request:', err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }
//             return res.status(200).json({ message: "Room allocation request declined" });
//         });
//     } 
//     else {
//         return res.status(400).json({ error: 'Invalid approval status' });
//     }
// });


   
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
    console.log(`Server for update_requests_tbl is running on http://localhost:${port1}/update`);
});

app.listen(port2, () => {
    console.log(`Server for feedback_tbl is running on http://localhost:${port2}/feedback`);
});

app.listen(port3, () => {
    console.log(`Server for student_master_tbl is running on http://localhost:${port3}/records`);
});

app.listen(port5, () => {
    console.log(`Server for logout is running on http://localhost:${port5}/logout`);
});

app.listen(port6, () => {
    console.log(`Server for room_alloc_requests is running on http://localhost:${port6}/requests`);
});

app.listen(port7, () => {
    console.log(`Server for profile is running on http://localhost:${port7}/profile`);
});
