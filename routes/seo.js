const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for Sandbox API
const BASE_URL = 'https://sandbox.dataforseo.com/v3';

// Helper function to generate Authorization header
const getHeaders = () => {
  const authString = `${process.env.DATAFORSEO_API_LOGIN}:${process.env.DATAFORSEO_API_PASSWORD}`;
  const encodedAuthString = Buffer.from(authString).toString('base64');
  return {
    Authorization: `Basic ${encodedAuthString}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to wrap payloads in arrays
const wrapPayloadInArray = (payload) => {
  if (!payload || (Array.isArray(payload) && payload.length === 0)) {
    throw new Error('Payload is empty or invalid.');
  }
  return Array.isArray(payload) ? payload : [payload];
};

// Keywords Data API
router.post('/keywords-data', async (req, res) => {
  const { keywords, location_code, language_name = 'English' } = req.body;
  if (!keywords || !Array.isArray(keywords) || !location_code) {
    return res.status(400).json({
      error: 'Missing or invalid fields: keywords (array required) and location_code.',
    });
  }
  try {
    const payload = wrapPayloadInArray(
      keywords.map((keyword) => ({
        keyword,
        location_code,
        language_name,
      }))
    );
    console.log('Payload for Keywords Data API:', payload);

    const response = await axios.post(
      `${BASE_URL}/keywords_data/google/search_volume/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with Keywords Data API:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// On-Page SEO API
router.post('/on-page-seo', async (req, res) => {
  const { site, limit = 10, pingback_url } = req.body;
  if (!site) {
    return res.status(400).json({ error: 'Missing required field: site' });
  }
  try {
    const payload = { site, limit, pingback_url };
    console.log('Payload for On-Page SEO API:', payload);

    const response = await axios.post(
      `${BASE_URL}/on_page/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with On-Page SEO API:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Backlinks API
router.post('/backlinks', async (req, res) => {
  const { site, date_range, type } = req.body;
  if (!site) {
    return res.status(400).json({ error: 'Missing required field: site' });
  }
  try {
    const payload = wrapPayloadInArray([{ site, date_range, type }]);
    console.log('Payload for Backlinks API:', payload);

    const response = await axios.post(
      `${BASE_URL}/backlinks/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with Backlinks API:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Google Business Profile API
router.post('/google-business', async (req, res) => {
  const { businessName, category, location } = req.body;
  if (!businessName) {
    return res.status(400).json({ error: 'Missing required field: businessName' });
  }
  try {
    const payload = { businessName, category, location };
    console.log('Payload for Google Business API:', payload);

    const response = await axios.post(
      `${BASE_URL}/business_profile/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with Google Business API:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Business Data API (Example)
router.post('/business-data', async (req, res) => {
  const { businessName, location } = req.body;
  if (!businessName) {
    return res.status(400).json({ error: 'Missing required field: businessName' });
  }
  try {
    const payload = { businessName, location };
    console.log('Payload for Business Data API:', payload);

    const response = await axios.post(
      `${BASE_URL}/business_data/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with Business Data API:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
