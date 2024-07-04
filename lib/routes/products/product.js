const utils = require("../../generic/modules/utils");
const pool = utils.mySqlPool;
const joi = utils.joi;

const productSchemaValidation = joi.object({
  productName: joi.string().required(),
  productImage: joi.string().required(),
  productDescription: joi.string().required(),
  productQuantityInStock: joi.number().integer().required(),
  productPrice: joi.number().required(),
  itemTax: joi.number().required(),
  categoryId: joi.number().integer().required(),
  userId: joi.number().integer().required(),
  vendorId: joi.number().integer().required(),
});

const updateProductSchemaValidation = joi.object({
  productName: joi.string(),
  productImage: joi.string(),
  productDescription: joi.string(),
  productQuantityInStock: joi.number().integer(),
  productPrice: joi.number(),
  itemTax: joi.number(),
  categoryId: joi.number().integer(),
});

async function createProductTable() {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.execute(`
        CREATE TABLE IF NOT EXISTS product (
          id INT AUTO_INCREMENT PRIMARY KEY,
          productName VARCHAR(255) NOT NULL,
          productImage VARCHAR(255) NOT NULL,
          productDescription VARCHAR(255) NOT NULL,
          productQuantityInStock INT NOT NULL,
          productPrice FLOAT NOT NULL,
          itemTax FLOAT NOT NULL,
          categoryId INT NOT NULL,
          userId INT NOT NULL,
          vendorId INT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  } catch (error) {
    console.error("Error in managing product table:", error);
  } finally {
    connection.release();
  }
}

module.exports = {
  productSchemaValidation,
  updateProductSchemaValidation,
  createProductTable,
};
