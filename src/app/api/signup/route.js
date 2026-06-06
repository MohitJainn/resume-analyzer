import { connectDB } from "@/lib/mongodb"
import User from "@/models/User";
import bcrypt from 'bcryptjs';
export async function POST(req){
    try{
        await connectDB();
        const { name, email, password }= await req.json();
        const existinguser=await User.findOne({email});
        if(existinguser){
            Response.json({
                message:"user already exists"
            });
        }
        const hashedpassword=await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            password:hashedpassword
        });
        return Response.json()({
            message:"signup successful"
        });

    } catch(error){
        return Response.json({
            message:"internal server error"
        });

    }
}