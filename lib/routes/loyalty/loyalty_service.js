const utils = require("../../generic/modules/utils");
const {
  loyaltySchemaValidation,
  loyaltyPointsUpdateSchemaValidation,
} = require("./loyalty");
const LoyaltyDatabase = require("./loyalty_database");

var loyalty = utils.express.Router();

const responseHandler = new utils.ResponseHandler();

loyalty.use(utils.bodyParser.json());

//Register User Loyalty
loyalty.post("/", async (req, res) => {
  try {
    // Validate request body
    const { error } = loyaltySchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Create new item
    await LoyaltyDatabase.postLoyalty(req.body);

    responseHandler.setSuccess(true).setMessage("Loyalty Added").setData(true);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }

  responseHandler.getResponse(res);
});

//Get User Loyalty Points
loyalty.get("/:id", async (req, res) => {
  try {
    const results = await LoyaltyDatabase.getUserLoyaltyPoints(req.params.id);

    responseHandler
      .setSuccess(true)
      .setMessage("User " + req.params.id + " Loyalty Retrieved")
      .setData(results);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }
  responseHandler.getResponse(res);
});

// Update Loyalty Points
loyalty.put("/", async (req, res) => {
  try {
    // Validate request body
    const { error } = loyaltyPointsUpdateSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const postData = {
      id: parseInt(req.params.id),
      userId: req.body.userId,
      loyaltyPoints: loyaltyPoints,
    };
    responseHandler
      .setSuccess(true)
      .setMessage("Loyalty Updated")
      .setData(postData);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }
  responseHandler.getResponse(res);
});

module.exports.loyalty = loyalty;
