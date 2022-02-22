const puppeteer = require("puppeteer");
const fs = require("fs");

function run(pagesToScrape) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pagesToScrape) {
        pagesToScrape = 1;
      }
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      // Allow requests with the resourceType of `document`, blocking out any images, CSS
      // and anything else besides HTML response.
      page.on("request", (request) => {
        if (request.resourceType() === "document") {
          request.continue();
        } else {
          request.abort();
        }
      });
      await page.goto("https://news.ycombinator.com/");
      let currentPage = 1;
      let urls = [];
      while (currentPage <= pagesToScrape) {
        let newUrls = await page.evaluate(() => {
          let results = [];
          let items = document.querySelectorAll("a.titlelink");
          items.forEach((item) => {
            results.push({
              url: item.getAttribute("href"),
              text: item.innerHTML,
            });
          });
          return results;
        });
        urls = urls.concat(newUrls);
        fs.writeFileSync("./urls.json", JSON.stringify(urls));
        if (currentPage < pagesToScrape) {
          await Promise.all([
            await page.waitForSelector("a.morelink"),
            await page.click("a.morelink"),
            await page.waitForSelector("a.titlelink"),
          ]);
        }
        currentPage++;
      }
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  });
}

run(3).then(console.log).catch(console.error);
