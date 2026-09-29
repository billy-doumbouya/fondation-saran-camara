import fs from "node:fs";

const content = fs.readFileSync(new URL("./seed-all-data.mjs", import.meta.url), "utf8");
const urls = [...new Set(content.match(/https:\/\/(?:images\.unsplash\.com|images\.pexels\.com)[^\s"'\`]+/g) || [])];

console.log(`🔍 Vérification de ${urls.length} images Unsplash/Pexels...`);

let failed = 0;
for (const url of urls) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.status >= 400) {
      console.log(`❌ [${res.status}] ${url}`);
      failed++;
    } else {
      console.log(`✅ [${res.status}] ${url.slice(0, 65)}...`);
    }
  } catch (err) {
    console.log(`❌ [ERR] ${url} : ${err.message}`);
    failed++;
  }
}

console.log(`\n📊 Bilan: ${urls.length - failed}/${urls.length} images valides.`);
if (failed > 0) process.exit(1);
