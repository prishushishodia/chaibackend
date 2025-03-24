import { Router } from "express";
import {
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylists,
  getPlaylistVideos,
  deletePlaylist,
} from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createPlaylist);
router.route("/add-video").post(verifyJWT, addVideoToPlaylist);
router.route("/remove-video").delete(verifyJWT, removeVideoFromPlaylist);
router.route("/").get(verifyJWT, getPlaylists);
router.route("/:playlistId/videos").get(verifyJWT, getPlaylistVideos);
router.route("/:playlistId").delete(verifyJWT, deletePlaylist);

export default router;
