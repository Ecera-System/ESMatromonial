const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const aadhaarRoutes = require("./routes/aadhaarRoutes");
app.use("/api", aadhaarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
