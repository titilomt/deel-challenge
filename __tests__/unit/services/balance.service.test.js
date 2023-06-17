import mockProfile from "../../domain/mocks/profileMock";
import mockJob from "../../domain/mocks/jobMock";

jest.mock("../../../src/domain/profile.model", () => ({
  Profile: mockProfile,
}));

jest.mock("../../../src/domain/job.model", () => ({
  Job: mockJob,
}));

import { postDepositService } from "../../../src/application/balance.service";

describe("Balance Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("postDepositService", () => {
    it("should return 'Deposit successful' if deposit is successful", async () => {
      const clientId = 4;
      const amount = 2;

      const result = await postDepositService(clientId, amount);

      expect(result).toBe("Deposit successful");
    });

    it("should return 'Only clients can have deposit' if the profile type is not 'client'", async () => {
      const clientId = 5;
      const amount = 100;

      const result = await postDepositService(clientId, amount);

      expect(result).toBe("Only clients can have deposit");
    });

    it("should return 'Deposit amount must be greater than 0' if the amount is not greater than 0", async () => {
      const clientId = 4;
      const amount = 0;

      const result = await postDepositService(clientId, amount);

      expect(result).toBe("Deposit amount must be greater than 0");
    });

    it("should return 'Deposit amount is too high' if the amount exceeds the maximum deposit", async () => {
      const clientId = 4;
      const amount = 10000;

      const result = await postDepositService(clientId, amount);

      expect(result).toBe("Deposit amount is too high");
    });

    it("should return null if the profile does not exist", async () => {
      const clientId = 123;
      const amount = 100;

      const result = await postDepositService(clientId, amount);

      expect(result).toBeNull();
    });
  });
});
