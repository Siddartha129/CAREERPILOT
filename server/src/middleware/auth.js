import { repo } from "../services/repository.js";
import { httpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/jwt.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) throw httpError(401, "Authentication required");
    const payload = verifyToken(token);
    const user = await repo.getById("users", payload.sub);
    if (!user) throw httpError(401, "Invalid session");
    req.user = { _id: user._id, name: user.name, email: user.email };
    next();
  } catch (error) {
    next(error.status ? error : httpError(401, "Invalid session"));
  }
}
