import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:[true,"This is required"],//the field is mandatory to fill if left blank error is thrown
        },
        //this is the mongodb one
        email:{
            type:String,
            required:[true,"This is required!"],
            unique:true,//redundancy is prohibited
            lowercase:true,//conversion of all e-mail id will be converted in to lower case

        },
        password:{
        type:String,
        required:[true,"This is required!!"],
        minLength:6,
        },

        avatar:{
            type:String,
            default:"",
        },
        resetPasswordToken:String,
        resetPasswordTokenExpires:Date,
favourites: [
    {
        id: { type: String, required: true },
        name: String,
        artist_name: String,
        image: String,
        duration: String,
        audio: String,
    },
],
    
});



userSchema.pre("save",async function(){
    if(!this.isModified("password"))return;
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});


userSchema.methods.comparePassword=function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
};


const User=mongoose.model("User",userSchema);
export default User;
