const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Route to get user balance
router.get('/balance', async (req, res) => {
  try {
    const user = await User.findOne();
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update user balance
router.patch('/balance', async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await User.findOneAndUpdate({}, { balance }, { new: true });
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stocks/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const user = await User.findOne();
    const stock = user.purchases.find(purchase => purchase.ticker === ticker);
    if (stock) {
      res.json({ quantity: stock.quantity });
    } else {
      res.json({ quantity: 0 }); // Return 0 if the user doesn't own any stocks of the specified ticker
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to handle stock purchase
router.post('/buy', async (req, res) => {
  try {
    // Retrieve purchase details from request body
    const { ticker, quantity, price } = req.body;

    // Perform validation on purchase details
    // Example: Ensure all required fields are provided
    if (!ticker || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Example: Calculate total cost of purchase
    const totalCost = quantity * price;

    // Update user's balance in the database
    await User.findOneAndUpdate({}, { $inc: { balance: -totalCost } });

    // Store purchase details in the database
    const purchase = { ticker, quantity, price };
    await User.findOneAndUpdate({}, { $push: { purchases: purchase } });

    // Return success response
    res.status(200).json({ message: 'Stock purchased successfully', totalCost });
  } catch (err) {
    // Handle errors
    console.error('Error occurred while processing buy request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to handle stock sale
router.put('/sell', async (req, res) => {
  try {
    console.log('hmm error is in the backend')
    // Retrieve sale details from request body
    const { ticker, quantity, currentPrice } = req.body;

    // Perform validation on sale details
    if (!ticker || !quantity || !currentPrice || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid sell request' });
    }

    // Find the user
    const user = await User.findOne();

    // Find the purchase corresponding to the sold stock
    const purchaseIndex = user.purchases.findIndex(purchase => purchase.ticker === ticker);
    if (purchaseIndex === -1) {
      return res.status(400).json({ message: 'Stock not found in user\'s portfolio' });
    }

    // Calculate the sell amount
    const sellAmount = currentPrice * quantity;

    // Deduct the sold quantity from the existing purchase
    user.purchases[purchaseIndex].quantity -= quantity;

    // If all stocks are sold, remove the purchase from the array
    if (user.purchases[purchaseIndex].quantity <= 0) {
      user.purchases.splice(purchaseIndex, 1);
    }

    // Add sell amount to the user's wallet balance
    user.balance += sellAmount;

    // Save the updated user data
    await user.save();

    // Return success response
    res.status(200).json({ message: 'Stock sold successfully', sellAmount });
  } catch (err) {
    // Handle errors
    console.error('Error occurred while processing sell request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/portfolio', async (req, res) => {
  try {
    const user = await User.findOne();
    const portfolio = user.purchases;
    res.status(200).json(portfolio);
  } catch (err) {
    console.error('Error fetching user portfolio:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
