import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import mongoose from "mongoose";

// Create a new playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;

  if (!title) {
    throw new ApiError(400, "Playlist title is required");
  }

  const playlist = await Playlist.create({
    title,
    description,
    user: userId,
  });

  return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

// Add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Playlist ID or Video ID");
  }

  const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized access");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already exists in the playlist");
  }

  playlist.videos.push(videoId);
  await playlist.save();

  return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
});

// Remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Playlist ID or Video ID");
  }

  const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized access");
  }

  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(404, "Video not found in the playlist");
  }

  playlist.videos = playlist.videos.filter(video => video.toString() !== videoId);
  await playlist.save();

  return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));
});

// Get all playlists of a user
const getPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const playlists = await Playlist.find({ user: userId })
    .populate("videos", "title thumbnail")
    .lean();

  return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

// Get all videos in a playlist
const getPlaylistVideos = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid Playlist ID");
  }

  const playlist = await Playlist.findOne({ _id: playlistId, user: userId })
    .populate("videos", "title thumbnail description")
    .lean();

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized access");
  }

  return res.status(200).json(new ApiResponse(200, playlist.videos, "Playlist videos fetched successfully"));
});

// Delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid Playlist ID");
  }

  const playlist = await Playlist.findOneAndDelete({ _id: playlistId, user: userId });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized access");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

export {
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylists,
  getPlaylistVideos,
  deletePlaylist,
};
