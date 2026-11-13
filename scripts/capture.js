const puppeteer = require("puppeteer");
const path = require("path");

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

  // Wait for preloader animation to finish
  await new Promise((r) => setTimeout(r, 2500));

  const artifactDir = "/Users/mohitdhanwani/.gemini/antigravity/brain/93c75652-a658-493d-877c-8d712533b456";

  console.log("Capturing Hero...");
  await page.screenshot({ path: path.join(artifactDir, "shot_01_hero.png") });

  console.log("Scrolling to Manifesto...");
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, "shot_02_manifesto.png") });

  console.log("Scrolling to Bag Scrolly...");
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 4.0, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, "shot_03_bag_ritual.png") });

  console.log("Scrolling to Featured & Footer...");
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, "shot_04_featured_footer.png") });

  await browser.close();
  console.log("All screenshots captured successfully!");
}

capture().catch(console.error);
