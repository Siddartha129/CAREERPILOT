const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

export const seedInternships = [
  {
    title: "Frontend Engineering Intern",
    company: "NovaLearn",
    description: "Build responsive React learning surfaces and reusable UI components.",
    skillsRequired: ["javascript", "react", "html", "css", "git"],
    location: "Remote",
    applyLink: "https://internshala.com/internship/detail/frontend-engineering-intern-novalearn",
    source: "Seed",
    deadline: daysFromNow(20),
    postedDate: new Date()
  },
  {
    title: "Backend Developer Intern",
    company: "SkillBridge Labs",
    description: "Create Express APIs, model MongoDB data and document REST workflows.",
    skillsRequired: ["node.js", "express", "mongodb", "rest api", "git"],
    location: "Bengaluru",
    applyLink: "https://www.linkedin.com/jobs/search/?keywords=Backend%20Developer%20Intern",
    source: "Seed",
    deadline: daysFromNow(24),
    postedDate: new Date()
  },
  {
    title: "AI Product Intern",
    company: "CareerCraft AI",
    description: "Analyze user problems, shape AI-assisted product workflows and write specs.",
    skillsRequired: ["product management", "communication", "problem solving", "data analysis"],
    location: "Remote",
    applyLink: "https://www.linkedin.com/jobs/search/?keywords=AI%20Product%20Intern",
    source: "Seed",
    deadline: daysFromNow(18),
    postedDate: new Date()
  },
  {
    title: "Full Stack MERN Intern",
    company: "ApplyFlow",
    description: "Ship MERN features across React, Node.js and MongoDB.",
    skillsRequired: ["javascript", "react", "node.js", "mongodb", "express"],
    location: "Hyderabad",
    applyLink: "https://internshala.com/internships/mern-stack-internship",
    source: "Seed",
    deadline: daysFromNow(30),
    postedDate: new Date()
  },
  {
    title: "UX Research Intern",
    company: "MapleWorks",
    description: "Plan interviews, synthesize insights and help designers validate product ideas.",
    skillsRequired: ["ux research", "figma", "communication", "problem solving"],
    location: "Remote",
    applyLink: "https://www.linkedin.com/jobs/search/?keywords=UX%20Research%20Intern",
    source: "Seed",
    deadline: daysFromNow(22),
    postedDate: new Date()
  }
];
