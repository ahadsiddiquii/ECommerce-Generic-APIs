const utils = require("../../generic/modules/utils");
const { cartSchemaValidation, addToCartSchemaValidation } = require("./cart");
const CartDatabase = require("./cart_database");

var cart = utils.express.Router();

const responseHandler = new utils.ResponseHandler();

cart.use(utils.bodyParser.json());

//Get User Cart
cart.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const results = await CartDatabase.getUserCart(userId);

    const postData = {
      id: results.id,
      userId: results.userId,
      itemInCartCount: results.itemInCartCount,
      cartItems: JSON.parse(results.cartItems),
    };

    responseHandler
      .setSuccess(true)
      .setMessage("User Cart Retrieved")
      .setData(postData);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }
  responseHandler.getResponse(res);
});

// Add to cart
cart.post("/add-item", async (req, res) => {
  try {
    // Validate request body
    const { error } = addToCartSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const results = await CartDatabase.addItemToCart(req.body);

    const postData = {
      id: results.id,
      userId: results.userId,
      itemInCartCount: results.itemInCartCount,
      cartItems: results.cartItems,
    };

    responseHandler
      .setSuccess(true)
      .setMessage("User Cart Retrieved")
      .setData(postData);
  } catch (error) {
    console.error(error);
    responseHandler
      .setSuccess(false)
      .setMessage(responseHandler.genericErrorMessage);
  }
  responseHandler.getResponse(res);
});

module.exports.cart = cart;
