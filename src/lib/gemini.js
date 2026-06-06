import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export async function analyseResume(resumeText) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an ATS and hiring expert.

Analyze this resume.

Return ONLY valid JSON with no markdown, no backticks, no explanation:

{
  "atsScore": number,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "improvements": []
}

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}