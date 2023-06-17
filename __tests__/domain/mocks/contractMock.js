import { Sequelize, Op } from "sequelize";

import SequelizeMock from "sequelize-mock";

import mockProfile from "./profileMock.js";
import mockJob from "./jobMock.js";

// Set up the mock database connection
const dbMock = new SequelizeMock();

// Mock the Contract model
const mockContract = dbMock.define("Contract", {
  terms: {
    type: Sequelize.DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.DataTypes.ENUM("new", "in_progress", "terminated"),
  },
});

mockContract.belongsTo(mockProfile, { as: "Client", foreignKey: "ClientId" });
mockContract.belongsTo(mockProfile, {
  as: "Contractor",
  foreignKey: "ContractorId",
});

mockContract.hasMany(mockJob);

const mockContracts = [
  {
    id: 1,
    terms: "bla bla bla",
    status: "terminated",
    ClientId: 1,
    ContractorId: 5,
  },
  {
    id: 2,
    terms: "bla bla bla",
    status: "in_progress",
    ClientId: 1,
    ContractorId: 6,
  },
  {
    id: 3,
    terms: "bla bla bla",
    status: "in_progress",
    ClientId: 2,
    ContractorId: 6,
  },
  {
    id: 4,
    terms: "bla bla bla",
    status: "in_progress",
    ClientId: 2,
    ContractorId: 7,
  },
  {
    id: 5,
    terms: "bla bla bla",
    status: "new",
    ClientId: 3,
    ContractorId: 8,
  },
  {
    id: 6,
    terms: "bla bla bla",
    status: "in_progress",
    ClientId: 3,
    ContractorId: 7,
  },
  {
    id: 7,
    terms: "bla bla bla",
    status: "in_progress",
    ClientId: 4,
    ContractorId: 7,
  },
  {
    id: 8,
    terms: "bla bla bla",
    status: "in_progress",
    ClientId: 4,
    ContractorId: 6,
  },
  {
    id: 9,
    terms: "bla bla bla",
    status: "in_progress",
    ClientId: 4,
    ContractorId: 8,
  },
];

const fakeContracts = [...mockContracts];

fakeContracts.forEach((fakeContract) => {
  mockContract.build(fakeContract);
  fakeContract.update = jest.fn((values, _options) => {
    const updatedContract = { ...fakeContract, ...values };
    fakeContracts[fakeContract.id - 1] = updatedContract;

    return mockProfile.build(updatedContract);
  });
});

mockContract.findOne = jest.fn((options) => {
  const { where } = options;
  const { id, ClientId, ContractorId } = where;

  let query = {};

  if (id) {
    query = { ...query, id };
  }
  if (ClientId) {
    query = { ...query, ClientId };
  }
  if (ContractorId) {
    query = { ...query, ContractorId };
  }

  const foundContract = fakeContracts.find((contract) => {
    return Object.keys(query).every((key) => {
      return contract[key] === query[key];
    });
  });

  return foundContract ? mockContract.build(foundContract) : null;
});

mockContract.findAll = jest.fn((options) => {
  const { where } = options;
  const { id, ClientId, ContractorId, status } = where;

  let query = {};

  if (id) {
    query = { ...query, id };
  }
  if (ClientId) {
    query = { ...query, ClientId };
  }
  if (ContractorId) {
    query = { ...query, ContractorId };
  }
  if (status) {
    query = { ...query, status };
  }

  const foundContracts = fakeContracts.filter((contract) => {
    return Object.keys(query).every((key) => {
      if (key === "status") {
        const { [Op.not]: not } = query[key];

        if (not) {
          return contract[key] !== not;
        }

        return contract[key] === query[key];
      }

      return contract[key] === query[key];
    });
  });

  return foundContracts.map((contract) => mockContract.build(contract));
});

export { mockContract, mockContracts };
