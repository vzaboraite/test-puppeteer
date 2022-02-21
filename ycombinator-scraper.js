const puppeteer = require("puppeteer");

function run() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://news.ycombinator.com/");
      // Build a results[] of item objects with `url` and `text` fields, that in this example
      // represent recent news(30 entries) on `Hacker News` website.
      // Resource on Puppeteer:
      // evaluate() => https://pptr.dev/#?product=Puppeteer&version=v13.3.2&show=api-pageevaluatepagefunction-args
      let urls = await page.evaluate(() => {
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
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  });
}

run().then(console.log).catch(console.error);
