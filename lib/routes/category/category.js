const utils = require("../../generic/modules/utils");
const pool = utils.mySqlPool;
const joi = utils.joi;

const categorySchemaValidation = joi.object({
  categoryName: joi.string(),
  categoryImage: joi.string(),
});

async function createCategoryTable() {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.execute(`
        CREATE TABLE IF NOT EXISTS category (
          id INT AUTO_INCREMENT PRIMARY KEY,
          categoryName VARCHAR(255) NOT NULL,
          categoryImage VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  } catch (error) {
    console.error("Error in managing category table:", error);
  } finally {
    connection.release();
  }
}

module.exports = {
  categorySchemaValidation,
  createCategoryTable,
};
