import { Router } from "express";

import { authMiddleware } from "../../middleware/auth-middleware.js";

import { postDepositController } from "../../presentation/index.js";

const balancesRoutes = Router();

balancesRoutes.post(
  "/balances/deposit/:userId",
  authMiddleware,
  postDepositController
);

export { balancesRoutes };
