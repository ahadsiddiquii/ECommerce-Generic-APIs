const utils = require("../../generic/modules/utils");
const pool = utils.mySqlPool;
const joi = utils.joi;

const cartSchemaValidation = joi.object({
  userId: joi.number().integer().required(),
  itemInCartCount: joi.number().integer().required(),
  cartItems: joi.array().items().required(),
});

const addToCartSchemaValidation = joi.object({
  userId: joi.number().integer().required(),
  productId: joi.number().integer().required(),
  quantity: joi.number().integer().required(),
});

async function createCartTable() {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.execute(`
        CREATE TABLE IF NOT EXISTS cart (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          itemInCartCount INT NOT NULL,
          cartItems JSON,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  } catch (error) {
    console.error("Error in managing cart table:", error);
  } finally {
    connection.release();
  }
}

module.exports = {
  cartSchemaValidation,
  addToCartSchemaValidation,
  createCartTable,
};
