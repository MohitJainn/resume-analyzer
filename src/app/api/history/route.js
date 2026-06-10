import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
export async function GET() {
    try{
        await connectDB();
        const session = await getServerSession(authOptions);

if (!session) {
  return Response.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
        const resumes=await Resume.find({
            userId:session.user.id,

        }).sort({ createdAt: -1});
        return Response.json(resumes);
    } catch(error){
        return Response.json(
            {error: error.message},
            {status: 500}
        );
    }
} 