
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";

const subscribeToChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  const subscriberId = req.user._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  if (channelId === subscriberId.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  // Check if both the subscriber and channel exist
  const subscriber = await User.findById(subscriberId);
  const channel = await User.findById(channelId);
  
  if (!subscriber) {
    throw new ApiError(404, "Subscriber not found");
  }

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  if (existingSubscription) {
    throw new ApiError(400, "You are already subscribed to this channel");
  }

  const subscription = await Subscription.create({
    channel: channelId,
    subscriber: subscriberId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subscription, "Subscribed successfully"));
});

const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  const subscriberId = req.user._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  // Ensure both user and channel exist before proceeding
  const subscriber = await User.findById(subscriberId);
  const channel = await User.findById(channelId);
  
  if (!subscriber) {
    throw new ApiError(404, "Subscriber not found");
  }

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscription = await Subscription.findOneAndDelete({
    channel: channelId,
    subscriber: subscriberId,
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
});

const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;

  const subscriptions = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "fullname username avatar")
    .lean();

  if (subscriptions.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No subscriptions found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscriptions fetched successfully"));
});

const getSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const channel = await User.findById(channelId);
  
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "fullname username avatar")
    .lean();

  if (subscribers.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No subscribers found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});

export {
  subscribeToChannel,
  unsubscribeFromChannel,
  getSubscriptions,
  getSubscribers,
};

