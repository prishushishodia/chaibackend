// import mongoose from "mongoose"
// import {Video} from "../models/video.model.js"
// import {Subscription} from "../models/subscription.model.js"
// import {Like} from "../models/like.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const getChannelStats = asyncHandler(async (req, res) => {
//     // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
// })

// const getChannelVideos = asyncHandler(async (req, res) => {
//     // TODO: Get all the videos uploaded by the channel
// })

// export {
//     getChannelStats, 
//     getChannelVideos
//     }

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";

// Get user dashboard data
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get the number of subscriptions the user has
  const subscriptionCount = await Subscription.countDocuments({ subscriber: userId });

  // Get the number of liked videos the user has
  const likeCount = await Like.countDocuments({ user: userId });

  // Get the number of comments the user has made
  const commentCount = await Comment.countDocuments({ user: userId });

  // Get the user's most recent liked videos (limit to 5)
  const recentLikes = await Like.find({ user: userId })
    .populate("video", "title thumbnail")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Get the user's most recent comments (limit to 5)
  const recentComments = await Comment.find({ user: userId })
    .populate("video", "title thumbnail")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Get the user's most recent subscriptions (limit to 5)
  const recentSubscriptions = await Subscription.find({ subscriber: userId })
    .populate("channel", "fullname username avatar")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Assemble the dashboard data
  const dashboardData = {
    subscriptionCount,
    likeCount,
    commentCount,
    recentLikes,
    recentComments,
    recentSubscriptions,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashboardData, "Dashboard data fetched successfully"));
});

export {
  getDashboard,
};
