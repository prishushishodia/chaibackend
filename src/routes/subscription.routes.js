import { Router } from "express";
import {
    subscribeToChannel,
    unsubscribeFromChannel,
    getUserSubscriptions,
    getChannelSubscribers
} from "../controllers/subscription.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Subscribe to a channel
router.route("/:channelId/subscribe").post(verifyJWT, subscribeToChannel);

// Unsubscribe from a channel
router.route("/:channelId/unsubscribe").post(verifyJWT, unsubscribeFromChannel);

// Get user's subscriptions
router.route("/my-subscriptions").get(verifyJWT, getUserSubscriptions);

// Get subscribers of a channel
router.route("/:channelId/subscribers").get(getChannelSubscribers);

export default router;
