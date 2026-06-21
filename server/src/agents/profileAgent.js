import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { extractSkills, sectionLines, summarizeText } from "../utils/text.js";
import { generateEmbedding, generateLocalText } from "../services/ollamaService.js";

export async function parseResume(buffer) {
  const parsed = await pdfParse(buffer);
  const resumeText = String(parsed.text || "").trim();
  const aiSummary = await generateLocalText(`Summarize this resume in 2 concise sentences:\n\n${resumeText.slice(0, 4000)}`);

  return {
    resumeText,
    summary: aiSummary || summarizeText(resumeText),
    skills: extractSkills(resumeText),
    projects: sectionLines(resumeText, ["project", "built", "developed"]),
    experience: sectionLines(resumeText, ["experience", "intern", "worked"]),
    education: sectionLines(resumeText, ["education", "university", "college", "school", "degree"]),
    embedding: await generateEmbedding(resumeText)
  };
}
