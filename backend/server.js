require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// This is what we use to connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Settin up the routes
app.use(express.json());
app.use('/api/stocks', require('./routes/stocks'));

app.get('/', (req, res) => {
    res.send('Welcome to your API!');
  });

// This is what starts the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
