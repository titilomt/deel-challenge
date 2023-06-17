import express from "express";

import {
  contractsRoutes,
  jobsRoutes,
  balancesRoutes,
  adminRoutes,
} from "../infra/routes/index.js";

import { initializeModels } from "../infra/db/orm/sequelize.js";

import bodyParser from "body-parser";

// Initialize database models
initializeModels();

const server = express();

server.use(bodyParser.json());

server.use(contractsRoutes);
server.use(jobsRoutes);
server.use(balancesRoutes);
server.use(adminRoutes);

server.get("/", (_req, res) => {
  res.status(200).send("Hello, World!");
});

export default server;
