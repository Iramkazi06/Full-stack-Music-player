
import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {forgotPassword,getMe,signup,login,resetPassword,editProfile} from "../controllers/authController.js";
const router=express.Router();

//post request coz we are creating
router.post("/signup",signup);
router.post("/login",login);
router.get("/me",protect,getMe);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
router.patch("/profile",protect,editProfile,);
//put instead of patch because
//put replaces the enitire resourcebut patch only replaces the needed attribute

export default router;

//token:encrypted info of the user
//with the response the token is sent too.
//jwt (json web token)is used to create the token 
//token is important to access the protected routes


