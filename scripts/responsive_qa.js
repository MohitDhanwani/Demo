const puppeteer = require("puppeteer");
const path = require("path");

const VIEWPORTS = [
  { name: "360_mobile", width: 360, height: 740 },
  { name: "768_tablet", width: 768, height: 1024 },
  { name: "1280_laptop", width: 1280, height: 800 },
  { name: "1920_desktop", width: 1920, height: 1080 },
];

async function runResponsiveQA() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox"],
  });

  const artifactDir = "/Users/mohitdhanwani/.gemini/antigravity/brain/93c75652-a658-493d-877c-8d712533b456";

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

    console.log(`Testing viewport ${vp.name} (${vp.width}x${vp.height})...`);

    // 1. Home
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1200));

    // Check for horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    console.log(`Viewport ${vp.name} horizontal overflow:`, hasHorizontalOverflow);

    await page.screenshot({
      path: path.join(artifactDir, `qa_home_${vp.name}.png`),
    });

    // 2. Shop
    await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(artifactDir, `qa_shop_${vp.name}.png`),
    });

    // 3. PDP
    await page.goto("http://localhost:3000/shop/halo-beriti-ethiopia", { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(artifactDir, `qa_pdp_${vp.name}.png`),
    });

    await page.close();
  }

  await browser.close();
  console.log("Responsive QA completed successfully!");
}

runResponsiveQA().catch(console.error);
