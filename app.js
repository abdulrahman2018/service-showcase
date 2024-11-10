// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Setup body parser to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create an SQLite database (if it doesn't exist)
const db = new sqlite3.Database('./server/database.db', (err) => {
    if (err) {
        console.error("Error opening database:", err);
    } else {
        console.log("Database connected.");
    }
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            message TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            details TEXT
        )
    `);
});

// Serve the static HTML files
app.use(express.static(path.join(__dirname, '../')));

// POST endpoint to handle contact form submissions
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    const query = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;

    db.run(query, [name, email, message], function(err) {
        if (err) {
            res.status(500).send('Error saving contact information');
        } else {
            res.status(200).send('Contact information saved successfully');
        }
    });
});

// POST endpoint to handle quote form submissions
app.post('/submit-quote', (req, res) => {
    const { name, email, details } = req.body;
    const query = `INSERT INTO quotes (name, email, details) VALUES (?, ?, ?)`;

    db.run(query, [name, email, details], function(err) {
        if (err) {
            res.status(500).send('Error saving quote information');
        } else {
            res.status(200).send('Quote information saved successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
