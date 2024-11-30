const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username is a non-empty string and contains only alphanumeric characters
    return typeof username === "string" && username.trim().length > 0 && /^[a-zA-Z0-9]+$/.test(username);
};

const authenticatedUser = (username, password) => {
    // Check if the username and password match any record in the users array
    const user = users.find((u) => u.username === username && u.password === password);
    return !!user; // Returns true if a match is found, false otherwise
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate the username and password
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    // Check if the user exists and the password matches
    if (authenticatedUser(username, password)) {
        // If valid, store the user session or send a success response
        req.session.username = username;
        return res.status(200).json({ message: "Login successful" });
    } else {
        // If the username or password is incorrect
        return res.status(401).json({ message: "Invalid credentials" });
    }
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Review text from the query parameter
    const username = req.session.username; // Username from the session
    // Check if review and username are provided
    if (!review || !username) {
        return res.status(400).json({ message: "Review and user authentication are required" });
    }
    // Find the book by ISBN
    const book = books.find((b) => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    // Initialize the reviews object if it doesn't exist
    if (!book.reviews) {
        book.reviews = {};
    }
    // Add or modify the review for the given ISBN and username
    book.reviews[username] = review;

    // Send success response
    return res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
