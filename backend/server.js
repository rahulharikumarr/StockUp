require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Importing watchlist model and routes
const Watchlist = require('./models/watchlist'); 
const watchlistRoutes = require('./routes/watchlistRoutes');

// Importing portfolio model and routes
const Portfolio = require('./models/portfolio'); 
const portfolioRoutes = require('./routes/portfolioRoutes');

// Importing user model and routes
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');

// Set up watchlist routes
app.use('/api/watchlist', watchlistRoutes);

// Set up portfolio routes
app.use('/api/portfolio', portfolioRoutes);

// Set up user routes
app.use('/api/user', userRoutes);

// Set up other routes
app.use('/api/stocks', require('./routes/stocks'));

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to your API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
