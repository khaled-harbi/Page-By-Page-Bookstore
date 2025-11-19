const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Get all books or filter by category
router.get('/', async (req, res) => {
    const { category } = req.query; // Get the category from the query string
    try {
        // Make the category query case-insensitive and match exactly
        const query = category ? { category: { $regex: new RegExp(`^${category}$`, 'i') } } : {};
        const books = await Book.find(query);
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new book
router.post('/', async (req, res) => {
    const { title, author, price, category, description, imageUrl, quantity } = req.body;
    const book = new Book({ title, author, price, category, description, imageUrl, quantity });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a book
router.put('/:id', async (req, res) => {
    const { title, author, price, category, description, imageUrl, quantity } = req.body;
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { title, author, price, category, description, imageUrl, quantity }, { new: true });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a book
router.delete('/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
