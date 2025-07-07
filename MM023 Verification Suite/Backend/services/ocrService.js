const Tesseract = require("tesseract.js");

exports.analyzeAadharDocument = async (filePath, userName) => {
  console.log(`Starting OCR on: ${filePath}`);

  const { data: { text } } = await Tesseract.recognize(filePath, "eng", {
    logger: (m) => console.log(m)
  });

  console.log("OCR Result Text:");
  console.log(text);

  let score = 0;

  const criteria = [
    { pattern: /Government of India/i, weight: 3 },
    { pattern: /Aadhaar/i, weight: 2 },
    { pattern: /\b\d{4}\s\d{4}\s\d{4}\b/, weight: 3 },
    { pattern: /Year of Birth/i, weight: 1 },
    { pattern: /Male|Female|Transgender/i, weight: 1 }
  ];

  criteria.forEach((c) => {
    if (c.pattern.test(text)) {
      score += c.weight;
    }
  });

  // Check for name match
  if (userName) {
    const nameRegex = new RegExp(userName, "i");
    if (nameRegex.test(text)) {
      console.log(` User name "${userName}" found in document.`);
      score += 2;
    } else {
      console.log(` User name "${userName}" NOT found in document.`);
    }
  }

  if (score > 10) score = 10;

  console.log(`Computed OCR score: ${score}`);
  return score;
};
