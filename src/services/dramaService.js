const { puppeteer, getLaunchOptions } = require('../utils/puppeteerAdapter');
const cheerio = require('cheerio');

/**
 * Service for scraping dramas from MyDramaList
 */
class DramaService {
  /**
   * Search dramas by title
   * @param {string} query - Search term
   * @returns {Promise<Array>} - List of found dramas
   */
  async searchDramas(query) {
    let browser = null;
    
    try {
      console.log(`Searching dramas with term: ${query}`);
      
      const url = `https://mydramalist.com/search?q=${encodeURIComponent(query)}&adv=titles&so=relevance`;
      console.log(`Search URL: ${url}`);
      
      const options = await getLaunchOptions();
      browser = await puppeteer.launch(options);
      
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      await page.setViewport({ width: 1920, height: 1080 });
      
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
      });
      
      console.log('Navigating to URL...');
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
      
      
      const pageTitle = await page.title();
      console.log(`Page title: ${pageTitle}`);
      
      if (pageTitle.includes('Attention Required') || pageTitle.includes('Security Check')) {
        console.log('Cloudflare security challenge detected. Waiting for resolution...');
        await page.waitForTimeout(10000);
      }
      
      const content = await page.content();
      console.log(`HTML content size: ${content.length} characters`);
      
      const $ = cheerio.load(content);
      
      const dramas = [];
      
      const boxElements = $('.box');
      console.log(`Found ${boxElements.length} .box elements`);
      
      if (boxElements.length === 0) {
        console.log('Trying alternative selectors...');
        
        await page.screenshot({ path: 'debug-screenshot.png' });
        console.log('Debug screenshot saved: debug-screenshot.png');
        
        const bodyHtml = $('body').html().substring(0, 1000);
        console.log('Sample of page HTML:', bodyHtml);
        
        const alternativeSelectors = [
          '.list', 
          '.mdl-list', 
          '.search-results .item', 
          '.card',
          '.box-body',
          '.search-content',
          'a[href*="/"]'
        ];
        
        for (const selector of alternativeSelectors) {
          const elements = $(selector);
          console.log(`Selector ${selector}: ${elements.length} elements found`);
          
          if (elements.length > 0) {
            elements.each((index, element) => {
              const title = $(element).find('a[href*="/"]').first().text().trim();
              const link = $(element).find('a[href*="/"]').first().attr('href');
              
              if (title && link) {
                dramas.push({
                  title,
                  link: link.startsWith('http') ? link : `https://mydramalist.com${link}`,
                  source: `alternative-selector-${selector}`
                });
              }
            });
            
            if (dramas.length > 0) {
              console.log(`Found ${dramas.length} dramas using alternative selector ${selector}`);
              break;
            }
          }
        }
      } else {
        boxElements.each((index, element) => {
          const title = $(element).find('h6.title a').text().trim();
          const link = $(element).find('h6.title a').attr('href');
          const id = link ? link.split('/')[1] : null;
          const poster = $(element).find('img.lazy').attr('data-src') || $(element).find('img.lazy').attr('src');
          
          const infoText = $(element).find('.text-muted').text();
          const year = infoText.match(/(\d{4})/)?.[1] || '';
          
          const type = $(element).find('.text-muted a[href*="/search?type="]').text().trim();
          
          const countries = [];
          $(element).find('.text-muted a[href*="/search?country="]').each((i, el) => {
            countries.push($(el).text().trim());
          });
          
          const score = $(element).find('.score').text().trim();
          
          if (title) {
            dramas.push({
              id,
              title,
              link: `https://mydramalist.com${link}`,
              poster,
              year,
              type,
              countries,
              score,
              source: 'original-selector'
            });
          }
        });
      }
      
