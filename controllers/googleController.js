// const cheerio = require('cheerio');
// const puppeteerExtra = require('puppeteer-extra');
// const stealthPlugin = require('puppeteer-extra-plugin-stealth');
// const fs = require('fs');

// puppeteerExtra.use(stealthPlugin());

// const searchGoogleMaps = async (req, res) => {
//     console.log(req.query)
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({ error: "Query is required" });
//     }

//     const start = Date.now();
//     const browser = await puppeteerExtra.launch({
//       headless: false,
//       executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
//     });

//     const page = await browser.newPage();

//     try {
//       await page.goto(`https://www.google.com/maps/search/${query.split(" ").join("+")}`, { waitUntil: "networkidle2" });
//     } catch (error) {
//       console.log("Error going to page:", error);
//       await browser.close();
//       return res.status(500).json({ error: "Failed to load Google Maps page" });
//     }

//     async function autoScroll(page) {
//       await page.evaluate(async () => {
//         const wrapper = document.querySelector('div[role="feed"]');
//         if (!wrapper) {
//           console.log("Feed wrapper not found");
//           return;
//         }

//         await new Promise((resolve) => {
//           let totalHeight = 0;
//           const distance = 500;
//           const scrollDelay = 1000;

//           const timer = setInterval(async () => {
//             const scrollHeightBefore = wrapper.scrollHeight;
//             wrapper.scrollBy(0, distance);
//             totalHeight += distance;

//             if (totalHeight >= scrollHeightBefore) {
//               totalHeight = 0;
//               await new Promise((resolve) => setTimeout(resolve, scrollDelay));

//               const scrollHeightAfter = wrapper.scrollHeight;

//               if (scrollHeightAfter > scrollHeightBefore) {
//                 return;
//               } else {
//                 clearInterval(timer);
//                 resolve();
//               }
//             }
//           }, 100);
//         });
//       });
//     }

//     await autoScroll(page);
//     const html = await page.content();

//     const $ = cheerio.load(html);
//     const aTags = $("a");
//     const parents = [];
//     aTags.each((i, el) => {
//       const href = $(el).attr("href");
//       if (href && href.includes("/maps/place/")) {
//         parents.push($(el).parent());
//       }
//     });

//     console.log("Number of parent elements:", parents.length);

//     const businesses = [];

//     parents.forEach((parent) => {
//       const url = parent.find("a").attr("href");
//       const website = parent.find('a[data-value="Website"]').attr("href");
//       const storeName = parent.find("div.fontHeadlineSmall").text();
//       const ratingText = parent.find("span.fontBodyMedium > span").attr("aria-label");

//       const bodyDiv = parent.find("div.fontBodyMedium").first();
//       const children = bodyDiv.children();
//       const lastChild = children.last();
//       const firstOfLast = lastChild.children().first();
//       const lastOfLast = lastChild.children().last();

//       businesses.push({
//         placeId: `ChI${url?.split("?")?.[0]?.split("ChI")?.[1]}`,
//         address: firstOfLast?.text()?.split("·")?.[1]?.trim(),
//         category: firstOfLast?.text()?.split("·")?.[0]?.trim(),
//         phone: lastOfLast?.text()?.split("·")?.[1]?.trim(),
//         googleUrl: url,
//         bizWebsite: website,
//         storeName,
//         ratingText,
//         stars: ratingText?.split("stars")?.[0]?.trim() ? Number(ratingText?.split("stars")?.[0]?.trim()) : null,
//         numberOfReviews: ratingText?.split("stars")?.[1]?.replace("Reviews", "")?.trim()
//           ? Number(ratingText?.split("stars")?.[1]?.replace("Reviews", "")?.trim())
//           : null,
//       });
//     });

//     await browser.close();
//     const end = Date.now();
//     console.log(`Time in seconds: ${Math.floor((end - start) / 1000)}`);
//     console.log('Businesses:', businesses);

//     fs.writeFileSync('businesses.json', JSON.stringify(businesses, null, 2), 'utf-8');
//     console.log('Data saved to businesses.json');
//     return res.json(businesses);

