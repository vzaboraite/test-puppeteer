//  1. Import Puppeteer library to the file
const puppeteer = require("puppeteer");

// 2. Take the URL from command-line arguments, e.g.: `node screenshot.js https://github.com` where https://github.com is the URL
// Resources on Node.js:
// process => https://nodejs.org/api/process.html#process
// argv => https://nodejs.org/api/process.html#processargv
const url = process.argv[2];
if (!url) {
  throw "Please provide a URL as the first argument";
}

async function run() {
  // 3. Launch a new headless browser instance.
  const browser = await puppeteer.launch();

  // 4. Open new page/tab and navigate to the URL provided in
  //    the command line argument(see `2.` above)
  const page = await browser.newPage();
  await page.goto(url);

  // 5. Use puppeteer built-in method for taking a screenshot and provide a path,
  //    where that screenshot should be saved.
  await page.screenshot({ path: "screenshot.png" });

  // 6. Close the headless browser instance after the screenshot is made.
  browser.close();
}

run();
