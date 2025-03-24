import { Router } from "express";
import {
    likeVideo,
    unlikeVideo,
    getVideoLikes
} from "../controllers/like.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Like a video
router.route("/:videoId/like").post(verifyJWT, likeVideo);

// Unlike a video
router.route("/:videoId/unlike").post(verifyJWT, unlikeVideo);

// Get likes for a video
router.route("/:videoId/likes").get(getVideoLikes);

export default router;
