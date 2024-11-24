const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const seoRoutes = require('./routes/seo');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// API routes
app.use('/api/seo', seoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
