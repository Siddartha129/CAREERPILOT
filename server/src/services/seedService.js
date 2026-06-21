import bcrypt from "bcryptjs";
import { dbState } from "../config/db.js";
import { env } from "../config/env.js";
import { seedInternships } from "../data/seedInternships.js";
import { repo } from "./repository.js";

export async function seedInitialData() {
  if (dbState.mode === "mongo" && !env.SEED_SAMPLE_DATA) return;

  for (const internship of seedInternships) {
    await repo.upsert("internships", { title: internship.title, company: internship.company }, internship, internship);
  }

  if (dbState.mode !== "memory") return;

  const email = "demo@careerpilot.ai";
  let user = await repo.getOne("users", { email });
  if (!user) {
    user = await repo.create("users", {
      name: "Demo Student",
      email,
      password: await bcrypt.hash("Password@123", 10)
    });
  }

  await repo.upsert("profiles", { userId: user._id }, {
    userId: user._id,
    preferences: { roles: ["frontend", "mern", "ai product"], location: "Remote", workMode: "Remote", stipendRange: "" }
  }, {
    skills: ["javascript", "react", "node.js", "mongodb", "git", "html", "communication", "problem solving"],
    projects: ["Built a React internship dashboard"],
    experience: ["Worked on MERN stack projects"],
    education: ["Computer Science student"],
    preferences: { roles: ["frontend", "mern", "ai product"], location: "Remote", workMode: "Remote", stipendRange: "" },
    resumeText: "Demo Student\nSkills: JavaScript, React, Node.js, MongoDB, Git, HTML, Communication, Problem Solving\nProjects: Built a React internship dashboard\nExperience: Worked on MERN stack projects\nEducation: Computer Science student",
    embedding: []
  });
}
