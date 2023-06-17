import mockJob from "../../domain/mocks/jobMock.js";
import mockProfile from "../../domain/mocks/profileMock.js";

jest.mock("../../../src/domain/job.model.js", () => ({
  Job: mockJob,
}));
jest.mock("../../../src/domain/profile.model.js", () => ({
  Profile: mockProfile,
}));

import {
  getAllUnpaidJobsService,
  postPaymentJobService,
} from "../../../src/application/job.service.js";

describe("Job Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUnpaidJobsService", () => {
    it("should return an array of unpaid jobs if they exist", async () => {
      const profileMeta = {
        profileId: 1,
        type: "client",
      };

      const result = await getAllUnpaidJobsService(profileMeta);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 2,
            price: 201,
            ContractId: 2,
          }),
        ])
      );
    });

    it("should return an empty array if no unpaid jobs exist", async () => {
      const profileMeta = {
        profileId: 5,
        type: "contractor",
      };

      const result = await getAllUnpaidJobsService(profileMeta);

      expect(result).toEqual([]);
    });
  });

  describe("postPaymentJobService", () => {
    it("should return 'Payment successful' if payment is successful", async () => {
      const jobId = 2;
      const profileMeta = {
        profileId: 2,
        type: "client",
      };

      const result = await postPaymentJobService(jobId, profileMeta);

      expect(result).toBe("Payment successful");
    });

    it("should return null if the job does not exist", async () => {
      const jobId = 100;
      const profileMeta = {
        profileId: 123,
        type: "client",
      };

      const result = await postPaymentJobService(jobId, profileMeta);

      expect(result).toBeNull();
    });

    it("should return null if the transaction fails", async () => {
      const jobId = 5;
      const profileMeta = {
        profileId: 4,
        type: "client",
      };

      const result = await postPaymentJobService(jobId, profileMeta);

      expect(result).toBeNull();
    });
  });
});
