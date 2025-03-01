/**
 * Puppeteer adapter for development and production environments
 * This file provides a consistent interface for Puppeteer in both local development
 * and serverless environments like Vercel
 */

// Dynamic imports based on environment
let puppeteer;
let chromium;

// Check if running in production (Vercel) or development
if (process.env.NODE_ENV === 'production') {
  // Production configuration (Vercel)
  chromium = require('@sparticuz/chromium');
  puppeteer = require('puppeteer-core');
} else {
  // Development configuration (local)
  puppeteer = require('puppeteer');
}

// Get launch options based on environment
const getLaunchOptions = async () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    };
  } else {
    return {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    };
  }
};

// Export the configured puppeteer and launch options function
module.exports = {
  puppeteer,
  getLaunchOptions
}; 