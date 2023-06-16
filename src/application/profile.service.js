import { Profile } from "../domain/model.js";

const getProfileService = async (profileId) => {
  const profile =
    (await Profile.findOne({
      where: { id: profileId },
    })) || null;

  return profile;
};

const clientHasBalance = async (profileId, amount) => {
  const profile = await getProfileService(profileId);

  if (!profile) return false;
  if (profile.type !== "client") return false;

  return profile.balance >= amount;
};

const clientTransaction = async (
  clientId,
  contractorId,
  amount,
  transaction
) => {
  const client = await Profile.findOne({
    where: { id: clientId },
    transaction,
  });

  const contractor = await Profile.findOne({
    where: { id: contractorId },
    transaction,
  });

  if (!client || !contractor) return false;
  if (client.type !== "client") return false;
  if (contractor.type !== "contractor") return false;

  const newClientBalance = client.balance - amount;
  const newContractorBalance = contractor.balance + amount;

  await client.update({ balance: newClientBalance }, { transaction });
  await contractor.update({ balance: newContractorBalance }, { transaction });

  return true;
};

export { getProfileService, clientHasBalance, clientTransaction };
