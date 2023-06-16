import express from "express";

import {
  contractsRoutes,
  jobsRoutes,
  balancesRoutes,
  adminRoutes,
} from "../infra/routes/index.js";

import bodyParser from "body-parser";

const server = express();

server.use(bodyParser.json());

server.use(contractsRoutes);
server.use(jobsRoutes);
server.use(balancesRoutes);
server.use(adminRoutes);

export default server;
