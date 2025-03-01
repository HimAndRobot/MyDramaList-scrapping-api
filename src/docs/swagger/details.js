/**
 * @swagger
 * /api/dramas/{id}:
 *   get:
 *     summary: Get details of a drama by ID
 *     tags: [Dramas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Drama ID
 *       - in: query
 *         name: cast
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Include cast information
 *       - in: query
 *         name: recommendations
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Include recommendations
 *       - in: query
 *         name: reviews
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Include reviews
 *     responses:
 *       200:
 *         description: Drama details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DramaDetails'
 *       400:
 *         $ref: '#/components/responses/Error'
 *       500:
 *         $ref: '#/components/responses/Error'
 */ 