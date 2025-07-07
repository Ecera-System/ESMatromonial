import express from "express";
import { getVisitors, addVisitor } from "../controllers/visitorController.js";

const router = express.Router();

router.get("/api/v1/visitors", getVisitors);
router.post("/api/v1/visitors", addVisitor);

export default router;
