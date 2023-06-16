import { Router } from "express";

import { authMiddleware } from "../../middleware/auth-middleware.js";

import { getBestProfession, getBestClients } from "../../presentation/index.js";

const adminRoutes = Router();

adminRoutes.get("/admin/best-profession", authMiddleware, getBestProfession);
adminRoutes.get("/admin/best-clients", authMiddleware, getBestClients);

export { adminRoutes };
