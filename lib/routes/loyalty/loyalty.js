const utils = require("../../generic/modules/utils");
const pool = utils.mySqlPool;
const joi = utils.joi;

const loyaltySchemaValidation = joi.object({
  userId: joi.number().integer().required(),
  loyaltyPoints: joi.number().integer().required(),
});

const loyaltyPointsUpdateSchemaValidation = joi.object({
  userId: joi.number().integer().required(),
  loyaltyPointsToUpdate: joi.number().integer().required(),
});

async function createLoyaltyTable() {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.execute(`
        CREATE TABLE IF NOT EXISTS loyalty (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          loyaltyPoints INT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  } catch (error) {
    console.error("Error in managing loyalty table:", error);
  } finally {
    connection.release();
  }
}

module.exports = {
  loyaltySchemaValidation,
  loyaltyPointsUpdateSchemaValidation,
  createLoyaltyTable,
};
