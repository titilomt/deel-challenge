import { Router } from "express";

import { authMiddleware } from "../../middleware/auth-middleware.js";

import { getContractById, getAllContracts } from "../../presentation/index.js";

const contractsRoutes = Router();

contractsRoutes.get("/contracts", authMiddleware, getAllContracts);
contractsRoutes.get("/contracts/:id", authMiddleware, getContractById);

export { contractsRoutes };
