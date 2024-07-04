const utils = require("../../generic/modules/utils");
const pool = utils.mySqlPool;
const joi = utils.joi;

const userSchemaValidation = joi.object({
  userName: joi.string().required(),
  userEmailOrPhone: joi.string().required(),
  password: joi.string().required(),
  roles: joi
    .array()
    .items(joi.string().valid("admin", "rider", "vendor", "user"))
    .required(),
});

const userLoginSchemaValidation = joi.object({
  userEmailOrPhone: joi.string().required(),
  password: joi.string().required(),
  roles: joi
    .array()
    .items(joi.string().valid("admin", "rider", "vendor", "user"))
    .required(),
});

async function createUserTable() {
  const connection = await pool.getConnection();

  try {
    const [rows, fields] = await connection.execute(`
        CREATE TABLE IF NOT EXISTS User (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userName VARCHAR(255) NOT NULL,
            userEmailOrPhone VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            roles JSON,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  } catch (error) {
    console.error("Error in managing user table:", error);
  } finally {
    connection.release();
  }
}

module.exports = {
  userSchemaValidation,
  userLoginSchemaValidation,
  createUserTable,
};
