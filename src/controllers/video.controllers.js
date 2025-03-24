import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    
    const pipeline = [];
    
    // Match by userId if provided
    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID");
        }
        pipeline.push({ $match: { owner: new mongoose.Types.ObjectId(userId) } });
    }

    // Match by search query if provided
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        });
    }

    // Add sorting
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "desc" ? -1 : 1
            }
        });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Add pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

    // Add user details
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                {
                    $project: {
                        fullname: 1,
                        username: 1,
                        avatar: 1
                    }
                }
            ]
        }
    });
    pipeline.push({ $unwind: "$owner" });

    const videos = await Video.aggregate(pipeline);
    const totalVideos = await Video.countDocuments(pipeline[0]?.$match || {});

    if (!videos?.length) {
        throw new ApiError(404, "No videos found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                totalVideos,
                currentPage: page,
                totalPages: Math.ceil(totalVideos / limit)
            },
            "Videos fetched successfully"
        )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body;
console.log(req.body)
    if (!title?.trim()) {
        throw new ApiError(400, "Title is required");
    }

    const videoLocalPath = req.files?.video?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    console.log(videoLocalPath)
    console.log(thumbnailLocalPath)

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = thumbnailLocalPath ? await uploadOnCloudinary(thumbnailLocalPath) : null;

    if (!videoFile?.url) {
        throw new ApiError(400, "Video file upload failed");
    }

    const video = await Video.create({
        title: title.trim(),
        description: description?.trim() || "",
        videoFile: videoFile.url,
        thumbnail: thumbnail?.url || "",
        duration: videoFile.duration,
        owner: req.user._id,
        tags: tags ? tags.split(",").map(tag => tag.trim()) : []
    });

    const createdVideo = await Video.findById(video._id).populate("owner", "fullname username avatar");

    if (!createdVideo) {
        throw new ApiError(500, "Failed to create video");
    }

    res.status(201).json(
        new ApiResponse(201, createdVideo, "Video published successfully")
    );
});

// Get a video by ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("owner", "fullname username avatar");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Update video details
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, tags } = req.body;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to update this video");
  }

  video.title = title || video.title;
  video.description = description || video.description;
  video.tags = tags ? tags.split(",") : video.tags;
  await video.save();

  res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

// Delete a video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req.user._id)) {
    throw new ApiError(403, "Unauthorized to delete this video");
  }

  await video.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// Get all videos for a user
const getUserVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ owner: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, videos, "User's videos fetched successfully"));
});

// Increment video views
const incrementVideoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(200, video, "Video view count incremented"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (String(video.owner) !== String(req.user._id)) {
        throw new ApiError(403, "Unauthorized to toggle video status");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video ${video.isPublished ? "published" : "unpublished"} successfully`
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getUserVideos,
    incrementVideoViews,
    togglePublishStatus
}
