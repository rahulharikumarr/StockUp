// models/watchlist.js

const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    required: true
  }
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;
