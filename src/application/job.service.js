import { sequelize } from "../infra/db/orm/sequelize.js";

import { Job, Contract } from "../domain/index.js";

import { clientTransaction } from "./profile.service.js";

const getAllUnpaidJobsService = async (profileMeta = {}) => {
  const { profileId, type } = profileMeta;
  const queryContract = {
    status: "in_progress",
  };

  if (type !== "client") {
    queryContract["ContractorId"] = profileId;
  } else {
    queryContract["ClientId"] = profileId;
  }

  const jobs = await Job.findAll({
    include: [
      {
        model: Contract,
        attibutes: ["id", "status", "ContractorId", "ClientId"],
        where: queryContract,
      },
    ],
    where: {
      paid: null,
    },
  });

  if (!jobs) return null;

  return jobs.map((job) => job.toJSON());
};

const postPaymentJobService = async (id, profileMeta = {}) => {
  const { profileId, type } = profileMeta;

  if (type !== "client") return null;

  const transaction = await sequelize.transaction();

  try {
    const job = await Job.findOne({
      include: [
        {
          model: Contract,
          attributes: ["id", "status", "ContractorId", "ClientId"],
          where: {
            status: "in_progress",
            ClientId: profileId,
          },
        },
      ],
      where: {
        id,
        paid: null,
      },
      transaction,
    });

    if (!job) return null;

    const transactionResponse = await clientTransaction(
      job.Contract.ClientId,
      job.Contract.ContractorId,
      job.price,
      transaction
    );

    if (!transactionResponse) return null;

    await job.update({ paid: true }, { transaction });

    await transaction.commit();

    return "Payment successful";
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    throw error;
  }
};

export { getAllUnpaidJobsService, postPaymentJobService };
