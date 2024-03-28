const express = require('express');
const router = express.Router();
const stockControllers = require('../controllers/stockcontrollers');

// Route to get company profile
router.get('/profile', stockControllers.getCompanyProfile);

// Route to get company historical data
router.get('/historical', stockControllers.getCompanyHistoricalData);

router.get('/historical-last-two-years', stockControllers.getCompanyHistoricalDataLastTwoYears);

// Route to get latest stock price
router.get('/latest-price', stockControllers.getLatestStockPrice);

// Route for autocomplete search
router.get('/autocomplete', stockControllers.autocompleteSearch);

// Route to get peer groups
router.get('/peers', stockControllers.getCompanyPeers);

// Route to get insider sentiment
router.get('/insider-sentiment', stockControllers.getInsiderSentiment);

// Route to get company news
router.get('/company-news', stockControllers.getCompanyNews);

// Route to get earnings information
router.get('/earnings', stockControllers.getCompanyEarnings);

// Route to get market status
router.get('/market-status', stockControllers.getMarketStatus);

//Route to get recommendation trends
router.get('/recommendation-trends', stockControllers.getRecommendationTrends);

module.exports = router;
