const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/verify-aadhaar", upload.single("aadhaar"), (req, res) => {
  const imgPath = req.file.path;

  execFile("python", ["scripts/decode_qr.py", imgPath], (err, stdout, stderr) => {
    fs.unlinkSync(imgPath); // Cleanup file

    if (err) {
      return res.status(500).json({ error: "QR verification failed", stderr });
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Failed to parse Python response", stdout });
    }
  });
});

module.exports = router;
