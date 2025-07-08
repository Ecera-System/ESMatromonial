import express from 'express';
import { getVisitors } from '../controllers/visitorController.js';

const router = express.Router();

router.get('/', getVisitors); // handles GET /api/v1/visitors

export default router;
