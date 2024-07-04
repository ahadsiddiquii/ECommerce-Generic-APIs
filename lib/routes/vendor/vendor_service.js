const utils = require("../../generic/modules/utils");
const {
  vendorSchemaValidation,
  vendorUpdateByVendorSchemaValidation,
} = require("./vendor");
const VendorDatabase = require("./vendor_database");
const UserDatabase = require("../users/user_database");
const pool = utils.mySqlPool;
var vendor = utils.express.Router();

const responseHandler = new utils.ResponseHandler();

vendor.use(utils.bodyParser.json());

//Get All Vendors
vendor.get("/", async (req, res) => {
  try {
    const [results] = await VendorDatabase.getAllVendorsWithUserData();
    postData = [];
    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        vendorData = await VendorDatabase.getVendorFormatting(results[i]);
        postData.push(vendorData);
      }
    }

    responseHandler
      .setSuccess(true)
      .setMessage("All Vendors Retrieved")
      .setData(postData);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }
  responseHandler.getResponse(res);
});

//Add Vendor Store Details
vendor.post("/add-store", async (req, res) => {
  try {
    // Validate request body
    const { error } = vendorSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const connection = await pool.getConnection();
    savedUser = await utils.GetResourceService.getResourceById(
      UserDatabase.userTableName,
      req.body.userId,
      connection
    );
    connection.release();
    if (savedUser != null) {
      //Handle Image
      const imagePath =
        await utils.ImageService.convertBase64ImageAndSaveToStorage(
          req.body.storeImage
        );

      // Create new vendor
      const insertResult = await VendorDatabase.postVendor(req.body);
      const postData = {
        id: insertResult.insertId,
        storeName: req.body.storeName,
        storeImage: imagePath,
        storeDescription: req.body.storeDescription,
        storePhone: req.body.storePhone,
        storeEmail: req.body.storeEmail,
        user: {
          id: savedUser.id,
          userName: savedUser.userName,
          userEmailOrPhone: savedUser.userEmailOrPhone,
        },

        newVendor: true,
      };
      responseHandler
        .setSuccess(true)
        .setMessage("Vendor Added")
        .setData(postData);
    } else {
      console.error("Saved user not found");
      responseHandler
        .setSuccess(false)
        .setMessage(responseHandler.genericErrorMessage)
        .setData(null);
    }
  } catch (error) {
    console.log(error);
    if (error.code == "ER_DUP_ENTRY") {
      //email check here
      responseHandler
        .setSuccess(false)
        .setMessage("Vendor already exists. Please login.")
        .setData({
          errorCode: "ER_DUP_ENTRY",
          newVendor: false,
        });
    } else {
      console.error(error);
      responseHandler
        .setSuccess(false)
        .setMessage(responseHandler.genericErrorMessage)
        .setData(null);
    }
  }

  responseHandler.getResponse(res);
});

// Update Product
vendor.put("/:id", async (req, res) => {
  try {
    vendorId = parseInt(req.params.id);
    // Validate request body
    const { error } = vendorUpdateByVendorSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    savedVendor = await VendorDatabase.getVendorById(vendorId);
    if (savedVendor === null) {
      return res.status(404).json({ error: "Vendor not found" });
    } else {
      updatedResult = await VendorDatabase.updateVendor(
        vendorId,
        req.body,
        savedVendor
      );

      if (updatedResult.results.affectedRows === 0) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      savedUser = await UserDatabase.getUserById(savedVendor.userId);

      const postData = {
        id: vendorId,
        storeName: req.body.storeName ?? savedVendor.storeName,
        storeImage: updatedResult.imageUpdated ?? savedVendor.storeImage,
        storeDescription:
          req.body.storeDescription ?? savedVendor.storeDescription,
        storePhone: req.body.storePhone ?? savedVendor.storePhone,
        storeEmail: req.body.storeEmail ?? savedVendor.storeEmail,
        user: {
          id: savedUser.id,
          userName: savedUser.userName,
          userEmailOrPhone: savedUser.userEmailOrPhone,
        },
      };

      responseHandler
        .setSuccess(true)
        .setMessage("Vendor Updated")
        .setData(postData);
    }
  } catch (error) {
    console.error(error);

    if (error.code == "ER_DUP_ENTRY") {
      //email check here
      responseHandler
        .setSuccess(false)
        .setMessage("Email already exists. Please enter a different email.")
        .setData({
          errorCode: "ER_DUP_ENTRY",
          newVendor: false,
        });
    } else {
      console.error(error);
      responseHandler
        .setSuccess(false)
        .setMessage(responseHandler.genericErrorMessage)
        .setData(null);
    }
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage)
      .setData(null);
  }
  responseHandler.getResponse(res);
});

// DELETE endpoint to delete a vendor by ID
vendor.delete("/:id", async (req, res) => {
  try {
    const idToDelete = parseInt(req.params.id, 10);

    result = await VendorDatabase.deleteVendor(idToDelete);

    // Check if a row was affected
    if (result.affectedRows === 0) {
      responseHandler
        .setSuccess(false)
        .setMessage("Vendor not found")
        .setData(null);
    } else {
      responseHandler
        .setSuccess(true)
        .setMessage("Vendor deleted")
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

module.exports.vendor = vendor;
