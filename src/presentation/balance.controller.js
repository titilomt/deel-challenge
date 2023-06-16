import { postDepositService } from "../application/index.js";

const postDepositController = async (req, res) => {
  const { id: profileId } = req.profile;

  const { userId } = req.params;

  const { amount } = req.body;

  try {
    if (profileId !== parseInt(userId)) return res.status(401).end();

    const depositMessage = await postDepositService(userId, amount);

    if (!depositMessage) return res.status(404).end();

    return res.status(200).send(depositMessage);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

export { postDepositController };
