// controllers/stockcontrollers.js

const axios = require('axios');
const { DateTime } = require('luxon');


// Function to get company profile
const getCompanyProfile = async (req, res) => {
  try {
    const { symbol } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get company news
const getCompanyNews = async (req, res) => {
  try {
    const { symbol } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    // Calculate the date 1 week ago from the current date
    const currentDate = new Date();
    const toDate = currentDate.toISOString().split('T')[0];
    const fromDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to get company recommendation trends
const getRecommendationTrends = async (req, res) => {
  try {
    const { symbol } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    const response = await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMarketStatus = async (req, res) => {
  try {
    const { exchange } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    const response = await axios.get(`https://finnhub.io/api/v1/stock/market-status?exchange=${exchange}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to get company insider sentiment
const getInsiderSentiment = async (req, res) => {
  try {
    const { symbol, from } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    const response = await axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=${from}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to get company peers
const getCompanyPeers = async (req, res) => {
  try {
    const { symbol } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    const response = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get company earnings
const getCompanyEarnings = async (req, res) => {
  try {
    const { symbol } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    const response = await axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Function to get company historical data
const getCompanyHistoricalData = async (req, res) => {
  try {
    const { stockTicker } = req.query;
    const multiplier = 1;
    const timespan = 'day';
    
    // Calculate the from date (6 months and 1 day prior to the current date)
    const fromDate = DateTime.local().minus({ months: 6, days: 1 }).toISODate();
    
    // Calculate the to date (current date)
    const toDate = DateTime.local().toISODate();
    
    const apiKey = process.env.POLYGON_API_KEY;
    
    // Construct the query string
    const queryString = `adjusted=true&sort=asc&apiKey=${apiKey}`;
    
    // Construct the API endpoint URL
    const endpoint = `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/${multiplier}/${timespan}/${fromDate}/${toDate}?${queryString}`;
    
    // Make the HTTP request to the Polygon API
    const response = await axios.get(endpoint);
    
    // Send the response data back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get company latest price
const getLatestStockPrice = async (req, res) => {
  try {
    const { symbol } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function for autocomplete
const autocompleteSearch = async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.FINNHUB_API_KEY;

    const response = await axios.get(`https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the updated controller functions
module.exports = {
  getCompanyProfile,
  getCompanyNews,
  getRecommendationTrends,
  getMarketStatus,
  getInsiderSentiment,
  getCompanyPeers,
  getCompanyEarnings,
  getCompanyHistoricalData,
  getLatestStockPrice,
  autocompleteSearch,

  // Add more functions as needed
};


