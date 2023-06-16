import { Router } from "express";

import { authMiddleware } from "../../middleware/auth-middleware.js";

import { getAllUnpaidJobs, postPaymentJob } from "../../presentation/index.js";

const jobsRoutes = Router();

jobsRoutes.get("/jobs/unpaid", authMiddleware, getAllUnpaidJobs);
jobsRoutes.post("/jobs/:job_id/pay", authMiddleware, postPaymentJob);

export { jobsRoutes };
