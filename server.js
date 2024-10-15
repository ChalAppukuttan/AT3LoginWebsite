// Importing modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Run an instance of express
const app = express();

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like HTML)
app.use(express.static(path.join(__dirname, 'public')));

// === USER REGISTRATION AND LOGIN SYSTEM ===

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

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists
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

// === DONUT ORDER SYSTEM ===

// Serve the order form for chocolate donuts
app.get('/order-chocolate-donut.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order-chocolate-donut.html'));
});

// Handle donut order form submission
app.post('/order-chocolate-donut.html', (req, res) => {
    const { name, address, phone, base, topping, quantity, 'pickup-time': pickupTime } = req.body;

    // Create an order string with the form data
    const toppingsList = Array.isArray(topping) ? topping.join(', ') : topping; // Handle single vs multiple toppings
    const orderDetails = `Name: ${name}\nAddress: ${address}\nPhone: ${phone}\nBase: ${base}\nToppings: ${toppingsList}\nQuantity: ${quantity}\nPickup Time: ${pickupTime}\n\n`;

    // Append the order details to orders.txt
    fs.appendFile('orders.txt', orderDetails, (err) => {
        if (err) {
            console.error('Error saving the order', err);
            return res.status(500).send('Error saving your order. Please try again.');
        }
        res.send('Order received! Thank you.');
    });
});

// === START THE SERVER ===
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
