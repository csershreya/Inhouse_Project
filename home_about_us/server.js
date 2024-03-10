const express = require('express');
const mysql = require('mysql');
const app = express();
const porta = 3090;
const portb = 3095;
const bodyParser = require('body-parser');
const path = require('path');
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (like CSS files)
app.use(express.static(path.join(__dirname, 'public')));


//Warden Login
app.get('/aboutus', (req, res) => {
    console.log('GET request received at /aboutus');
    res.sendFile(__dirname + '/index_about.html');
});

app.get('/home', (req, res) => {
    console.log('GET request received at /home');
    res.sendFile(__dirname + '/index_home.html');
});

app.listen(porta, () => {
    console.log(`Server for about_us is running on http://localhost:${porta}/aboutus`);
});


app.listen(portb, () => {
    console.log(`Server for home is running on http://localhost:${portb}/home`);
});
