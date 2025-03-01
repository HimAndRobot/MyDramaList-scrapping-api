const express = require('express');
const dramaController = require('../controllers/dramaController');

const router = express.Router();

// Search dramas by title
router.get('/search', dramaController.searchDramas);

// Get drama details by ID
router.get('/:id', dramaController.getDramaDetails);

// Get only cast information for a drama by ID
router.get('/:id/cast', dramaController.getDramaCast);

// Get only recommendations for a drama by ID
router.get('/:id/recommendations', dramaController.getDramaRecommendations);

// Get only reviews for a drama by ID
router.get('/:id/reviews', dramaController.getDramaReviews);

module.exports = router; 