import {
  getContractByIdService,
  getAllContractsService,
} from "../application/index.js";

/**
 * Get contract by id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
const getContractById = async (req, res) => {
  const { id: profileId, type } = req.profile;
  const { id } = req.params;

  try {
    const contract = await getContractByIdService(parseInt(id), {
      profileId,
      type,
    });

    if (!contract) return res.status(404).end();

    return res.status(200).send(contract);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

const getAllContracts = async (req, res) => {
  const { id: profileId, type } = req.profile;

  try {
    const contracts = await getAllContractsService({ profileId, type });

    if (!contracts) return res.status(404).end();

    return res.status(200).send(contracts);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

export { getContractById, getAllContracts };
