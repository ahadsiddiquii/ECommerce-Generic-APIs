const utils = require("../../generic/modules/utils");
const { createCategoryTable } = require("./category");

var categoryTableName = "Category";

// Create a MySQL pool
const pool = utils.mySqlPool;

//Get Category By Category Id
async function getCategoryById(id) {
  const connection = await pool.getConnection();
  savedCategory = await utils.GetResourceService.getResourceById(
    categoryTableName,
    id,
    connection
  );

  connection.release();
  return savedCategory;
}

async function updateCategory(id, category, savedCategory) {
  const connection = await pool.getConnection();
  //Handle Image
  imageUpdated = null;
  if (category.categoryImage != null) {
    const imagePath =
      await utils.ImageService.convertBase64ImageAndSaveToStorage(
        category.categoryImage
      );

    if (imagePath != null) {
      //delete old image
      await utils.ImageService.deleteImage(savedCategory.categoryImage);
    }
    imageUpdated = imagePath != null ? imagePath : savedCategory.categoryImage;
  }
  // Update item
  const [results] = await connection.query(
    "UPDATE " +
      categoryTableName +
      " SET categoryName = ?, categoryImage = ? WHERE id = ?",
    [
      category.categoryName ?? savedCategory.categoryName,
      category.categoryImage != null
        ? imageUpdated
        : savedCategory.categoryImage,
      id,
    ]
  );

  connection.release();
  return {
    results,
    imageUpdated,
  };
}

// Delete category by id
async function deleteCategory(idToDelete) {
  const connection = await pool.getConnection();
  const [result] = await connection.query(
    "DELETE FROM " + categoryTableName + " WHERE id = ?",
    [idToDelete]
  );
  connection.release();
  return result;
}

module.exports = {
  getCategoryById,
  updateCategory,
  deleteCategory,
};
