import mongoose, { Schema, Document, Mongoose, mongo } from "mongoose";

export interface Message extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}


const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMsg: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    isAcceptingMsg: {
        type: Boolean,
        required: true,
        default: true,
    },
    messages: [MessageSchema],
});


const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default userModel