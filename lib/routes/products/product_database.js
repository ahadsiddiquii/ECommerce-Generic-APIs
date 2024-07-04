const utils = require("../../generic/modules/utils");
const { createProductTable } = require("./product");

var productTableName = "Product";

// Create a MySQL pool
const pool = utils.mySqlPool;

async function postProduct(product) {
  await createProductTable();
  //Handle Image
  const imagePath = await utils.ImageService.convertBase64ImageAndSaveToStorage(
    product.productImage
  );
  const connection = await pool.getConnection();
  const [results] = await connection.query(
    "INSERT INTO " +
      productTableName +
      "(productName, productImage, productDescription, productQuantityInStock, productPrice, itemTax, categoryId, userId, vendorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      product.productName,
      imagePath,
      product.productDescription,
      product.productQuantityInStock,
      product.productPrice,
      product.itemTax,
      product.categoryId,
      product.userId,
      product.vendorId,
    ]
  );
  connection.release();
  return results;
}

async function getAllProducts() {
  const connection = await pool.getConnection();
  const [results] = await connection.query("SELECT * FROM " + productTableName);
  connection.release();
  return [results];
}

async function getAllProductsByCategoryId(categoryId) {
  const connection = await pool.getConnection();
  const [results] = await connection.query(
    "SELECT * FROM " + productTableName + " WHERE categoryId = ?",
    [categoryId]
  );
  connection.release();
  return [results];
}

async function getProductById(id) {
  const connection = await pool.getConnection();
  savedProduct = await utils.GetResourceService.getResourceById(
    productTableName,
    id,
    connection
  );
  connection.release();
  return savedProduct;
}

async function updateProduct(id, product, savedProduct) {
  const connection = await pool.getConnection();
  //Handle Image
  imageUpdated = null;
  if (product.storeImage != null) {
    const imagePath =
      await utils.ImageService.convertBase64ImageAndSaveToStorage(
        product.productImage
      );

    if (imagePath != null) {
      //delete old image
      await utils.ImageService.deleteImage(savedProduct.productImage);
    }
    imageUpdated = imagePath != null ? imagePath : savedProduct.productImage;
  }
  // Update item

  const [results] = await connection.query(
    "UPDATE " +
      productTableName +
      " SET productName = ?, productImage = ? , productDescription = ? ,productQuantityInStock = ? ,productPrice = ? ,itemTax = ?, categoryId = ?   WHERE id = ?",
    [
      product.productName ?? savedProduct.productName,
      product.productImage != null ? imageUpdated : savedProduct.productImage,
      product.productDescription ?? savedProduct.productDescription,
      product.productQuantityInStock ?? savedProduct.productQuantityInStock,
      product.productPrice ?? savedProduct.productPrice,
      product.itemTax ?? savedProduct.itemTax,
      product.categoryId ?? savedProduct.categoryId,
      id,
    ]
  );
  connection.release();
  return {
    results,
    imageUpdated,
  };
}

async function updateProductQuantityInStock(
  id,
  quantityToRemove,
  savedProduct
) {
  const connection = await pool.getConnection();

  newQuantity = savedProduct.productQuantityInStock - quantityToRemove;

  const [results] = await connection.query(
    "UPDATE " +
      productTableName +
      " SET productQuantityInStock = ?  WHERE id = ?",
    [newQuantity, id]
  );
  connection.release();
  return results;
}

async function deleteProduct(idToDelete) {
  const connection = await pool.getConnection();
  const [result] = await connection.query(
    "DELETE FROM " + productTableName + " WHERE id = ?",
    [idToDelete]
  );
  connection.release();
  return result;
}

module.exports = {
  postProduct,
  getAllProducts,
  getAllProductsByCategoryId,
  getProductById,
  updateProduct,
  updateProductQuantityInStock,
  deleteProduct,
};
