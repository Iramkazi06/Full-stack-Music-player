
import express from 'express';
import songRouter from "./routes/songRoutes.js"
import dotenv from"dotenv";
import cors from "cors";//cross origin resource share
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js";

dotenv.config(".env");
const PORT =process.env.PORT || 5001;

const app=express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//connect your database
connectDB();//this is used to import the exported default connectDB from the connectDb.js file


app.use(
  cors({
    // to give priority which port to use when
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/songs",songRouter);
app.use("/api/auth",router);



app.listen(PORT,()=> console.log(`Server is Running on port ${PORT}`));
