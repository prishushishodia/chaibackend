import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB= async()=>{
    try {
        const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongodb connected!! DB host:${connectioninstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection ERROR:", error);
        process.exit(1)
        
    }
};
export default connectDB;