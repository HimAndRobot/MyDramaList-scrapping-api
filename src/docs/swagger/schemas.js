/**
 * @swagger
 * components:
 *   schemas:
 *     Drama:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the drama
 *         title:
 *           type: string
 *           description: Title of the drama
 *         link:
 *           type: string
 *           description: Link to the drama page on MyDramaList
 *         poster:
 *           type: string
 *           description: URL of the poster image
 *         year:
 *           type: string
 *           description: Release year
 *         type:
 *           type: string
 *           description: Type of drama (TV, Movie, etc.)
 *         countries:
 *           type: array
 *           items:
 *             type: string
 *           description: Countries of origin
 *         score:
 *           type: string
 *           description: Average score
 *     DramaDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the drama
 *         title:
 *           type: string
 *           description: Title of the drama
 *         nativeTitle:
 *           type: string
 *           description: Title in original language
 *         poster:
 *           type: string
 *           description: URL of the poster image
 *         synopsis:
 *           type: string
 *           description: Synopsis of the drama
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: Genres of the drama
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags of the drama
 *         info:
 *           type: object
 *           description: Basic information about the drama
 *         cast:
 *           type: array
 *           description: Cast of the drama
 *         reviews:
 *           type: array
 *           description: Reviews of the drama
 *         recommendations:
 *           type: array
 *           description: Recommendations related to the drama
 *     Cast:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *           description: Category of the cast (Main Role, Support Role, etc.)
 *         people:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the actor/actress
 *               image:
 *                 type: string
 *                 description: URL of the actor/actress image
 *     Recommendation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the recommended drama
 *         poster:
 *           type: string
 *           description: URL of the poster image
 *         title:
 *           type: string
 *           description: Title of the recommended drama
 *         summary:
 *           type: string
 *           description: Summary of the recommendation
 *     Review:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: Name of the user who made the review
 *         review:
 *           type: string
 *           description: Review text
 *         rating:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               stars:
 *                 type: string
 *                 description: Number of stars
 *               category:
 *                 type: string
 *                 description: Category of the rating
 *         numberofVotes:
 *           type: string
 *           description: Number of votes on the review
 *         watchStatus:
 *           type: string
 *           description: User's watch status
 *   responses:
 *     Error:
 *       description: Request error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Error message
 */ 