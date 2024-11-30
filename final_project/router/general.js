const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Base URL for the external API (replace with the actual base URL)
const baseUrl = 'https://example.com/api/books'; // Modify with your actual API base URL

// Task 10: Get the list of books available in the shop using Promise callbacks/async-await with Axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${baseUrl}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ message: "Error fetching books", error: error.message });
    }
});

// Task 11: Get book details based on ISBN using Promise callbacks/async-await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${baseUrl}/${isbn}`);
        res.send(response.data);
    } catch (error) {
        res.status(404).send({ message: `Book with ISBN ${isbn} not found`, error: error.message });
    }
});

// Task 12: Get book details based on Author using Promise callbacks/async-await with Axios
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`${baseUrl}/author/${author}`);
        res.send(response.data);
    } catch (error) {
        res.status(404).send({ message: `No books found for author ${author}`, error: error.message });
    }
});

// Task 13: Get book details based on Title using Promise callbacks/async-await with Axios
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`${baseUrl}/title/${title}`);
        res.send(response.data);
    } catch (error) {
        res.status(404).send({ message: `No books found with the title ${title}`, error: error.message });
    }
});

//  Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    // Extract the ISBN parameter from the request URL
    const isbn = req.params.isbn;

    // Find the book where the ISBN matches the extracted ISBN parameter
    let book = books.find((book) => book.isbn === isbn);

    // Check if a book with the given ISBN exists
    if (book) {
        // Send the reviews of the book as the response to the client
        res.send(book.reviews);
    } else {
        // If no book matches the ISBN, send an error message
        res.status(404).send({ message: "Book not found or no reviews available" });
    }
});

module.exports.general = public_users;
