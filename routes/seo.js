const express = require('express');
const axios = require('axios');
const router = express.Router();

// Sandbox Base URL
const BASE_URL = 'https://sandbox.dataforseo.com/v3';

// Helper function to generate Authorization header
const getHeaders = () => {
  const authString = `${process.env.DATAFORSEO_API_LOGIN}:${process.env.DATAFORSEO_API_PASSWORD}`;
  const encodedAuthString = Buffer.from(authString).toString('base64');
  return {
    Authorization: `Basic ${encodedAuthString}`,
  };
};

// Google Business Profile Audit
router.post('/google-business', async (req, res) => {
  const { businessName } = req.body;
  if (!businessName) {
    return res.status(400).json({ error: 'Missing required field: businessName' });
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/business_data/google_business_profile`,
      { name: businessName },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// On-Page SEO Analysis
router.post('/on-page-seo', async (req, res) => {
  const { site, limit = 10 } = req.body;
  if (!site) {
    return res.status(400).json({ error: 'Missing required field: site' });
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/on_page/seo_audit`,
      { site, limit },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Competitor Analysis
router.post('/competitor-analysis', async (req, res) => {
  const { target, competitor } = req.body;
  if (!target || !competitor) {
    return res.status(400).json({ error: 'Missing required fields: target and competitor' });
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/competitor_analysis/organic`,
      { target, competitor },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Keyword Research
router.post('/keyword-research', async (req, res) => {
  const { keywords, location_code = 2840, language_name = 'English' } = req.body;
  if (!keywords || !Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Missing or invalid field: keywords (array required)' });
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/keywords_data/priority`,
      { keywords, location_code, language_name },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Backlink Tracking
router.post('/backlink-tracking', async (req, res) => {
  const { site } = req.body;
  if (!site) {
    return res.status(400).json({ error: 'Missing required field: site' });
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/backlinks/tracking`,
      { site },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
