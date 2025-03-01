const dramaService = require('../services/dramaService');

/**
 * Controller for drama related operations
 */
class DramaController {
  /**
   * Search dramas by title
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchDramas(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ 
          success: false, 
          message: 'The search parameter "query" is required' 
        });
      }
      
      const dramas = await dramaService.searchDramas(query);
      
      return res.status(200).json({
        success: true,
        count: dramas.length,
        data: dramas
      });
    } catch (error) {
      console.error('Error in drama controller:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Get drama details by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDramaDetails(req, res) {
    try {
      const { id } = req.params;
      const { cast, recommendations, reviews } = req.query;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Drama ID is required' 
        });
      }
      
      const dramaDetails = await dramaService.getDramaDetails(id, { cast: cast == 'true', recommendations: recommendations == 'true', reviews: reviews == 'true' });
      
      return res.status(200).json({
        success: true,
        data: dramaDetails
      });
    } catch (error) {
      console.error('Error in drama details controller:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Get only cast information for a drama by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDramaCast(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Drama ID is required' 
        });
      }
      
      const cast = await dramaService.getDramaCast(id);
      
      return res.status(200).json({
        success: true,
        count: cast.length,
        data: cast
      });
    } catch (error) {
      console.error('Error in drama cast controller:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Get only recommendations for a drama by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDramaRecommendations(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Drama ID is required' 
        });
      }
      
      const recommendations = await dramaService.getDramaRecommendations(id);
      
      return res.status(200).json({
        success: true,
        count: recommendations.length,
        data: recommendations
      });
    } catch (error) {
      console.error('Error in drama recommendations controller:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Get only reviews for a drama by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDramaReviews(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Drama ID is required' 
        });
      }
      
      const reviews = await dramaService.getDramaReviews(id);
      
      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } catch (error) {
      console.error('Error in drama reviews controller:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = new DramaController(); 