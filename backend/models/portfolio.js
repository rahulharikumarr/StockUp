const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  averageCostPerShare: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  marketValue: {
    type: Number,
    required: true
  }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
