/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: API health endpoints
 *
 * /api/health:
 *   get:
 *     summary: Check the health of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the API
 *                   example: "ok"
 */