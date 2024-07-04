const utils = require("../../generic/modules/utils");
const {
  productSchemaValidation,
  updateProductSchemaValidation,
} = require("./product");
const ProductDatabase = require("./product_database");
const CategoryDatabase = require("../category/category_database");
const UserDatabase = require("../users/user_database");
const VendorDatabase = require("../vendor/vendor_database");

var product = utils.express.Router();

const responseHandler = new utils.ResponseHandler();

product.use(utils.bodyParser.json());

//Add Product
product.post("/", async (req, res) => {
  try {
    // Validate request body
    const { error } = productSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Create new item
    await ProductDatabase.postProduct(req.body);

    responseHandler.setSuccess(true).setMessage("Product Added").setData(null);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage)
      .setData(null);
  }

  responseHandler.getResponse(res);
});

//Get All Products
product.get("/", async (req, res) => {
  try {
    const [results] = await ProductDatabase.getAllProducts();

    responseHandler
      .setSuccess(true)
      .setMessage("All Products Retrieved")
      .setData(results);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }
  responseHandler.getResponse(res);
});

//Get All Products By Category
product.get("/product-by-category", async (req, res) => {
  try {
    const categoryId = parseInt(req.query.categoryId);
    const [results] = await ProductDatabase.getAllProductsByCategoryId(
      categoryId
    );

    responseHandler
      .setSuccess(true)
      .setMessage("Products Retrieved")
      .setData(results);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }
  responseHandler.getResponse(res);
});

product.get("/product-by-id", async (req, res) => {
  try {
    const productId = parseInt(req.query.id);
    const savedProduct = await ProductDatabase.getProductById(productId);
    const savedVendor = await VendorDatabase.getVendorsWithUserDataByVendorId(
      savedProduct.vendorId
    );
    const savedCategory = await CategoryDatabase.getCategoryById(
      savedProduct.categoryId
    );

    const vendorData = await VendorDatabase.getVendorFormatting(savedVendor[0]);

    const postData = {
      id: productId,
      productName: savedProduct.productName,
      productImage: savedProduct.productImage,
      productDescription: savedProduct.productDescription,
      productQuantityInStock: savedProduct.productQuantityInStock,
      productPrice: savedProduct.productPrice,
      itemTax: savedProduct.itemTax,
      vendor: vendorData,
      category: savedCategory,
    };

    responseHandler
      .setSuccess(true)
      .setMessage("Products Retrieved")
      .setData(postData);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }
  responseHandler.getResponse(res);
});

// Update Product
product.put("/:id", async (req, res) => {
  try {
    productId = parseInt(req.params.id);
    // Validate request body
    const { error } = updateProductSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    savedProduct = await ProductDatabase.getProductById(productId);
    if (savedProduct === null) {
      return res.status(404).json({ error: "Product not found" });
    } else {
      updatedResult = await ProductDatabase.updateProduct(
        productId,
        req.body,
        savedProduct
      );

      if (updatedResult.results.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      savedVendor = await VendorDatabase.getVendorsWithUserDataByVendorId(
        savedProduct.vendorId
      );
      savedCategory = await CategoryDatabase.getCategoryById(
        req.body.categoryId ?? savedProduct.categoryId
      );

      const vendorData = await VendorDatabase.getVendorFormatting(
        savedVendor[0]
      );

      const postData = {
        id: productId,
        productName: req.body.productName ?? savedProduct.productName,
        productImage:  updatedResult.imageUpdated ?? savedProduct.productImage,
        productDescription:
          req.body.productDescription ?? savedProduct.productDescription,
        productQuantityInStock:
          req.body.productQuantityInStock ??
          savedProduct.productQuantityInStock,
        productPrice: req.body.productPrice ?? savedProduct.productPrice,
        itemTax: req.body.itemTax ?? savedProduct.itemTax,
        vendor: vendorData,
        category: savedCategory,
      };

      responseHandler
        .setSuccess(true)
        .setMessage("Product Updated")
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

// DELETE endpoint to delete a product by ID
product.delete("/:id", async (req, res) => {
  try {
    const idToDelete = parseInt(req.params.id, 10);

    result = await ProductDatabase.deleteProduct(idToDelete);

    // Check if a row was affected
    if (result.affectedRows === 0) {
      responseHandler
        .setSuccess(false)
        .setMessage("Product not found")
        .setData(null);
    } else {
      responseHandler
        .setSuccess(true)
        .setMessage("Product deleted")
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

module.exports.product = product;
