import { Op } from "sequelize";

import { Contract } from "../domain/model.js";

/**
 * Get contract by id and profileId
 *
 * @param {*} id
 * @param {*} profileId
 * @returns {Promise<import("../domain/model.js").Contract>}
 */
const getContractByIdService = async (id, profileMeta = {}) => {
  const { profileId, type } = profileMeta;

  const query = {
    id,
    ClientId: profileId,
  };

  if (type !== "client") {
    query["ContractorId"] = profileId;
    delete query.ClientId;
  }

  const contract = await Contract.findOne({
    where: query,
  });

  if (!contract) return null;

  return contract.toJSON();
};

const getAllContractsService = async (profileMeta = {}) => {
  const { profileId, type } = profileMeta;

  const query = {
    ClientId: profileId,
    status: {
      [Op.not]: "terminated",
    },
  };

  if (type !== "client") {
    query["ContractorId"] = profileId;
    delete query.ClientId;
  }

  const contracts = await Contract.findAll({
    where: query,
  });

  if (!contracts) return null;

  return contracts.map((contract) => contract.toJSON());
};

export { getContractByIdService, getAllContractsService };
