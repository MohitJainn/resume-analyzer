import { analyseResume }
from "@/lib/gemini";
import Resume from "@/models/Resume";
import { connectDB } from "@/lib/mongodb";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pdf = (await import("pdf-parse/lib/pdf-parse.js")).default; // 👈 bypass test file
    const data = await pdf(buffer);
    const resumeHash = crypto
  .createHash("sha256")
  .update(data.text)
  .digest("hex");
  await connectDB();
  const session=await getServerSession(authOptions);
  const existingResume=await Resume.findOne({
    userId:session.user.id,
    resumeHash
  });
  if(existingResume){
    return Response.json({
      success:true,
      cached:true,
      analysis:existingResume.analysis,
      

    });
  }
   const analysis=
   await analyseResume(data.text);


   
    await Resume.create({
      fileName: file.name,
      extractedText: data.text,
      analysis,
      resumeHash,
      userId:session.user.id
      
    });

    return Response.json({
     success:true,
     cached:false,
     analysis,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}