import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_origin || "http://localhost:3000", // Fallback for undefined env var
    credentials: true
}));

// Body Parsers (Essential for handling JSON and URL-encoded data)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static Files (Ensure 'public' folder exists)
app.use(express.static("public"));

// Cookie Parser
app.use(cookieParser());

// Route Imports
import userRouter from './routes/user.routes.js';
import likeRouter from './routes/likes.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import videoRouter from './routes/video.routes.js';

// Route Declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);  
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/video", videoRouter);

export default app;
