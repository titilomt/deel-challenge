import { Sequelize } from "sequelize";

import SequelizeMock from "sequelize-mock";

import { mockContract, mockContracts } from "./contractMock.js";

// Set up the mock database connection
const dbMock = new SequelizeMock();

// Mock the Contract model
const mockJob = dbMock.define("Job", {
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
  },
  paid: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
  paymentDate: {
    type: Sequelize.DATE,
  },
});

mockJob.belongsTo(mockContract);

const mockJobs = [
  {
    id: 1,
    description: "work",
    price: 200,
    ContractId: 1,
  },
  {
    id: 2,
    description: "work",
    price: 201,
    ContractId: 2,
  },
  {
    id: 3,
    description: "work",
    price: 202,
    ContractId: 3,
  },
  {
    id: 4,
    description: "work",
    price: 200,
    ContractId: 4,
  },
  {
    id: 5,
    description: "work",
    price: 200,
    ContractId: 7,
  },
  {
    id: 6,
    description: "work",
    price: 2020,
    paid: true,
    paymentDate: "2020-08-15T19:11:26.737Z",
    ContractId: 7,
  },
  {
    id: 7,
    description: "work",
    price: 200,
    paid: true,
    paymentDate: "2020-08-15T19:11:26.737Z",
    ContractId: 2,
  },
  {
    id: 8,
    description: "work",
    price: 200,
    paid: true,
    paymentDate: "2020-08-16T19:11:26.737Z",
    ContractId: 3,
  },
  {
    id: 9,
    description: "work",
    price: 200,
    paid: true,
    paymentDate: "2020-08-17T19:11:26.737Z",
    ContractId: 1,
  },
  {
    id: 10,
    description: "work",
    price: 200,
    paid: true,
    paymentDate: "2020-08-17T19:11:26.737Z",
    ContractId: 5,
  },
  {
    id: 11,
    description: "work",
    price: 21,
    paid: true,
    paymentDate: "2020-08-10T19:11:26.737Z",
    ContractId: 1,
  },
  {
    id: 12,
    description: "work",
    price: 21,
    paid: true,
    paymentDate: "2020-08-15T19:11:26.737Z",
    ContractId: 2,
  },
  {
    id: 13,
    description: "work",
    price: 121,
    paid: true,
    paymentDate: "2020-08-15T19:11:26.737Z",
    ContractId: 3,
  },
  {
    id: 14,
    description: "work",
    price: 121,
    paid: true,
    paymentDate: "2020-08-14T23:11:26.737Z",
    ContractId: 3,
  },
];

mockJobs.forEach((fakeJob) => {
  mockJob.build(fakeJob);
  fakeJob.update = jest.fn((values, _options) => {
    const updatedJob = { ...fakeJob, ...values };
    mockJobs[fakeJob.id - 1] = updatedJob;

    return mockJob.build(updatedJob);
  });
});

mockJob.findOne = jest.fn((options) => {
  const { where } = options;
  const { id } = where;
  const job = mockJobs.find((j) => j.id === id && !j.paid);

  if (!job) return null;

  const contract = mockContracts.find((c) => c.id === job.ContractId);

  if (contract.status !== "in_progress") return null;

  job["Contract"] = contract;

  return mockJob.build(job);
});

mockJob.findAll = jest.fn((options) => {
  const { include } = options;
  const [contractModel] = include;

  const queryContractModel = contractModel.where;

  const { ContractorId, ClientId, status } = queryContractModel;

  const contractId = mockContracts.find((c) => {
    if (
      (c.ClientId === ClientId || c.ContractorId === ContractorId) &&
      status === c.status
    )
      return c;
  })?.id;

  const jobs = mockJobs.filter(
    (job) => job.ContractId === contractId && !job.paid
  );

  return jobs.map((job) => mockJob.build(job));
});

export default mockJob;
