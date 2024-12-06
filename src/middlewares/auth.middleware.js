// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"
// import {ApiError} from "../utils/ApiError.js"
// // import {User} from "../models/user.models.js"

// export const verifyJWT = asyncHandler(async (req, _, next) => {
//  try {
//      const token =
//        req.cookies?.accessToken ||
//        req.header("authorization")?.replace("Bearer", "");
   
//      if (!token) {
//        throw new ApiError(401, "unauThorised access");
//      }
   
//      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//      const { User } = await import("../models/user.models.js");
//      const user= await User.findById(decodedToken?._Id).select("-password -refreshToken")
   
//      if(!user){
//        throw new ApiError(401,"invalid access token")
       
       
//      }
   
//      req.user= User;
//      next()
//  } catch (error) {
//   console.log(ApiError); // Log the ApiError definition
//   throw new ApiError(401, error?.message || "Invalid access token")


//  }
// });





import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {ApiError} from "../utils/ApiError.js"
// import {User} from "../models/user.models.js"


export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Use dynamic import for User
    const { User } = await import("../models/user.models.js");
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});