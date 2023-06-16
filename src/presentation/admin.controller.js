import {
  getProfessionWhoEarnedTheMost,
  getClientsWhoSpendTheMost,
} from "../application/index.js";

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  try {
    const bestProfession = await getProfessionWhoEarnedTheMost({ start, end });

    if (!bestProfession) return res.status(404).end();

    return res.status(200).send(bestProfession);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

const getBestClients = async (req, res) => {
  const { start, end, limit } = req.query;

  try {
    const bestClients = await getClientsWhoSpendTheMost({
      start,
      end,
      limit,
    });

    if (!bestClients) return res.status(404).end();

    return res.status(200).send(bestClients);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

export { getBestProfession, getBestClients };
