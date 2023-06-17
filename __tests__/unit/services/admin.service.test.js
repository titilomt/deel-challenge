import { sequelize } from "../../../src/infra/db/orm/sequelize.js";

import {
  getProfessionWhoEarnedTheMost,
  getClientsWhoSpendTheMost,
} from "../../../src/application/admin.service.js";

describe("Admin Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfessionWhoEarnedTheMost", () => {
    it("should return the profession with the highest earnings within the specified date range", async () => {
      const start = "2023-01-01";
      const end = "2023-12-31";
      const limit = 1;

      const expectedResult = [
        {
          profession: "Software Engineer",
          totalEarned: 5000,
        },
      ];

      const mockQuery = jest.fn(() => Promise.resolve(expectedResult));
      sequelize.query = mockQuery;

      const result = await getProfessionWhoEarnedTheMost({ start, end, limit });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          replacements: {
            startDateTime: expect.any(Date),
            endDateTime: expect.any(Date),
            limit: expect.any(Number),
          },
          type: expect.anything(),
        })
      );

      expect(result).toEqual(expect.objectContaining(expectedResult[0]));
    });

    it("should return null if the start or end date is missing", async () => {
      const start = null;
      const end = "2023-12-31";
      const limit = 1;

      const result = await getProfessionWhoEarnedTheMost({ start, end, limit });

      expect(result).toBeNull();
    });
  });

  describe("getClientsWhoSpendTheMost", () => {
    it("should return the clients who spent the most within the specified date range", async () => {
      const start = "2023-01-01";
      const end = "2023-12-31";
      const limit = 2;

      const expectedQueryResult = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          totalSpent: 5000,
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Doe",
          totalSpent: 4000,
        },
      ];

      const expectedResult = [
        {
          id: 1,
          fullName: "John Doe",
          paid: 5000,
        },
        {
          id: 2,
          fullName: "Jane Doe",
          paid: 4000,
        },
      ];

      const mockQuery = jest.fn(() => Promise.resolve(expectedQueryResult));

      sequelize.query = mockQuery;

      const result = await getClientsWhoSpendTheMost({ start, end, limit });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          replacements: {
            startDateTime: expect.any(Date),
            endDateTime: expect.any(Date),
            limit: expect.any(Number),
          },
          type: expect.anything(),
        })
      );

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining(expectedResult[0]),
          expect.objectContaining(expectedResult[1]),
        ])
      );
    });

    it("should return null if the start or end date is missing", async () => {
      const start = null;
      const end = "2023-12-31";
      const limit = 2;

      const result = await getClientsWhoSpendTheMost({ start, end, limit });

      expect(result).toBeNull();
    });
  });
});
