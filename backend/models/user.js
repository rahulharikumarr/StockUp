const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  totalCost: { // Add totalCost field to the schema
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 25000.00
  },
  purchases: [purchaseSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
