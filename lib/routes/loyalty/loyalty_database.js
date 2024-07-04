const utils = require("../../generic/modules/utils");
const { createLoyaltyTable } = require("./loyalty");

var loyaltyTableName = "Loyalty";

// Create a MySQL pool
const pool = utils.mySqlPool;

async function postLoyalty(loyaltyData) {
  await createLoyaltyTable();
  const connection = await pool.getConnection();
  const [results] = await connection.query(
    "INSERT INTO " + loyaltyTableName + "(userId, loyaltyPoints) VALUES (?, ?)",
    [loyaltyData.userId, loyaltyData.loyaltyPoints]
  );
  connection.release();
  return results;
}

async function getUserLoyaltyPoints(userId) {
  const connection = await pool.getConnection();
  const [results] = await connection.execute(
    "SELECT * FROM " + loyaltyTableName + " WHERE userId = ?",
    [userId]
  );
  connection.release();
  return results;
}

async function updateUserLoyaltyPoints(id, quantityToUpdate) {
  const connection = await pool.getConnection();

  savedLoyaltyData = await utils.GetResourceService.getResourceById(
    loyaltyTableName,
    id,
    connection
  );

  newQuantity = savedLoyaltyData.loyaltyPoints + quantityToUpdate;

  const [results] = await connection.query(
    "UPDATE " + loyaltyTableName + " SET loyaltyPoints = ?  WHERE id = ?",
    [newQuantity, loyaltyId]
  );
  connection.release();
  return results;
}

module.exports = {
  postLoyalty,
  getUserLoyaltyPoints,
  updateUserLoyaltyPoints,
};
