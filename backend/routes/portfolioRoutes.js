const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio');

// Route to get all portfolio items
router.get('/', async (req, res) => {
  try {
    const portfolio = await Portfolio.find();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new item to the portfolio
router.post('/', async (req, res) => {
  const portfolioItem = new Portfolio({
    ticker: req.body.ticker,
    companyName: req.body.companyName,
    quantity: req.body.quantity,
    averageCostPerShare: req.body.averageCostPerShare,
    totalCost: req.body.totalCost,
    currentPrice: req.body.currentPrice,
    change: req.body.change,
    marketValue: req.body.marketValue
  });

  try {
    const newPortfolioItem = await portfolioItem.save();
    res.status(201).json(newPortfolioItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update an existing item in the portfolio
router.put('/:id', async (req, res) => {
  // Logic to update an existing item in the portfolio
});

// Route to delete an item from the portfolio
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find and remove the item from the portfolio based on the ID
    await Portfolio.findByIdAndDelete(id);
    res.json({ message: 'Portfolio item deleted' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
