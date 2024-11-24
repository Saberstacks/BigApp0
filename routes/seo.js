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

// Routes

// Google Business Profile Audit
router.post('/google-business', async (req, res) => {
  const { businessName } = req.body;
  try {
    const response = await axios.post(
      `${BASE_URL}/business_data/google_business_profile`,
      { name: businessName },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// On-Page SEO Analysis
router.post('/on-page-seo', async (req, res) => {
  const { websiteUrl } = req.body;
  try {
    const response = await axios.post(
      `${BASE_URL}/on_page/seo_audit`,
      { url: websiteUrl },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Competitor Analysis
router.post('/competitor-analysis', async (req, res) => {
  const { keyword } = req.body;
  try {
    const response = await axios.post(
      `${BASE_URL}/competitor_analysis/organic`,
      { keyword },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Keyword Research
router.post('/keyword-research', async (req, res) => {
  const { keyword } = req.body;
  try {
    const response = await axios.post(
      `${BASE_URL}/keywords_data/priority`,
      { keyword },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Backlink Tracking
router.post('/backlink-tracking', async (req, res) => {
  const { websiteUrl } = req.body;
  try {
    const response = await axios.post(
      `${BASE_URL}/backlinks/tracking`,
      { url: websiteUrl },
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
