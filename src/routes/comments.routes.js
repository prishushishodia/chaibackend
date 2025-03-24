import { Router } from "express";
import {
    postComment,
    getVideoComments,
    deleteComment
} from "../controllers/comment.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Post a comment
router.route("/:videoId/comment").post(verifyJWT, postComment);

// Get comments for a video
router.route("/:videoId/comments").get(getVideoComments);

// Delete a comment
router.route("/:commentId").delete(verifyJWT, deleteComment);

export default router;
