import bcrypt from "bcryptjs";
import { connectDatabase } from "../src/config/db.js";
import { repo } from "../src/services/repository.js";
import { seedInternships } from "../src/data/seedInternships.js";

await connectDatabase();
for (const internship of seedInternships) {
  await repo.upsert("internships", { title: internship.title, company: internship.company }, internship, internship);
}
const email = "demo@careerpilot.ai";
let user = await repo.getOne("users", { email });
if (!user) user = await repo.create("users", { name: "Demo Student", email, password: await bcrypt.hash("Demo@12345", 10) });
await repo.upsert("profiles", { userId: user._id }, { userId: user._id }, {
  skills: ["javascript", "react", "node.js", "mongodb", "git", "html", "communication", "problem solving"],
  projects: ["Built a React internship dashboard"],
  experience: ["Worked on MERN stack projects"],
  education: ["Computer Science student"],
  preferences: { roles: ["frontend", "mern", "ai product"], location: "Remote", workMode: "Remote", stipendRange: "" },
  resumeText: "Demo Student\nSkills: JavaScript, React, Node.js, MongoDB, Git, HTML, Communication, Problem Solving\nProjects: Built a React internship dashboard\nExperience: Worked on MERN stack projects\nEducation: Computer Science student",
  embedding: []
});
await repo.deleteWhere("matches", { userId: user._id });
await repo.deleteWhere("applications", { userId: user._id });
await repo.deleteWhere("resumeVersions", { userId: user._id });
await repo.deleteWhere("notifications", { userId: user._id });
console.log("Demo data seeded.");
process.exit(0);
