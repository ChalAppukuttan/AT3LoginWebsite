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

// Serve the register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const loginDetails = `Username: ${username}, Password: ${password}\n`;

    // Append the new user details to the logins.txt file
    fs.appendFile('logins.txt', loginDetails, (err) => {
        if (err) {
            console.error('Error saving new account', err);
            return res.status(500).send('Error registering account');
        }
        res.send('Registration successful! You can now login.');
    });
});

// Handle login (from the previous step)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Read the logins.txt file to check if the user exists
    fs.readFile('logins.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Error reading login details');
        }

        const loginEntry = `Username: ${username}, Password: ${password}`;
        if (data.includes(loginEntry)) {
            res.send(`Welcome ${username}!`);
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

// starting the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
