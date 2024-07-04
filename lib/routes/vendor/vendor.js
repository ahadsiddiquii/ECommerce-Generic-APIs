const utils = require("../../generic/modules/utils");
const pool = utils.mySqlPool;
const joi = utils.joi;

const vendorSchemaValidation = joi.object({
  userId: joi.number().required(),
  storeName: joi.string().required(),
  storeImage: joi.string().required(),
  storeDescription: joi.string().required(),
  storePhone: joi.string().required(),
  storeEmail: joi.string().required(),
});

const vendorUpdateByVendorSchemaValidation = joi.object({
  storeName: joi.string(),
  storeImage: joi.string(),
  storeDescription: joi.string(),
  storePhone: joi.string(),
  storeEmail: joi.string(),
});

async function createVendorTable() {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.execute(`
        CREATE TABLE IF NOT EXISTS Vendor (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId INT UNIQUE NOT NULL,
            storeName VARCHAR(255) NOT NULL,
            storeImage VARCHAR(255) NOT NULL,
            storeDescription VARCHAR(255) NOT NULL,
            storePhone VARCHAR(255) NOT NULL,
            storeEmail VARCHAR(255) UNIQUE NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  } catch (error) {
    console.error("Error in managing vendor table:", error);
  } finally {
    connection.release();
  }
}

module.exports = {
  vendorSchemaValidation,
  vendorUpdateByVendorSchemaValidation,
  createVendorTable,
};
