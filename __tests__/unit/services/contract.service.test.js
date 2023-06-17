import { mockContract } from "../../domain/mocks/contractMock.js";

jest.mock("../../../src/domain/contract.model.js", () => ({
  Contract: mockContract,
}));

import {
  getContractByIdService,
  getAllContractsService,
} from "../../../src/application/contract.service.js";

describe("Contract Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getContractByIdService", () => {
    it("should return the contract if it exists", async () => {
      const contractId = 1;

      const profileMeta = {
        profileId: 1,
        type: "client",
      };

      const result = await getContractByIdService(contractId, profileMeta);

      expect(result).toEqual(
        expect.objectContaining({
          id: contractId,
          ClientId: 1,
        })
      );
    });

    it("should return null if the contract does not exist", async () => {
      const contractId = 1;
      const profileMeta = {
        profileId: 123,
        type: "client",
      };

      const result = await getContractByIdService(contractId, profileMeta);

      expect(result).toBeNull();
    });
  });

  describe("getAllContractsService", () => {
    it("should return an array of contracts if they exist", async () => {
      const profileMeta = {
        profileId: 2,
        type: "client",
      };

      const result = await getAllContractsService(profileMeta);

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 3,
            ClientId: 2,
            ContractorId: 6,
          }),
          expect.objectContaining({
            id: 4,
            ClientId: 2,
            ContractorId: 7,
          }),
        ])
      );
    });

    it("should return an empty array if no contracts exist", async () => {
      const profileMeta = {
        profileId: 123,
        type: "client",
      };

      const result = await getAllContractsService(profileMeta);

      expect(result).toEqual([]);
    });
  });
});
