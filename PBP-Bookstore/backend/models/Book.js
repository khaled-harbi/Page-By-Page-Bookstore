const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: String,
    imageUrl: String,
    quantity: { type: Number, default: 0 }  // Optional: Set default quantity
});

module.exports = mongoose.model('Book', BookSchema);
