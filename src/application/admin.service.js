import { sequelize } from "../infra/db/orm/sequelize.js";

/**
 * Returns the profession that earned the most money
 * (sum of jobs paid)
 * for any contactor that worked in the query time range.
 */
const getProfessionWhoEarnedTheMost = async ({ start, end, limit } = {}) => {
  if (!start || !end) return null;

  const startDateTime = new Date(start);
  const endDateTime = new Date(end);

  const query = `
    SELECT Profile.profession, SUM(Job.price) AS totalEarned
    FROM Profiles AS Profile
    INNER JOIN Contracts AS Contract ON Profile.id = Contract.ContractorId
    INNER JOIN Jobs AS Job ON Contract.id = Job.ContractId
    WHERE Job.paymentDate BETWEEN DATE(:startDateTime) AND DATE(:endDateTime)
    GROUP BY Profile.profession
    ORDER BY totalEarned DESC
    LIMIT :limit;
    `;
  const replacements = {
    startDateTime,
    endDateTime,
    limit: limit || 1,
  };

  const [result] = await sequelize.query(query, {
    replacements,
    type: sequelize.QueryTypes.SELECT,
  });

  if (!result) return null;

  return result;
};

/**
 * returns the clients the paid the most for
 * jobs in the query time period.
 * limit query parameter should be applied, default limit is 2.
 */
const getClientsWhoSpendTheMost = async ({ start, end, limit } = {}) => {
  if (!start || !end) return null;

  const startDateTime = new Date(start);
  const endDateTime = new Date(end);

  const query = `
    SELECT Profile.id, Profile.firstName, Profile.lastName, SUM(Job.price) AS totalSpent
    FROM Profiles AS Profile
    INNER JOIN Contracts AS Contract ON Profile.id = Contract.ClientId
    INNER JOIN Jobs AS Job ON Contract.id = Job.ContractId
    WHERE Job.paymentDate BETWEEN DATE(:startDateTime) AND DATE(:endDateTime)
    GROUP BY Profile.firstName, Profile.lastName
    ORDER BY totalSpent DESC
    LIMIT :limit;
    `;

  const replacements = {
    startDateTime,
    endDateTime,
    limit: limit || 2,
  };

  const result = await sequelize.query(query, {
    replacements,
    type: sequelize.QueryTypes.SELECT,
  });

  if (!result?.length) return null;

  return result.map((client) => ({
    id: client.id,
    fullName: `${client.firstName} ${client.lastName}`,
    paid: client.totalSpent,
  }));
};

export { getProfessionWhoEarnedTheMost, getClientsWhoSpendTheMost };
