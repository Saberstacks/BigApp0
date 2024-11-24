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

// Google Business Profile Audit
router.post('/google-business', async (req, res) => {
  const { businessName } = req.body;
  if (!businessName) {
    return res.status(400).json({ error: 'Missing required field: businessName' });
  }
  try {
    const payload = { name: businessName };
    console.log('Payload for Google Business API:', payload);

    const response = await axios.post(
      `${BASE_URL}/business_data/google_business_profile`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with Google Business API:', error.response?.data || error.message);
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
    const payload = { site, limit };
    console.log('Payload for On-Page SEO API:', payload);

    const response = await axios.post(
      `${BASE_URL}/on_page/seo_audit`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with On-Page SEO API:', error.response?.data || error.message);
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
    const payload = { target, competitor };
    console.log('Payload for Competitor Analysis API:', payload);

    const response = await axios.post(
      `${BASE_URL}/competitor_analysis/organic`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with Competitor Analysis API:', error.response?.data || error.message);
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
    const payload = wrapPayloadInArray(
      keywords.map((keyword) => ({
        keyword,
        location_code,
        language_name,
      }))
    );
    console.log('Payload for Keyword Research API:', payload);

    const response = await axios.post(
      `${BASE_URL}/keywords_data/priority`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with Keyword Research API:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// SERP API (Rank Tracker)
router.post('/serp-api', async (req, res) => {
  const { location_code, keyword, language_name = 'English' } = req.body;
  if (!location_code || !keyword) {
    return res.status(400).json({ error: 'Missing required fields: location_code and keyword.' });
  }
  try {
    const payload = wrapPayloadInArray({
      location_code,
      keyword,
      language_name,
    });
    console.log('Payload for SERP API:', payload);

    const response = await axios.post(
      `${BASE_URL}/serp/google/organic/task_post`,
      payload,
      { headers: getHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error with SERP API:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Backlink Tracking (Mock Response for Sandbox)
router.post('/backlink-tracking', async (req, res) => {
  const { site } = req.body;
  if (!site) {
    return res.status(400).json({ error: 'Missing required field: site' });
  }
  try {
    const payload = wrapPayloadInArray({ site });
    console.log('Payload for Backlink Tracking API:', payload);

    // Mock response as this might not be supported in the sandbox
    res.json({
      mock: true,
      message: 'Backlink Tracking is not available in sandbox mode. This is a mock response.',
    });
  } catch (error) {
    console.error('Error with Backlink Tracking API:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router;
