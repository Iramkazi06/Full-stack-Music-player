import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: "../.env"});


const connectDB=async()=>{
    try {
        const connection =await mongoose.connect(process.env.MONGODB_URI);
        console.log("MONGODB connected Successfully!!");
    } catch (error) {
        console.error("MongoDB connection Error:", error.message);
    }
};
export default connectDB;