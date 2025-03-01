/**
 * Puppeteer adapter otimizado para ambiente Docker
 * Este arquivo fornece uma interface consistente para o Puppeteer
 */

// Use standard Puppeteer
const puppeteer = require('puppeteer');

// Get launch options
const getLaunchOptions = async () => {
  // Verificar se estamos no Docker (onde definimos o caminho do executável)
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || null;
  
  return {
    headless: 'new',
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  };
};

// Export the configured puppeteer and launch options function
module.exports = {
  puppeteer,
  getLaunchOptions
}; 