import { getProfileService } from "../application/index.js";

const authMiddleware = async (req, res, next) => {
  const profile = await getProfileService(req.get("profile_id") || 0);

  if (!profile) return res.status(401).end();

  req.profile = profile;
  next();
};

export { authMiddleware };
