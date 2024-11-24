const express = require('express');
const axios = require('axios');
const router = express.Router();

// Sandbox API Base URL
const BASE_URL = 'https://sandbox.dataforseo.com/v3';

// Authorization Helper
const getHeaders = () => {
  const authString = `${process.env.DATAFORSEO_API_LOGIN}:${process.env.DATAFORSEO_API_PASSWORD}`;
  const encodedAuthString = Buffer.from(authString).toString('base64');
  return {
    Authorization: `Basic ${encodedAuthString}`,
    'Content-Type': 'application/json',
  };
};

// Universal Payload Wrapper
const wrapPayloadInArray = (payload) => {
  return Array.isArray(payload) ? payload : [payload];
};

// Route: Google Business Profile API
router.post('/google-business', async (req, res) => {
  const { businessName } = req.body;
  if (!businessName) {
    return res.status(400).json({ error: 'Missing required field: businessName' });
  }
  try {
    const payload = { businessName };
    const response = await axios.post(
      `${BASE_URL}/business_profile/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Route: On-Page SEO API
router.post('/on-page-seo', async (req, res) => {
  const { site, limit = 10 } = req.body;
  if (!site) {
    return res.status(400).json({ error: 'Missing required field: site' });
  }
  try {
    const payload = { site, limit };
    const response = await axios.post(
      `${BASE_URL}/on_page/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Route: Backlinks API
router.post('/backlinks', async (req, res) => {
  const { site } = req.body;
  if (!site) {
    return res.status(400).json({ error: 'Missing required field: site' });
  }
  try {
    const payload = wrapPayloadInArray([{ site }]);
    const response = await axios.post(
      `${BASE_URL}/backlinks/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Route: Keywords Data API
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
    const response = await axios.post(
      `${BASE_URL}/keywords_data/google/search_volume/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
