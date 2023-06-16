import { getProfileService } from "./profile.service.js";
import { getAllUnpaidJobsService } from "./job.service.js";

/**
 * Deposits money into the the the balance of a client,
 * a client can't deposit more than 25%
 * his total of jobs to pay.
 * (at the deposit moment)
 */
const postDepositService = async (clientId, amount) => {
  const profile = await getProfileService(clientId);

  if (!profile) return null;

  if (profile.type !== "client") return "Only clients can have deposit";

  if (amount <= 0) return "Deposit amount must be greater than 0";

  const jobsToPay = await getAllUnpaidJobsService({
    profileId: clientId,
    type: "client",
  });

  const jobsUnpaidCost = jobsToPay.reduce((acc, job) => {
    return acc + job.price;
  }, 0);

  const maxDeposit = jobsUnpaidCost * 0.25;

  if (amount > maxDeposit) return "Deposit amount is too high";

  const newBalance = profile.balance + amount;

  await profile.update({ balance: newBalance });

  return "Deposit successful";
};

export { postDepositService };
