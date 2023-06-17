import { Sequelize } from "sequelize";

import { seed } from "../../scripts/seeder.js";

import request from "supertest";

import server from "../../src/main/main.js";

import dbConfig from "./test-db.config.js";

const sequelize = new Sequelize(dbConfig);
sequelize.options.logging = false;

async function seedDatabase() {
  try {
    await seed();
    console.log("Seed executed successfully");
  } catch (error) {
    console.error("Error executing seed:", error);
  }
}

beforeAll(async () => {
  // Connect to the test database

  await seedDatabase();
});
afterAll(async () => {
  // Close the database connection
  await sequelize.close();
});
describe("API endpoints", () => {
  describe("Hello API endpoints", () => {
    it("should say Hello", async () => {
      const res = await request(server).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Hello, World!");
    });
  });

  describe("Admin API endpoints", () => {
    it("should return the profession with the highest earnings within the specified date range", async () => {
      const start = "2020-08-15T19:11:26.737Z";
      const end = "2020-08-17T19:11:26.737Z";
      const limit = 1;

      const expectedResult = [
        {
          profession: "Programmer",
          totalEarned: 2562,
        },
      ];

      const res = await request(server)
        .get(`/admin/best-professions?start=${start}&end=${end}&limit=${limit}`)
        .set("profile_id", 1);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(expectedResult[0]));
    });

    it("should return the clients who paid the most for jobs within the specified date range", async () => {
      const start = "2020-08-15T19:11:26.737Z";
      const end = "2020-08-17T19:11:26.737Z";
      const limit = 2;

      const expectedResult = [
        { fullName: "Ash Kethcum", id: 4, paid: 2020 },
        { fullName: "Mr Robot", id: 2, paid: 321 },
      ];

      const res = await request(server)
        .get(`/admin/best-clients?start=${start}&end=${end}&limit=${limit}`)
        .set("profile_id", 1);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining(expectedResult));
    });
  });

  describe("Contractor API endpoints", () => {
    it("should return all contracts for this profile", async () => {
      const expectedResult = [
        {
          id: 2,
          ClientId: 1,
          ContractorId: 6,
          status: "in_progress",
          terms: "bla bla bla",
        },
      ];

      const res = await request(server).get("/contracts").set("profile_id", 1);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([expect.objectContaining(expectedResult[0])])
      );
    });

    it("should return a contract by id", async () => {
      const expectedResult = {
        id: 2,
        ClientId: 1,
        ContractorId: 6,
        status: "in_progress",
        terms: "bla bla bla",
      };

      const res = await request(server)
        .get("/contracts/2")
        .set("profile_id", 1);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(expectedResult));
    });
  });

  describe("Job API endpoints", () => {
    it("should return all unpaid jobs for this profile", async () => {
      const expectedResult = [
        {
          id: 3,
          paid: null,
          price: 202,
        },
        {
          ContractId: 4,
          id: 4,
        },
      ];

      const res = await request(server)
        .get("/jobs/unpaid")
        .set("profile_id", 2);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining(expectedResult[0]),
          expect.objectContaining(expectedResult[1]),
        ])
      );
    });

    it("should return a message if the job was paid", async () => {
      const res = await request(server)
        .post("/jobs/2/pay")
        .set("profile_id", 1);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: "Payment successful" });
    });
  });

  describe("Balance API endpoints", () => {
    it("should return if the amount was successefully deposited", async () => {
      const res = await request(server)
        .post("/balances/deposit/4")
        .send({ amount: 25 })
        .set("profile_id", 4);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: "Deposit successful" });
    });
  });

  describe("Not Found", () => {
    it("should return 404 on non-existent routes", async () => {
      const res = await request(server).get("/non-existent-route");
      expect(res.statusCode).toBe(404);
    });
  });
});
