const express = require('express');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to database:', err));

// Routes
app.get('/', (req, res) => {
    res.send('CPDLC System Server');
});

// Authentication Routes
app.post('/auth/login', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ success: true });
});

// CPDLC Message Handling Routes
app.post('/cpdlc/send', authenticateToken, async (req, res) => {
    try {
        const message = req.body.message;
        // Simulate sending a CPDLC message to the database or another service
        console.log(`Message sent: ${message}`);
        res.json({ status: 'Message received' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/cpdlc/receive', authenticateToken, async (req, res) => {
    try {
        // Simulate receiving CPDLC messages from the database
        const receivedMessages = await Message.find().exec();
        res.json({ messages: receivedMessages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
