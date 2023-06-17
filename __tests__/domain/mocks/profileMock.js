import { Sequelize } from "sequelize";

import SequelizeMock from "sequelize-mock";

// Set up the mock database connection
const dbMock = new SequelizeMock();

// Mock the Profile model
const mockProfile = dbMock.define("Profile", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  profession: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  balance: {
    type: Sequelize.DECIMAL(12, 2),
  },
  type: {
    type: Sequelize.ENUM("client", "contractor"),
  },
});

const mockProfiles = [
  {
    id: 1,
    firstName: "Harry",
    lastName: "Potter",
    profession: "Wizard",
    balance: 1150,
    type: "client",
  },
  {
    id: 2,
    firstName: "Mr",
    lastName: "Robot",
    profession: "Hacker",
    balance: 231.11,
    type: "client",
  },
  {
    id: 3,
    firstName: "John",
    lastName: "Snow",
    profession: "Knows nothing",
    balance: 451.3,
    type: "client",
  },
  {
    id: 4,
    firstName: "Ash",
    lastName: "Kethcum",
    profession: "Pokemon master",
    balance: 1.3,
    type: "client",
  },
  {
    id: 5,
    firstName: "John",
    lastName: "Lenon",
    profession: "Musician",
    balance: 64,
    type: "contractor",
  },
  {
    id: 6,
    firstName: "Linus",
    lastName: "Torvalds",
    profession: "Programmer",
    balance: 1214,
    type: "contractor",
  },
  {
    id: 7,
    firstName: "Alan",
    lastName: "Turing",
    profession: "Programmer",
    balance: 22,
    type: "contractor",
  },
  {
    id: 8,
    firstName: "Aragorn",
    lastName: "II Elessar Telcontarvalds",
    profession: "Fighter",
    balance: 314,
    type: "contractor",
  },
];

const fakeProfiles = [...mockProfiles];

fakeProfiles.forEach((fakeProfile) => {
  mockProfile.build(fakeProfile);
  fakeProfile.update = jest.fn((values, _options) => {
    const updatedProfile = { ...fakeProfile, ...values };
    fakeProfiles[fakeProfile.id - 1] = updatedProfile;

    return mockProfile.build(updatedProfile);
  });
});

mockProfile.findOne = jest.fn((query) => {
  const { where } = query;
  const profile = fakeProfiles.find((profile) => profile.id === where.id);
  return profile ? mockProfile.build(profile) : null;
});

mockProfile.update = jest.fn((values, query) => {
  const { where } = query;
  const profile = fakeProfiles.find((profile) => profile.id === where.id);
  if (!profile) return null;

  const updatedProfile = { ...profile, ...values };
  fakeProfiles[profile.id - 1] = updatedProfile;

  return mockProfile.build(updatedProfile);
});

export default mockProfile;
