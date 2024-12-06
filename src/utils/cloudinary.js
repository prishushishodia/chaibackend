// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (loaclFilePath) => {
//   try {
//     if (!localFilePath) {
//       throw new Error("File path is required");
//     }
    
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });
    
//      //file has been uploaded successfully
//     // console.log("FIle is uploaded on cloudinary", response.url);
// fs.unlinkSync(loaclFilePath)
//     return response;
//   } catch (error) {
//     fs.unlinkSync(loaclFilePath);
//     return null;
//   };
// }

// export {uploadOnCloudinary}


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("File path is required");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded successfully
    // console.log("File uploaded on Cloudinary:", response.url);

    // Delete the local file
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    // Attempt to delete local file in case of failure
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.error("Error deleting file during error handling:", err);
    }

    return null;
  }
};

export { uploadOnCloudinary };
