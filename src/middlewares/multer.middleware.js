import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the 'uploads' folder exists
const uploadPath = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Correct Path
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Preserves file extension
    }
});

// File Filter for video & thumbnail
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/mkv", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type! Only MP4, MKV, JPG, and PNG are allowed."), false);
    }
};

// Multer Configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: fileFilter
});

export { upload };
