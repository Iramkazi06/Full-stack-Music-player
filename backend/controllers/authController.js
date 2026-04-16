//import { useTransition } from "react";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { response } from "express";
import imagekit from "../config/imageKit.js";

dotenv.config();
const createToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN,
    });
};

const signup =async(req,res)=>{
    try{
  //get the data from the frontend
  const{name,email,password,avatar}=req.body;

  //check if the garbage data is not getting collected
  if(!name||!email||!password){
    return res.status(400).json({
        message:"Name, emailID and password are required"});
  }
//this emailid is data which is coming from the frontend and not the mongodb pne
  const existingUser= await User.findOne({email:email})
if(existingUser){
    return res.status(400)
    .json({message:"EmailID already exists!"});
}

//for avatar
let avatarUrl="";
if(avatar){
    const uploadResponse= await imagekit.upload({
        file:avatar,
        fileName:`avatar_${Date.now()}.jpg`,
        folder:"/mern-music-player",
    });
    avatarUrl=uploadResponse.url;
}

//user
const user=await User.create({
    name,
    email,
    password,
    avatar:avatarUrl,
})

//token
const token=createToken(user._id);
   return res.status(201).json({
        message:"User created Successfully!!",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
        },
        token,
    });
}catch(error){
    console.error("Signup not successfull");
    return res.status(500).json({message:"Signup Error"});
}
};

//login
const login=async(req,res)=>{
    try{
    const{email,password}=req.body;
    if(!email||!password){
       return res.status(400).json({
            message:"Email and password is required"
        });
    }
    const user=await User.findOne({email:email});
    if(!user){
        return res.status(400).json({
            message:"Email Id doesn't exist"
        });
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({
            message:"Invalid credentials"
        });
    }
    const token=createToken(user._id);
   return res.status(200).json({
        message:"User logged in Successfully!!",
        user:{
        id:user._id,
        name:user.name,
        email:user.email,
        avatar:user.avatar,
    },
token,
    });
}catch(error){
     console.error("Login not successfull",error.message);
   return res.status(500).json({message:"Login Error"});
}
};
//protected controller
const getMe = async(req,res)=>{
    //to check if teh user is present or not1
    if(!req.user)return res.status(401).json({
        message:"not authenticated"
    });
   return res.status(200).json(
        req.user
    );
};

//forget Password
const forgotPassword =async(req,res)=>{
    try{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user)
        return res.status(404).json({
        message:"no user found!"
    });
//generated a token
const resetToken=crypto.randomBytes(32).toString("hex");

//Hash token before saving
const hashedToken=crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

user.resetPasswordToken=hashedToken;
user.resetPasswordTokenExpires=Date.now()+10*60*1000;//10 minutes

await user.save();

const resetUrl =`${
    process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//Send an email
await sendEmail ({
    to:user.email,
    subject:"Reset your password!",
    html:`
    <h3> Password Reset</h3>
    <p>Click on the Link below to reset your password</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This Link expires in 10 minutes!!</p>`,
});
    return res.status(200).json({message:"Password Reset e-mail sent"});
}catch(error){
    console.error("Forgot Password error",error.message);
   return res.status(500).json({message:"Something Went Wrong!!"});
}
};

const resetPassword =async(req,res)=>{
    try{
const{token}=req.params;
const {password}=req.body;
if(!password||password.length<6){
    return res.status(400).json({message:
"Password must be atleast 6 characters!!"
    });
}
//Hash token before saving
const hashedToken=crypto
.createHash("sha256")
.update(token)
.digest("hex");


const user=await User.findOne({
    resetPasswordToken:hashedToken,
    resetPasswordTokenExpires:{$gt:Date.now()},
});

if(!user)
    return res.status(400).json({
    message:"Token is Invalid or expired"

});
user.password=password;
user.resetPasswordToken=undefined;
user.resetPasswordTokenExpires=undefined;

await user.save();

return res.status(200).json({
    message:"Password updated successfully!!"
});
    }catch(error){
        console.error("Reset Password error",error.message);
return res.status(500).json({message:"Something Went Wrong!!"});

    }
};

const editProfile=async(req,res)=>{
try {
    const userId=req.user?.id;
    if(!userId){
        return res.status(401).json({
            message:"Not Authenticated!"});
    }
    const{name,email,avatar,currentPassword,newPassword}=req.body;
    const user= await User.findById(userId);
    if(name)user.name=name;
    if(email)user.email=email;

    if(currentPassword||newPassword){
        if(!currentPassword ||!newPassword){
            return res.status(400).json({
                message:"Both current and new Password are required!!",
                });
        }
        const isMatch=await user.comparePassword(currentPassword);
        if(!isMatch){
            return res.status(400).json({message:
                "Current Password Incorrect!!"});
        }
        if(newPassword.length < 6){
            return res.status(400).json({
                message:"Password must be atleast be characters"
            });
        }
        user.password= newPassword;
        
    }
    if(avatar){
        const uploadResponse = await imagekit.upload({
            file:avatar,
            fileName:`avatar_${userId}_${Date.now()}.jpg`,
            folder:"/mern-music-player",
        });
        user.avatar=uploadResponse.url;
    }
        await user.save();
        return res.status(200).json({
            user:{
            id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            },
            message:"Profile updated Successfully!!!",
        });
    
    
} catch (error) {
    console.error("edit profile error",error.message);
   return res.status(500).json({message:
        "Error in Updating Profile!"
    });
}
};

export{
  signup,login,getMe,forgotPassword,resetPassword,editProfile
};