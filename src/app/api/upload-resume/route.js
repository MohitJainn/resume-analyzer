import { analyseResume }
from "@/lib/gemini";
import Resume from "@/models/Resume";
import { connectDB } from "@/lib/mongodb";

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
   const analysis=
   await analyseResume(data.text);


    await connectDB();
    await Resume.create({
      fileName: file.name,
      extractedText: data.text,
      analysis
    });

    return Response.json({
     success:true,
     analysis,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}