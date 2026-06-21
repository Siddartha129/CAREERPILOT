import { seedInternships } from "./seedInternships.js";

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

export const internshipCatalog = [
  ...seedInternships,
  {
    title: "React UI Intern",
    company: "PixelNest",
    description: "Implement accessible React interfaces with Tailwind and component state.",
    skillsRequired: ["react", "javascript", "tailwind", "css"],
    location: "Remote",
    applyLink: "https://www.linkedin.com/jobs/search/?keywords=React%20UI%20Intern",
    source: "Catalog",
    deadline: daysFromNow(15),
    postedDate: new Date()
  },
  {
    title: "Python Data Intern",
    company: "QuantGarden",
    description: "Clean datasets, write analysis notebooks and explain findings.",
    skillsRequired: ["python", "sql", "data analysis", "communication"],
    location: "Pune",
    applyLink: "https://www.linkedin.com/jobs/search/?keywords=Python%20Data%20Intern",
    source: "Catalog",
    deadline: daysFromNow(19),
    postedDate: new Date()
  },
  {
    title: "QA Automation Intern",
    company: "ShipSure",
    description: "Write regression tests and improve release confidence for web apps.",
    skillsRequired: ["testing", "javascript", "git", "problem solving"],
    location: "Chennai",
    applyLink: "https://www.linkedin.com/jobs/search/?keywords=QA%20Automation%20Intern",
    source: "Catalog",
    deadline: daysFromNow(27),
    postedDate: new Date()
  },
  {
    title: "Cloud Engineering Intern",
    company: "NimbusOps",
    description: "Support Dockerized services and basic AWS deployment workflows.",
    skillsRequired: ["aws", "docker", "kubernetes", "node.js"],
    location: "Remote",
    applyLink: "https://www.linkedin.com/jobs/search/?keywords=Cloud%20Engineering%20Intern",
    source: "Catalog",
    deadline: daysFromNow(35),
    postedDate: new Date()
  },
  {
    title: "Machine Learning Intern",
    company: "ModelLane",
    description: "Prototype ML experiments and evaluate model outputs.",
    skillsRequired: ["python", "machine learning", "data analysis"],
    location: "Bengaluru",
    applyLink: "https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning%20Intern",
    source: "Catalog",
    deadline: daysFromNow(33),
    postedDate: new Date()
  }
];
