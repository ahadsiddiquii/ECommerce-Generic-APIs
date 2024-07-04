const utils = require("../../generic/modules/utils");
const { categorySchemaValidation, createCategoryTable } = require("./category");
const CategoryDatabase = require("./category_database");

var category = utils.express.Router();

var categoryTableName = "Category";
const responseHandler = new utils.ResponseHandler();

category.use(utils.bodyParser.json());

// Create a MySQL pool
const pool = utils.mySqlPool;

//Add Category
category.post("/", async (req, res) => {
  try {
    // Validate request body
    const { error } = categorySchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    await createCategoryTable();

    //Handle Image
    const imagePath =
      await utils.ImageService.convertBase64ImageAndSaveToStorage(
        req.body.categoryImage
      );
    // Create new item
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "INSERT INTO " +
        categoryTableName +
        "(categoryName, categoryImage) VALUES (?, ?)",
      [req.body.categoryName, imagePath]
    );
    connection.release();

    const postData = {
      id: results.insertId,
      categoryName: req.body.categoryName,
      categoryImage: imagePath,
    };
    responseHandler
      .setSuccess(true)
      .setMessage("Category Added")
      .setData(postData);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage)
      .setData(null);
  }

  responseHandler.getResponse(res);
});

//Get All Categories
category.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      "SELECT * FROM " + categoryTableName
    );
    connection.release();

    responseHandler
      .setSuccess(true)
      .setMessage("All Categories Retrieved")
      .setData(results);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage)
      .setData(null);
  }
  responseHandler.getResponse(res);
});

// Update Category
category.put("/:id", async (req, res) => {
  try {
    categoryId = parseInt(req.params.id);
    // Validate request body
    const { error } = categorySchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    savedCategory = await CategoryDatabase.getCategoryById(categoryId);
    if (savedCategory === null) {
      return res.status(404).json({ error: "Category not found" });
    } else {
      updatedResult = await CategoryDatabase.updateCategory(
        categoryId,
        req.body,
        savedCategory
      );

      if (updatedResult.results.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      const postData = {
        id: categoryId,
        categoryName: req.body.categoryName ?? savedCategory.categoryName,
        categoryImage:
          req.body.categoryImage != null
            ? updatedResult.imageUpdated
            : savedCategory.categoryImage,
      };

      responseHandler
        .setSuccess(true)
        .setMessage("Category Updated")
        .setData(postData);
    }
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage)
      .setData(null);
  }
  responseHandler.getResponse(res);
});

// DELETE endpoint to delete a category by ID
category.delete("/:id", async (req, res) => {
  try {
    const idToDelete = parseInt(req.params.id, 10);

    result = await CategoryDatabase.deleteCategory(idToDelete);

    // Check if a row was affected
    if (result.affectedRows === 0) {
      responseHandler
        .setSuccess(false)
        .setMessage("Category not found")
        .setData(null);
    } else {
      responseHandler
        .setSuccess(true)
        .setMessage("Category deleted")
        .setData(null);
    }
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage)
      .setData(null);
  }
  responseHandler.getResponse(res);
});

module.exports.category = category;
