require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const app = express();

app.use(cors());
app.use(express.json());  // For parsing application/json

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

// Serve static files (including admin.html and other frontend files)
app.use(express.static(path.join(__dirname, '..', 'webProj')));  // Serve static files from webProj folder



// API routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Serve the Admin Panel page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'webProj', 'admin.html'));
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
