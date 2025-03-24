// import mongoose, { isValidObjectId } from "mongoose"
// import {Tweet} from "../models/tweet.model.js"
// import {User} from "../models/user.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"

// const createTweet = asyncHandler(async (req, res) => {
//     //TODO: create tweet
// })

// const getUserTweets = asyncHandler(async (req, res) => {
//     // TODO: get user tweets
// })

// const updateTweet = asyncHandler(async (req, res) => {
//     //TODO: update tweet
// })

// const deleteTweet = asyncHandler(async (req, res) => {
//     //TODO: delete tweet
// })

// export {
//     createTweet,
//     getUserTweets,
//     updateTweet,
//     deleteTweet
// }

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.models.js";
import mongoose from "mongoose";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
  try {
    console.log("Hitting tweet part")
    const { content } = req.body;
    console.log(content)

  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.create({
    content,
    user: req.user._id,
  });

  if(!tweet){
    console.log("Not able to create tweet")
    throw new ApiError(400,"Error while creating tweet")
  }
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
    
  } catch (error) {
    console.log(error)
    console.log("Error in creating Tweet")
    throw new ApiError(400, "Error in creating tweet")
  }
});

// Get a tweet by ID
const getTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId).populate("user", "username avatar");

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res.status(200).json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
});

// Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, user: req.user._id },
    { content },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(404, "Tweet not found or unauthorized");
  }

  return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findOneAndDelete({ _id: tweetId, user: req.user._id });

  if (!tweet) {
    throw new ApiError(404, "Tweet not found or unauthorized");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

// Get all tweets by user
const getUserTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

// Like a tweet
const likeTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const isLiked = tweet.likes.includes(req.user._id);

  if (isLiked) {
    tweet.likes.pull(req.user._id);
  } else {
    tweet.likes.push(req.user._id);
  }

  await tweet.save();

  return res.status(200).json(
    new ApiResponse(200, tweet, isLiked ? "Tweet unliked" : "Tweet liked")
  );
});

export { createTweet, getTweetById, updateTweet, deleteTweet, getUserTweets, likeTweet };
