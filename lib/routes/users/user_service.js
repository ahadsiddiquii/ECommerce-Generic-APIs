const utils = require("../../generic/modules/utils");
const { userSchemaValidation, userLoginSchemaValidation } = require("./user");
const UserDatabase = require("./user_database");
const CartDatabase = require("../cart/cart_database");

var user = utils.express.Router();

const responseHandler = new utils.ResponseHandler();

user.use(utils.bodyParser.json());

//Create User
user.post("/signup", async (req, res) => {
  try {
    // Validate request body
    const { error } = userSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Create new user
    const insertResult = await UserDatabase.postUser(req.body);
    const postData = {
      id: insertResult.insertId,
      userName: req.body.userName,
      userEmailOrPhone: req.body.userEmailOrPhone,
      roles: req.body.roles,
      newUser: true,
    };
    // Create new cart for user
    CartDatabase.createUserCart(insertResult.insertId);

    //Response
    responseHandler.setSuccess(true).setMessage("User Added").setData(postData);
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      //roles check
      savedUser = await UserDatabase.getSavedUserByEmailOrPhone(
        req.body.userEmailOrPhone
      );
      if (savedUser != null) {
        userDataExists = false;
        savedRoles = JSON.parse(savedUser.roles);
        for (let i = 0; i < savedRoles.length; i++) {
          console.log(req.body.roles[0]);
          console.log(savedRoles[i]);
          if (req.body.roles[0] === savedRoles[i]) {
            userDataExists = true;
          }
        }
        if (userDataExists) {
          responseHandler
            .setSuccess(false)
            .setMessage("User already exists. Please login.")
            .setData({
              newUser: false,
              errorCode: "ER_DUP_ENTRY",
            });
        } else {
          newUser = false;
          savedRoles.push(req.body.roles[0]);
          //Insert Role
          console.log("Add Role");
          const updateResult = await UserDatabase.updateUser(
            savedRoles,
            savedUser.userEmailOrPhone
          );

          const postData = {
            id: savedUser.id,
            userName: req.body.userName,
            userEmailOrPhone: req.body.userEmailOrPhone,
            roles: savedRoles,
            newUser: false,
          };
          responseHandler
            .setSuccess(true)
            .setMessage("User Updated")
            .setData(postData);
        }
      } else {
        console.error(error);
        responseHandler
          .setSuccess(false)
          .setMessage(responseHandler.genericErrorMessage)
          .setData(null);
      }
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

//Login User
user.post("/login", async (req, res) => {
  try {
    // Validate request body
    const { error } = userLoginSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Create new user
    const results = await UserDatabase.loginUser(req.body);
    if (results.match) {
      const postData = {
        id: results.savedUser.id,
        userName: results.savedUser.userName,
        userEmailOrPhone: results.savedUser.userEmailOrPhone,
        roles: JSON.parse(results.savedUser.roles),
      };
      responseHandler
        .setSuccess(true)
        .setMessage("User Logged In")
        .setData(postData);
    } else {
      responseHandler
        .setSuccess(false)
        .setMessage("Invalid Credentials")
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

// DELETE endpoint to delete a user by ID
user.delete("/:id", async (req, res) => {
  try {
    const idToDelete = parseInt(req.params.id, 10);

    result = await UserDatabase.deleteUser(idToDelete);

    // Check if a row was affected
    if (result.affectedRows === 0) {
      responseHandler
        .setSuccess(false)
        .setMessage("User not found")
        .setData(null);
    } else {
      responseHandler.setSuccess(true).setMessage("User deleted").setData(null);
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

module.exports.user = user;
