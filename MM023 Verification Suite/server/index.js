// server/index.js (ESM)
import express from "express";
import cors from "cors";
import path from "path";
import aadhaarRoutes from "./routes/aadhaarRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", aadhaarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