//   } catch (error) {
//     console.log("Error at googleMaps:", error.message);
//     return res.status(500).json({ error: "An error occurred while scraping Google Maps" });
//   }
// };

// module.exports = { searchGoogleMaps };

const cheerio = require("cheerio");
const puppeteerExtra = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

puppeteerExtra.use(stealthPlugin());

const searchGoogleMaps = async (req, res) => {
  console.log(req.query);
  try {
    const { keyword, place } = req.query;

    if (!keyword || !place) {
      return res
        .status(400)
        .json({
          error: "Both 'keyword' and 'place' are required as query parameters",
        });
    }

    const start = Date.now();
    const browser = await puppeteerExtra.launch({
      headless: false,
      executablePath:
        "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    });

    const page = await browser.newPage();

    try {
      await page.goto(
        `https://www.google.com/maps/search/${keyword
          .split(" ")
          .join("+")}+in+${place.split(" ").join("+")}`,
        { waitUntil: "networkidle2" }
      );
    } catch (error) {
      console.log("Error going to page:", error);
      await browser.close();
      return res.status(500).json({ error: "Failed to load Google Maps page" });
    }

    async function autoScroll(page) {
      await page.evaluate(async () => {
        const wrapper = document.querySelector('div[role="feed"]');
        if (!wrapper) {
          console.log("Feed wrapper not found");
          return;
        }

        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 500;
          const scrollDelay = 1000;

          const timer = setInterval(async () => {
            const scrollHeightBefore = wrapper.scrollHeight;
            wrapper.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeightBefore) {
              totalHeight = 0;
              await new Promise((resolve) => setTimeout(resolve, scrollDelay));

              const scrollHeightAfter = wrapper.scrollHeight;

              if (scrollHeightAfter > scrollHeightBefore) {
                return;
              } else {
                clearInterval(timer);
                resolve();
              }
            }
          }, 100);
        });
      });
    }

    await autoScroll(page);
    const html = await page.content();

    const $ = cheerio.load(html);
    const aTags = $("a");
    const parents = [];
    aTags.each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.includes("/maps/place/")) {
        parents.push($(el).parent());
      }
    });

    console.log("Number of parent elements:", parents.length);

    const businesses = [];

    parents.forEach((parent) => {
      const url = parent.find("a").attr("href");
      const website = parent.find('a[data-value="Website"]').attr("href");
      const storeName = parent.find("div.fontHeadlineSmall").text();
      const ratingText = parent
        .find("span.fontBodyMedium > span")
        .attr("aria-label");

      const bodyDiv = parent.find("div.fontBodyMedium").first();
      const children = bodyDiv.children();
      const lastChild = children.last();
      const firstOfLast = lastChild.children().first();
      const lastOfLast = lastChild.children().last();

      businesses.push({
        placeId: `ChI${url?.split("?")?.[0]?.split("ChI")?.[1]}`,
        address: firstOfLast?.text()?.split("·")?.[1]?.trim(),
        category: firstOfLast?.text()?.split("·")?.[0]?.trim(),
        phone: lastOfLast?.text()?.split("·")?.[1]?.trim(),
        googleUrl: url,
        bizWebsite: website,
        storeName,
        ratingText,
        stars: ratingText?.split("stars")?.[0]?.trim()
          ? Number(ratingText?.split("stars")?.[0]?.trim())
          : null,
        numberOfReviews: ratingText
          ?.split("stars")?.[1]
          ?.replace("Reviews", "")
          ?.trim()
          ? Number(
              ratingText?.split("stars")?.[1]?.replace("Reviews", "")?.trim()
            )
          : null,
      });
    });

    await browser.close();
    const end = Date.now();
    console.log(`Time in seconds: ${Math.floor((end - start) / 1000)}`);
    console.log("Businesses:", businesses);

    // fs.writeFileSync('businesses.json', JSON.stringify(businesses, null, 2), 'utf-8');
    // console.log('Data saved to businesses.json');
    return res.json(businesses);
  } catch (error) {
    console.log("Error at googleMaps:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while scraping Google Maps" });
  }
};

module.exports = { searchGoogleMaps };
