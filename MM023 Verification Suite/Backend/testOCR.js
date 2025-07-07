// testOCR.js
const path = require("path");
const { analyzeAadharDocument } = require("./services/ocrService");

// Arguments: node testOCR.js <file_path> <user_name>
const filePath = process.argv[2];
const userName = process.argv[3];

if (!filePath) {
  console.error("Usage: node testOCR.js <image_file_path> <user_name>");
  process.exit(1);
}

const absPath = path.resolve(filePath);

(async () => {
  console.log(`Analyzing Aadhaar document at: ${absPath}`);
  if (userName) {
    console.log(`Expected User Name: "${userName}"`);
  }

  const score = await analyzeAadharDocument(absPath, userName);

  console.log("\n Final Result:");
  if (score >= 5) {
    console.log(`Score: ${score} / 10  VERIFIED`);
  } else {
    console.log(`Score: ${score} / 10  FLAGGED FOR REVIEW`);
  }

  process.exit(0);
})();
