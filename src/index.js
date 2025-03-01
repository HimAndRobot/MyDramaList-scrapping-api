const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swagger = require('./utils/swagger');

// Importing routes
const dramaRoutes = require('./routes/dramaRoutes');

// Environment configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swagger.serve, swagger.setup);

// Routes
app.use('/api/dramas', dramaRoutes);

// Health check endpoint for Docker
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MyDramaList Scraping API is working!',
    documentation: '/api-docs'
  });
});

// Server initialization
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 