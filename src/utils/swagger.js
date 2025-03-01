const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyDramaList Scraping API',
      version: '1.0.0',
      description: 'API to retrieve information about dramas from MyDramaList',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://mdl-scrapping.geanpedro.com.br',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Dramas',
        description: 'Operations related to dramas'
      }
    ]
  },
  apis: [
    './src/docs/swagger/*.js',
    './src/routes/*.js'
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MyDramaList API Documentation'
  })
}; 