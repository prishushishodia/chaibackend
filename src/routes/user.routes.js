import {Router} from "express";
import {  registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage} from "../controllers/user.controllers.js"

import { upload } from "../middlewares/multer.middleware.js";
// import { verify } from "jsonwebtoken";
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(
    upload.fields([

        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser)

    router.route("/login").post(loginUser)

    //secured routes
    router.route("/logout").post(verifyJWT, logOutUser)

    router.route("/refresh-token").post(refreshAccessToken)

    router.route("/change-password").post(
        upload.fields([

            {
                name: "oldPassword",
                maxCount:1
            },
            {
                name: "newPassword",
                maxCount:1
            }
        ]),changeCurrentPassword)

    router.route("/current-user").post(getCurrentUser)



export default router 