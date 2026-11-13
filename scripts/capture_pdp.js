const puppeteer = require("puppeteer");
const path = require("path");

async function capturePdp() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const artifactDir = "/Users/mohitdhanwani/.gemini/antigravity/brain/93c75652-a658-493d-877c-8d712533b456";

  console.log("Navigating to http://localhost:3000/shop/halo-beriti-ethiopia...");
  await page.goto("http://localhost:3000/shop/halo-beriti-ethiopia", {
    waitUntil: "networkidle2",
  });
  await new Promise((r) => setTimeout(r, 1500));

  console.log("Capturing PDP Primary Hero...");
  await page.screenshot({ path: path.join(artifactDir, "shot_08_pdp_page.png") });

  console.log("Switching to 3D Bag Viewer Tab in PDP...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const tab3d = btns.find((b) => b.innerText.includes("3D Bag Viewer"));
    if (tab3d) tab3d.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, "shot_09_pdp_3d_tab.png") });

  console.log("Scrolling to Brew Guide & Reviews...");
  await page.evaluate(() => {
    window.scrollTo({ top: 1200, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(artifactDir, "shot_10_pdp_guide_reviews.png"),
  });

  await browser.close();
  console.log("PDP captures complete!");
}

capturePdp().catch(console.error);
