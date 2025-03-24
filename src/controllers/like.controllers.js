// import mongoose, {isValidObjectId} from "mongoose"
// import {Like} from "../models/like.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const toggleVideoLike = asyncHandler(async (req, res) => {
//     const {videoId} = req.params
//     //TODO: toggle like on video
// })

// const toggleCommentLike = asyncHandler(async (req, res) => {
//     const {commentId} = req.params
//     //TODO: toggle like on comment

// })

// const toggleTweetLike = asyncHandler(async (req, res) => {
//     const {tweetId} = req.params
//     //TODO: toggle like on tweet
// }
// )

// const getLikedVideos = asyncHandler(async (req, res) => {
//     //TODO: get all liked videos
// })

// export {
//     toggleCommentLike,
//     toggleTweetLike,
//     toggleVideoLike,
//     getLikedVideos
// }



import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.models.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";

// Like a video
const likeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  const userId = req.user._id;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  // Check if the video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the user has already liked the video
  const existingLike = await Like.findOne({ video: videoId, user: userId });
  if (existingLike) {
    throw new ApiError(400, "You have already liked this video");
  }

  // Create a new like for the video
  const like = await Like.create({
    video: videoId,
    user: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, like, "Video liked successfully"));
});

// Unlike a video
const unlikeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  const userId = req.user._id;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  // Check if the video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the user has liked the video
  const existingLike = await Like.findOne({ video: videoId, user: userId });
  if (!existingLike) {
    throw new ApiError(404, "Like not found");
  }

  // Remove the like from the video
  await Like.findOneAndDelete({ video: videoId, user: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video unliked successfully"));
});

// Get all likes for a video
const getVideoLikes = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  // Check if the video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const likes = await Like.find({ video: videoId })
    .populate("user", "fullname username avatar")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "Likes fetched successfully"));
});

// Get all liked videos for a user
const getUserLikes = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likes = await Like.find({ user: userId })
    .populate("video", "title thumbnail description")
    .lean();

  if (likes.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No liked videos found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "Liked videos fetched successfully"));
});

export {
  likeVideo,
  unlikeVideo,
  getVideoLikes,
  getUserLikes,
};
