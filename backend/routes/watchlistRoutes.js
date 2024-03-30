// routes/watchlistRoutes.js

const express = require('express');
const router = express.Router();
const Watchlist = require('../models/watchlist');

// Route to get all watchlist items
router.get('/', async (req, res) => {
  try {
    const watchlist = await Watchlist.find();
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new item to the watchlist
router.post('/', async (req, res) => {
  const watchlistItem = new Watchlist({
    ticker: req.body.ticker,
    companyName: req.body.companyName,
    exchange: req.body.exchange
  });

  try {
    const newWatchlistItem = await watchlistItem.save();
    res.status(201).json(newWatchlistItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    
    // Log the received ticker value
    console.log('Received ticker:', ticker);

    // Find and remove the item from the watchlist based on the ticker
    await Watchlist.findOneAndDelete({ ticker: ticker });
    res.json({ message: 'Watchlist item deleted' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
