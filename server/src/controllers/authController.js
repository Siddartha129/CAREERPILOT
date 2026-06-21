import bcrypt from "bcryptjs";
import { repo } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { signToken } from "../utils/jwt.js";

const publicUser = (user) => ({ _id: user._id, name: user.name, email: user.email });

export const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!name || !email || password.length < 6) throw httpError(400, "Name, email and a 6+ character password are required");
  if (await repo.getOne("users", { email })) throw httpError(409, "Email already exists");

  const user = await repo.create("users", { name, email, password: await bcrypt.hash(password, 10) });
  const profile = await repo.create("profiles", {
    userId: user._id,
    skills: [],
    projects: [],
    experience: [],
    education: [],
    preferences: { roles: [], location: "", workMode: "", stipendRange: "" },
    resumeText: "",
    embedding: []
  });
  res.status(201).json({ user: publicUser(user), profile, token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = await repo.getOne("users", { email });
  if (!user || !(await bcrypt.compare(password, user.password))) throw httpError(401, "Invalid email or password");
  res.json({ user: publicUser(user), token: signToken(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
