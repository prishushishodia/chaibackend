// import mongoose from "mongoose"
// import {Comment} from "../models/comment.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const getVideoComments = asyncHandler(async (req, res) => {
//     //TODO: get all comments for a video
//     const {videoId} = req.params
//     const {page = 1, limit = 10} = req.query

// })

// const addComment = asyncHandler(async (req, res) => {
//     // TODO: add a comment to a video
// })

// const updateComment = asyncHandler(async (req, res) => {
//     // TODO: update a comment
// })

// const deleteComment = asyncHandler(async (req, res) => {
//     // TODO: delete a comment
// })

// export {
//     getVideoComments, 
//     addComment, 
//     updateComment,
//      deleteComment
//     }


import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";

// Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
  const { videoId, text } = req.body;
  const userId = req.user._id;

  if (!videoId || !text) {
    throw new ApiError(400, "Video ID and comment text are required");
  }

  // Check if the video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Create a new comment
  const comment = await Comment.create({
    video: videoId,
    user: userId,
    text,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  // Check if the comment exists and if the user is the owner of the comment
  const comment = await Comment.findOne({ _id: commentId, user: userId });
  if (!comment) {
    throw new ApiError(404, "Comment not found or you don't have permission to delete it");
  }

  // Delete the comment
  await comment.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

// Get all comments for a video
const getCommentsForVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  // Check if the video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comments = await Comment.find({ video: videoId })
    .populate("user", "fullname username avatar")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// Get all comments made by a user
const getUserComments = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const comments = await Comment.find({ user: userId })
    .populate("video", "title thumbnail description")
    .lean();

  if (comments.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No comments found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "User's comments fetched successfully"));
});

export {
  addComment,
  deleteComment,
  getCommentsForVideo,
  getUserComments,
};
