import mockProfile from "../../domain/mocks/profileMock";

jest.mock("../../../src/domain/profile.model.js", () => ({
  Profile: mockProfile,
}));

import {
  getProfileService,
  clientHasBalance,
} from "../../../src/application/profile.service.js";

describe("Profile Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfileService", () => {
    it("should return a profile if it exists", async () => {
      const profileId = 1;
      const profile = await getProfileService(profileId);
      expect(profile).not.toBeNull();
      expect(profile.id).toBe(profileId);
    });

    it("should return null if the profile does not exist", async () => {
      const profileId = 999; // this ID doesn't exist in the mock
      const profile = await getProfileService(profileId);
      expect(profile).toBeNull();
    });
  });

  describe("clientHasBalance", () => {
    it("returns false if profile is not found", async () => {
      const result = await clientHasBalance(100, 100);

      expect(result).toBe(false);
    });

    it('returns false if profile type is not "client"', async () => {
      const result = await clientHasBalance(5, 100);

      expect(result).toBe(false);
    });

    it("returns true if profile balance is greater than or equal to the amount", async () => {
      const result = await clientHasBalance(3, 100);

      expect(result).toBe(true);
    });

    it("returns false if profile balance is less than the amount", async () => {
      const result = await clientHasBalance(4, 100);

      expect(result).toBe(false);
    });
  });
});
