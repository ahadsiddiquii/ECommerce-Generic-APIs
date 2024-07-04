const utils = require("../../generic/modules/utils");
const { createVendorTable } = require("./vendor");

var vendorTableName = "Vendor";

// Create a MySQL pool
const pool = utils.mySqlPool;

async function getVendorFormatting(vendor) {
  return {
    id: vendor.id,
    storeName: vendor.storeName,
    storeImage: vendor.storeImage,
    storeDescription: vendor.storeDescription,
    storePhone: vendor.storePhone,
    storeEmail: vendor.storeEmail,
    user: {
      id: vendor.userId,
      userName: vendor.userName,
      userEmailOrPhone: vendor.userEmailOrPhone,
    },
  };
}

async function postVendor(vendor) {
  await createVendorTable();
  const connection = await pool.getConnection();

  const [results] = await connection.query(
    "INSERT INTO " +
      vendorTableName +
      "(userId, storeName, storeImage, storeDescription, storePhone, storeEmail) VALUES (?, ?, ?, ?, ?, ?)",
    [
      vendor.userId,
      vendor.storeName,
      vendor.storeImage,
      vendor.storeDescription,
      vendor.storePhone,
      vendor.storeEmail,
    ]
  );
  connection.release();
  return results;
}

async function getVendorById(id) {
  const connection = await pool.getConnection();
  savedVendor = await utils.GetResourceService.getResourceById(
    vendorTableName,
    id,
    connection
  );
  connection.release();
  return savedVendor;
}

async function updateVendor(id, vendor, savedVendor) {
  const connection = await pool.getConnection();
  imageUpdated = null;
  if (vendor.storeImage != null) {
    //Handle Image
    const imagePath =
      await utils.ImageService.convertBase64ImageAndSaveToStorage(
        vendor.storeImage
      );

    if (imagePath != null) {
      //delete old image
      await utils.ImageService.deleteImage(savedVendor.storeImage);
    }
    imageUpdated = imagePath != null ? imagePath : savedVendor.storeImage;
  }

  // Update item

  const [results] = await connection.query(
    "UPDATE " +
      vendorTableName +
      " SET storeName = ?, storeImage = ? , storeDescription = ? , storePhone = ?, storeEmail = ? WHERE id = ?",
    [
      vendor.storeName ?? savedVendor.storeName,
      vendor.storeImage != null ? imageUpdated : savedVendor.storeImage,
      vendor.storeDescription ?? savedVendor.storeDescription,
      vendor.storePhone ?? savedVendor.storePhone,
      vendor.storeEmail ?? savedVendor.storeEmail,
      id,
    ]
  );
  connection.release();
  return {
    results,
    imageUpdated,
  };
}

async function getAllVendorsWithUserData() {
  const connection = await pool.getConnection();
  const [result] = await connection.query(
    "SELECT vendor.*, user.id AS userId, user.userName, user.userEmailOrPhone FROM vendor JOIN user ON vendor.userId = user.Id;"
  );
  connection.release();
  return [result];
}

async function getVendorsWithUserDataByVendorId(id) {
  const connection = await pool.getConnection();
  const [result] = await connection.query(
    "SELECT vendor.*, user.id AS userId, user.userName, user.userEmailOrPhone FROM vendor JOIN user ON vendor.userId = user.Id WHERE vendor.id = ?",
    [id]
  );
  connection.release();
  return result;
}

async function deleteVendor(idToDelete) {
  const connection = await pool.getConnection();
  const [result] = await connection.query(
    "DELETE FROM " + vendorTableName + " WHERE id = ?",
    [idToDelete]
  );
  connection.release();
  return result;
}

module.exports = {
  getVendorFormatting,
  postVendor,
  getVendorById,
  updateVendor,
  getAllVendorsWithUserData,
  getVendorsWithUserDataByVendorId,
  deleteVendor,
};
