const utils = require("../../generic/modules/utils");
const { createCartTable } = require("./cart");

var cartTableName = "Cart";

// Create a MySQL pool
const pool = utils.mySqlPool;

//Create cart
async function createUserCart(userId) {
  await createCartTable();
  const connection = await pool.getConnection();

  const [results] = await connection.query(
    "INSERT INTO " +
      cartTableName +
      "(userId, itemInCartCount, cartItems) VALUES (?, ?, ?)",
    [userId, 0, JSON.stringify([])]
  );
  connection.release();
  return results;
}

// Get user cart
async function getUserCart(userId) {
  const connection = await pool.getConnection();

  savedCart = await utils.GetResourceService.getResourceByCustomKey(
    cartTableName,
    "userId",
    userId,
    connection
  );
  connection.release();
  return savedCart;
}

//Add Item to cart
async function addItemToCart(itemToAdd) {
  const connection = await pool.getConnection();
  itemAdded = false;
  savedCart = await utils.GetResourceService.getResourceByCustomKey(
    cartTableName,
    "userId",
    itemToAdd.userId,
    connection
  );
  if(savedCart!=null){
    // Add Item to cart
    allCartItems = JSON.parse(savedCart.cartItems);
    allCartItems.push(itemToAdd);

    //Increment cart count
    savedCart.itemInCartCount = savedCart.itemInCartCount + itemToAdd.quantity; 
    

    const [results] = await connection.query(
      "UPDATE " +
        cartTableName +
        " SET userId = ?, itemInCartCount = ? , cartItems = ? WHERE id = ?",
      [
        savedCart.userId,
        savedCart.itemInCartCount,
        JSON.stringify(allCartItems),
        savedCart.id,
      ]
    );
    
    itemAdded = true;
  }

  connection.release();
  return itemAdded;
}

module.exports = {
  cartTableName,
  createUserCart,
  addItemToCart,
  getUserCart,
};
