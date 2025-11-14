import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await req.json()
        const existingUserAndVerified = await userModel.findOne({
            userName:username,
            isVerified: true
        })
        if (existingUserAndVerified) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }
        const existingUserByEmail = await userModel.findOne({
            email,
        })
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            //TODO: This i will implement
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email is already registered"
                }, { status: 500 })
            }
            else {
                const hashedPass = await bcrypt.hash(password, 10)
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)
                existingUserByEmail.password=hashedPass
                existingUserByEmail.verifyCode=otp 
                existingUserByEmail.verifyCodeExpiry=expiryDate
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPass = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new userModel({
                userName: username,
                email,
                password: hashedPass,
                verifyCode: otp,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMsg: true,
                messages: []
            })
            await newUser.save()
        }
        const verifyToken = jwt.sign(
            { username },
            process.env.NEXT_AUTH_SECRET!, 
            { expiresIn: "15m" }
        );
        const emailResponse = await sendVerificationEmail(email, username, otp)
        // console.log("Email response is ", emailResponse)
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User registered, Please verify your email",
            token:verifyToken,
        }, { status: 200 })

    }

    catch (error) {
        console.error("Error registering user", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
            { status: 500 })
    }
}
