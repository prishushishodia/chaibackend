import { Router } from "express";
import {
    createTweet, getTweetById, updateTweet, deleteTweet, getUserTweets, likeTweet
} from "../controllers/tweet.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Post a tweet
router.route("/createPost").post(verifyJWT, createTweet);

// Get tweets of a user
router.route("/my-tweets").get(verifyJWT, getUserTweets);



// Delete a tweet
router.route("/:tweetId").delete(verifyJWT, deleteTweet);

export default router;