      console.log(`Total dramas found: ${dramas.length}`);
      return dramas;
    } catch (error) {
      console.error('Error searching dramas:', error);
      throw new Error(`Failed to search dramas on MyDramaList: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        console.log('Browser closed');
      }
    }
  }

  /**
   * Get detailed information about a drama by its ID
   * @param {string} id - Drama ID
   * @returns {Promise<Object>} - Detailed drama information
   */
  async getDramaDetails(id, config) {
    let browser = null;
    
    try {
      console.log(`Getting details for drama with ID: ${id}`);
      
      const url = `https://mydramalist.com/${id}`;
      console.log(`Drama URL: ${url}`);
      
      const options = await getLaunchOptions();
      browser = await puppeteer.launch(options);
      
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      await page.setViewport({ width: 1920, height: 1080 });
      
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
      });
      
      console.log('Navigating to drama page...');
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
      console.log('Drama page navigated');
      
      const pageTitle = await page.title();
      console.log(`Page title: ${pageTitle}`);
      
      if (pageTitle.includes('Attention Required') || pageTitle.includes('Security Check')) {
        console.log('Cloudflare security challenge detected. Waiting for resolution...');
        await page.waitForTimeout(10000);
      }
      
      // Extract main page information
      let content = await page.content();
      let $ = cheerio.load(content);
      
      const dramaDetails = {
        id,
        title: $('.film-title').text().trim(),
        nativeTitle: $('.mdl-aka-list').first().text().trim(),
        poster: $('.film-cover img').attr('src'),
        synopsis: $('.show-synopsis').text().trim(),
        genres: [],
        tags: [],
        cast: [],
        reviews: [],
        recommendations: []
      };
      
      // Extract genres
      $('.show-genres a').each((i, el) => {
        dramaDetails.genres.push($(el).text().trim());
      });
      
      // Extract tags
      $('.show-tags a').each((i, el) => {
        dramaDetails.tags.push($(el).text().trim());
      });
      
      // Extract basic info
      const infoBox = {};
      $('.box-body.light-b .mdl-info').each((i, el) => {
        const label = $(el).find('.mdl-info-label').text().trim().replace(':', '');
        const value = $(el).find('.mdl-info-value').text().trim();
        if (label && value) {
          infoBox[label] = value;
        }
      });
      
      dramaDetails.info = infoBox;
      
      // Process main cast
      if ( config.cast ) {
        console.log('Extracting main cast...');
        console.log('Navigating to Cast page...');
        const castUrl = `https://mydramalist.com/${id}/cast`;
        await page.goto(castUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
        console.log('Cast page navigated');
        
        // Extract cast information
        content = await page.content();
        $ = cheerio.load(content);

        $('.box-body').each((i, section) => {
          const sectionTitle = $(section).find('h3.header').text().trim();
          if (sectionTitle) {
            $(section).find('h3.header').each((i, el) => {
              const sectionTitle = $(el).text().trim();
              const blockNextElement = $(el).next();
              //console.log( nextelement type)
              console.log(blockNextElement.prop('tagName'));
              //the next element is the cast section ul with li elements
              const people = [];
              blockNextElement.find('li').each((i, el) => {
                const person = {
                  name: $(el).find('b').text().trim(),
                  image: $(el).find('img').attr('src') || $(el).find('img').attr('data-src'),
                };
                people.push(person);
              })
  
              dramaDetails.cast.push({
                category: sectionTitle,
                people: people
              });
              
            });
            
          }
          
        });
      }

      if ( config.recommendations ) {
        console.log('Extracting recommendations...');
        console.log('Navigating to Recommendations page...');
        const recommendationsUrl = `https://mydramalist.com/${id}/recommendations`;
        await page.goto(recommendationsUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
        console.log('Recommendations page navigated');

        content = await page.content();
        $ = cheerio.load(content);

        const recommendations = [];

        $('.recs-box').each((i, section) => {

          $('.row.recs-box').each((i, el) => {
            recommendations.push({
              id: $(el).find('b').find('a').attr('href').split('/')[1],
              poster: $(el).find('img').attr('src') || $(el).find('img').attr('data-src'),
              title: $(el).find('b').text().trim(),
              summary: $(el).find('.recs-body').text().trim(),
            });
          });
        });

        dramaDetails.recommendations = recommendations;
          
      }

      if ( config.reviews ) {
        console.log('Extracting reviews...');
        console.log('Navigating to Reviews page...');
        const reviewsUrl = `https://mydramalist.com/${id}/reviews`;
        await page.goto(reviewsUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
        console.log('Reviews page navigated');

        content = await page.content();
        $ = cheerio.load(content);

        const reviews = [];

        $('.review').each((i, section) => {
          const rating = []
          const reviewBLock = $(section).find('.review-body');
          //remove first div
          reviewBLock.find('.review-rating').find('div').each((i, el) => {
            rating.push({
              stars: $(el).find('span').text().trim(),
              category: $(el).clone().children().remove().end().text().trim()
            });
          });
          reviewBLock.find('div').first().remove();
          reviews.push({
            user: $(section).find('b').find('a').text().trim(),
            review: reviewBLock.text().trim(),
            rating: rating,
            numberofVotes: $(section).find('.user-stats').find('b').text().trim(),
            watchStatus: $(section).find('.actions').find('.review-tag').text().trim()
          });
        });

        dramaDetails.reviews = reviews;

      }

      return dramaDetails;
    } catch (error) {
      console.error('Error getting drama details:', error);
      throw new Error(`Failed to get drama details from MyDramaList: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        console.log('Browser closed');
      }
    }
  }

  /**
   * Get only cast information for a drama by its ID
   * @param {string} id - Drama ID
   * @returns {Promise<Array>} - Cast information
   */
  async getDramaCast(id) {
    let browser = null;
    
    try {
      console.log(`Getting cast for drama with ID: ${id}`);
      
      const url = `https://mydramalist.com/${id}/cast`;
      console.log(`Cast URL: ${url}`);
      
      const options = await getLaunchOptions();
      browser = await puppeteer.launch(options);
      
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      await page.setViewport({ width: 1920, height: 1080 });
      
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
      });
      
      console.log('Navigating to cast page...');
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
      console.log('Cast page navigated');
      
      const pageTitle = await page.title();
      console.log(`Page title: ${pageTitle}`);
      
      if (pageTitle.includes('Attention Required') || pageTitle.includes('Security Check')) {
        console.log('Cloudflare security challenge detected. Waiting for resolution...');
        await page.waitForTimeout(10000);
      }
      
      // Extract cast information
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const cast = [];
      
      $('.box-body').each((i, section) => {
        const sectionTitle = $(section).find('h3.header').text().trim();
        if (sectionTitle) {
          $(section).find('h3.header').each((i, el) => {
            const sectionTitle = $(el).text().trim();
            const blockNextElement = $(el).next();
            console.log(blockNextElement.prop('tagName'));
            
            const people = [];
            blockNextElement.find('li').each((i, el) => {
              const person = {
                name: $(el).find('b').text().trim(),
                image: $(el).find('img').attr('src') || $(el).find('img').attr('data-src'),
              };
              people.push(person);
            })

            cast.push({
              category: sectionTitle,
              people: people
            });
          });
        }
      });
      
      return cast;
    } catch (error) {
      console.error('Error getting drama cast:', error);
      throw new Error(`Failed to get drama cast from MyDramaList: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        console.log('Browser closed');
      }
    }
  }

  /**
   * Get only recommendations for a drama by its ID
   * @param {string} id - Drama ID
   * @returns {Promise<Array>} - Recommendations
   */
  async getDramaRecommendations(id) {
    let browser = null;
    
    try {
      console.log(`Getting recommendations for drama with ID: ${id}`);
      
      const url = `https://mydramalist.com/${id}/recommendations`;
      console.log(`Recommendations URL: ${url}`);
      
      const options = await getLaunchOptions();
      browser = await puppeteer.launch(options);
      
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      await page.setViewport({ width: 1920, height: 1080 });
      
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
      });
      
      console.log('Navigating to recommendations page...');
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
      console.log('Recommendations page navigated');
      
      const pageTitle = await page.title();
      console.log(`Page title: ${pageTitle}`);
      
      if (pageTitle.includes('Attention Required') || pageTitle.includes('Security Check')) {
        console.log('Cloudflare security challenge detected. Waiting for resolution...');
        await page.waitForTimeout(10000);
      }
      
      // Extract recommendations
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const recommendations = [];
      
      $('.recs-box').each((i, section) => {
        $('.row.recs-box').each((i, el) => {
          recommendations.push({
            id: $(el).find('b').find('a').attr('href').split('/')[1],
            poster: $(el).find('img').attr('src') || $(el).find('img').attr('data-src'),
            title: $(el).find('b').text().trim(),
            summary: $(el).find('.recs-body').text().trim(),
          });
        });
      });
      
      return recommendations;
    } catch (error) {
      console.error('Error getting drama recommendations:', error);
      throw new Error(`Failed to get drama recommendations from MyDramaList: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        console.log('Browser closed');
      }
    }
  }

  /**
   * Get only reviews for a drama by its ID
   * @param {string} id - Drama ID
   * @returns {Promise<Array>} - Reviews
   */
  async getDramaReviews(id) {
    let browser = null;
    
    try {
      console.log(`Getting reviews for drama with ID: ${id}`);
      
      const url = `https://mydramalist.com/${id}/reviews`;
      console.log(`Reviews URL: ${url}`);
      
      const options = await getLaunchOptions();
      browser = await puppeteer.launch(options);
      
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      await page.setViewport({ width: 1920, height: 1080 });
      
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
      });
      
      console.log('Navigating to reviews page...');
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
      console.log('Reviews page navigated');
      
      const pageTitle = await page.title();
      console.log(`Page title: ${pageTitle}`);
      
      if (pageTitle.includes('Attention Required') || pageTitle.includes('Security Check')) {
        console.log('Cloudflare security challenge detected. Waiting for resolution...');
        await page.waitForTimeout(10000);
      }
      
      // Extract reviews
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const reviews = [];
      
      $('.review').each((i, section) => {
        const rating = []
        const reviewBLock = $(section).find('.review-body');
        
        reviewBLock.find('.review-rating').find('div').each((i, el) => {
          rating.push({
            stars: $(el).find('span').text().trim(),
            category: $(el).clone().children().remove().end().text().trim()
          });
        });
        
        reviewBLock.find('div').first().remove();
        
        reviews.push({
          user: $(section).find('b').find('a').text().trim(),
          review: reviewBLock.text().trim(),
          rating: rating,
          numberofVotes: $(section).find('.user-stats').find('b').text().trim(),
          watchStatus: $(section).find('.actions').find('.review-tag').text().trim()
        });
      });
      
      return reviews;
    } catch (error) {
      console.error('Error getting drama reviews:', error);
      throw new Error(`Failed to get drama reviews from MyDramaList: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        console.log('Browser closed');
      }
    }
  }
}

module.exports = new DramaService(); 