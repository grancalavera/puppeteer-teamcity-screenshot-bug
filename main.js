const fs = require("fs");
const path = require("path");
const assert = require("assert");
const puppeteer = require("puppeteer");

const TIMEOUT = 2000;
const filePath = path.join(process.cwd(), "index.html");
const screenshotPath = path.join(process.cwd(), "screenshot.png");

console.log(`source: ${filePath}`);
console.log(`target: ${screenshotPath}`);

main()
  .then(() => {
    console.log(`screenshot "${screenshotPath}" successfully found!`);
    process.exit(0);
  })
  .catch(e => {
    console.error(e.message || e);
    process.exit(1);
  });

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(filePath, {
    waitUntil: ["networkidle2"]
  });

  const timeoutId = setTimeout(() => {
    throw new Error(`screenshot "${screenshotPath}" timed out!`);
  }, TIMEOUT);

  await page.screenshot({ path: screenshotPath });
  clearTimeout(timeoutId);

  assert.doesNotThrow(
    () => fs.statSync(screenshotPath),
    `screenshot "${screenshotPath}" not found!`
  );
}
