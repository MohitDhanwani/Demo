const puppeteer = require("puppeteer");
const path = require("path");

async function captureShop() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const artifactDir = "/Users/mohitdhanwani/.gemini/antigravity/brain/93c75652-a658-493d-877c-8d712533b456";

  console.log("Navigating to http://localhost:3000/shop...");
  await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  console.log("Capturing Shop Catalog...");
  await page.screenshot({ path: path.join(artifactDir, "shot_05_shop_page.png") });

  console.log("Opening Quick View Modal...");
  await page.evaluate(() => {
    const btn = document.querySelector('button[data-quickview="true"]');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, "shot_06_shop_quickview.png") });

  console.log("Opening Cart Drawer...");
  await page.evaluate(() => {
    // Click close on quickview first if open
    const closeBtn = document.querySelector('button[aria-label="Close modal"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const cartBtn = btns.find(
      (b) =>
        b.innerText.includes("Harvest") ||
        b.getAttribute("aria-label") === "Open cart drawer"
    );
    if (cartBtn) cartBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, "shot_07_cart_drawer.png") });

  await browser.close();
  console.log("Shop screenshots complete!");
}

captureShop().catch(console.error);
