// import { Router } from "express";
// import {
//     getAllVideos,
//     publishAVideo,
//     getVideoById,
//     updateVideo,
//     deleteVideo,
//     getUserVideos,
//     incrementVideoViews,
//     togglePublishStatus
// } from "../controllers/video.controllers.js";

// import { upload } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

// const router = Router();

// // Public routes
// router.route("/").get(getAllVideos);
// router.route("/:videoId").get(getVideoById);
// router.route("/:videoId/increment-view").post(incrementVideoViews);

// // Protected routes
// router.route("/publish").post(
//     verifyJWT,
//     upload.fields([
//         {
//             name: "video",
//             maxCount: 1
//         },
//         {
//             name: "thumbnail",
//             maxCount: 1
//         }
//     ]),
//     publishAVideo
// );

// router.route("/my-videos").get(verifyJWT, getUserVideos);

// router.route("/:videoId")
//     .patch(verifyJWT, upload.single("thumbnail"), updateVideo)
//     .delete(verifyJWT, deleteVideo);

// router.route("/:videoId/toggle-publish").patch(verifyJWT, togglePublishStatus);

// export default router;

import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getUserVideos,
    incrementVideoViews,
    togglePublishStatus
} from "../controllers/video.controllers.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);
router.route("/:videoId/increment-view").post(incrementVideoViews);

// Protected routes
router.route("/publish").post(
    verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbNail", maxCount: 1 }
    ]),
    publishAVideo
);

router.route("/my-videos").get(verifyJWT, getUserVideos);

router.route("/:videoId")
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo)
    .delete(verifyJWT, deleteVideo);

router.route("/:videoId/toggle-publish").patch(verifyJWT, togglePublishStatus);

export default router;
