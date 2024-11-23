const puppeteerExtra = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

puppeteerExtra.use(stealthPlugin());

async function searchGoogleAndScrape() {
  try {
    const browser = await puppeteerExtra.launch({
      headless: false, // Set to true to run in headless mode
    });

    const page = await browser.newPage();

    // Set user-agent to simulate a real browser request
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
    );

    // Define search query
    const searchQuery = 'electric shop in rajkot';
    const searchUrl = `https://www.google.com/search?q=${searchQuery.split(' ').join('+')}`;

    // Go to Google search page with the query
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Wait for the anchor element containing "More places" to appear
    try {
      await page.waitForSelector('.CHn7Qb.pYouzb', { timeout: 5000 });
    } catch (error) {
      console.log('Element not found within 5 seconds. Closing browser.');
      await browser.close();
      return;
    }

    // Click on the "More places" link
    await page.click('.CHn7Qb.pYouzb');

    // Wait for navigation to the clicked page
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    let businesses = [];

    // Function to scrape data from the current page
    async function scrapeCurrentPage() {
      // Scroll the page to load all content
      await autoScroll(page);

      // Get the HTML content of the page after navigation
      const html = await page.content();

      // Load the HTML into Cheerio for scraping
      const $ = cheerio.load(html);

      function extractAddressFromHref(href) {
        if (href) {
          const match = href.match(/daddr=([^&]+)/);
          if (match) {
            return decodeURIComponent(match[1].replace(/\+/g, ' '));
          }
        }
        return 'Address not found';
      }

      // Scrape data for businesses
      $('div[jscontroller="xkZ6Lb"]').each((index, element) => {
        const storeName = $(element).find('div.rgnuSb.xYjf2e').text().trim();
        const rating = $(element).find('div.rGaJuf').text().trim();

        const directionsHref = $(element).find('a[role="link"]').attr('href');

        const address = extractAddressFromHref(directionsHref);

        const phone = $(element).find('a[data-phone-number]').attr('data-phone-number');
        const website = $(element).find('div[data-website-url]').attr('data-website-url');

        console.log(storeName);
        businesses.push({
          storeName,
          rating,
          address,
          phone: phone || 'Not available',
          website: website || 'Not available',
        });
      });

      console.log(`Scraped ${businesses.length} businesses from the current page.`);
    }

    // Function to wait for a specified time
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Continuously click on the next page button and scrape until it is no longer available
    let hasNextPage = true;
    let pageCounter = 1;

    while (hasNextPage) {
      try {
        console.log(`Scraping page ${pageCounter}`);
        await scrapeCurrentPage();

        // Check if the next button with aria-label "Next" exists
        const nextButton = await page.$('button[aria-label="Next"]');

        if (nextButton) {
          console.log("Next button found, clicking...");
          // Click the button to go to the next page
          await Promise.all([
            nextButton.click(),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
          ]);

          console.log("Navigated to the next page.");
          pageCounter++;

          // Wait for 5 seconds before scraping the next page
          console.log("Waiting for 5 seconds before scraping the next page...");
          await delay(5000); // 5 seconds delay
        } else {
          console.log("Next button not found. Finished scraping.");
          hasNextPage = false;
        }
      } catch (error) {
        console.log('Error while navigating to next page:', error.message);
        hasNextPage = false;
      }
    }

    // Write the results to a file
    fs.writeFileSync('businesses_from_google.json', JSON.stringify(businesses, null, 2), 'utf-8');
    console.log('Data saved to businesses_from_google.json');

    // Close the browser
    await browser.close();

    return businesses;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Auto-scroll function to load dynamic content
async function autoScroll(page) {
  await page.evaluate(async () => {
    const distance = 100; // Distance to scroll each time
    const delay = 150; // Delay between scrolls
    while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
      document.scrollingElement.scrollBy(0, distance);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  });
}

searchGoogleAndScrape();
