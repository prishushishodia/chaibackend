import { Router } from "express";
import {
    getDashboardStats,
    getRecentUploads,
    getPopularVideos
} from "../controllers/dashboard.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get dashboard statistics
router.route("/stats").get(verifyJWT, getDashboardStats);

// Get recent uploads
router.route("/recent-uploads").get(verifyJWT, getRecentUploads);

// Get popular videos
router.route("/popular-videos").get(getPopularVideos);

export default router;
