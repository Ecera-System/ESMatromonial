import fs from "fs";
import path from "path";
import JimpPkg from "jimp";   
import QrCode from "qrcode-reader";
import { execFile } from "child_process";


// Get image path
const imgFile = process.argv[2];
if (!imgFile) {
  console.error("Usage: node scripts/verifyAadhaarImage.mjs <image_file>");
  process.exit(1);
}

(async () => {
  try {
    const absImgPath = path.resolve(imgFile);

    // Read the image
    const image = await JimpPkg.read(absImgPath);

    const qr = new QrCode();

    console.log("🔍 Decoding QR code...");

    const qrResult = await new Promise((resolve, reject) => {
      qr.callback = (err, value) => {
        if (err) return reject(err);
        resolve(value);
      };
      qr.decode(image.bitmap);
    });

    if (!qrResult || !qrResult.result) {
      throw new Error("No QR code found in image.");
    }

    const xmlData = qrResult.result;
    console.log("✅ QR code decoded successfully.");

    // Save XML
    const xmlFilePath = path.resolve("./aadhaar_qr_output.xml");
    fs.writeFileSync(xmlFilePath, xmlData);
    console.log(`📄 XML saved to: ${xmlFilePath}`);

    // Windows: path to your EXE
    const exePath = "C:\\Program Files (x86)\\debasmita.sabut@gmail.com\\QrCodeReaderV4.2\\QRCodeScannerValidate.exe";

    console.log("⚙️ Running Aadhaar verifier...");

    execFile(
      exePath,
      ["verify", "--input", xmlFilePath],
      { maxBuffer: 1024 * 500 },
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Verifier error:", stderr || error);
          process.exit(1);
        }

        try {
          const result = JSON.parse(stdout);
          console.log("✅ Verification result:");
          console.log(JSON.stringify(result, null, 2));

          if (result.verified) {
            console.log(`🎉 Aadhaar verification SUCCESS for: ${result.name}`);
          } else {
            console.log(`⚠️ Aadhaar verification FAILED.`);
          }
        } catch (err) {
          console.error("❌ Failed to parse verifier output.");
          console.error(stdout);
        }
      }
    );
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
