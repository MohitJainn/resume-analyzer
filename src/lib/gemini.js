import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export async function analyseResume(resumeText) {
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite",
  });

  const prompt = `
You are an ATS and hiring expert.

Analyze this resume.


Important:
- Do not assume project dates.
- Only use dates explicitly mentioned.
- Do not flag future dates unless a project start/end date is explicitly after today's date.
- If dates are unclear, say "date information unavailable".

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