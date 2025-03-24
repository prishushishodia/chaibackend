import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    console.log("Verifying....");
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.split(" ")[1]; // Correctly extracts token

    console.log("Received Token:", token); // Debugging
    console.log("Token Received:", token); 


    if (!token) {
      throw new ApiError(401, "Unauthorized access - No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken); // Debugging

    // Use dynamic import for User
    const { User } = await import("../models/user.models.js");
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message); // Debugging
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
