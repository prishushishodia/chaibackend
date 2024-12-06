// require('dotenv').config({ path:'./env'})
import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})
import connectDB from "./db/index.js";
import express from "express";
import userRouter from "./routes/user.routes.js"
import app from './app.js'






connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,() => {
        console.log(`server is running at port:${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGO DB connnection FAILED!!", err);
    
})