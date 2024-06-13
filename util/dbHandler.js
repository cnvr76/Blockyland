const db = require("../data/database");

const getItemsFromDB = async () => {
  const query = `
  SELECT * FROM items
  LEFT JOIN images
  ON items.id = images.item_id
  INNER JOIN set_types
  ON items.type_id = set_types.type_id
  `;
  const [records] = await db.query(query);
  return records;
};

const getCartItems = async () => {
  const [records] = await db.query("SELECT * FROM cart");
  return records;
};

const addItemToCart = async (user_id, item_id, quantity) => {
  const query = `
    INSERT INTO cart (user_id, item_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?
  `;
  await db.query(query, [user_id, item_id, quantity, quantity]);
};

const deleteItemFromCart = async (user_id, item_id) => {
  const query = `
    DELETE FROM cart WHERE user_id = ?
    AND item_id = ?
  `;
  await db.query(query, [user_id, item_id]);
};

const updateCartItemQuantity = async (user_id, item_id, quantity) => {
  const query = `
    INSERT INTO cart (user_id, item_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = ?
  `;
  await db.query(query, [user_id, item_id, quantity, quantity]);
};

const getItemByID = async (id) => {
  const query = `
  SELECT * FROM items
  LEFT JOIN images
  ON items.id = images.item_id
  INNER JOIN set_types
  ON items.type_id = set_types.type_id
  WHERE items.id = ?
  `;
  const [records] = await db.query(query, [id]);
  return records;
};

const getOtherImagesByItemID = async (item_id) => {
  const [records] = await db.query(
    `SELECT * FROM other_images WHERE item_id = ?`,
    [item_id]
  );
  return records;
};

const deleteItemByID = async (id) => {
  const query = `
    DELETE FROM items WHERE id = ?
  `;
  await db.query(query, [id]);
};

const deleteReviewByID = async (r_id) => {
  await db.query(`DELETE FROM rating WHERE rating_id = ?`, [r_id]);
};

const deleteUserByID = async (user_id) => {
  const query = `
    DELETE FROM users WHERE user_id = ?
  `;
  await db.query(query, [user_id]);
};

// const getPopularItems = async () => {
//   const query = `

//   `;
//   const [records] = await db.query(query, [values]);
//   return records;
// };

const addImageURL = async (values) => {
  const query = `
    INSERT INTO images (image, item_id)
    VALUES (?)
  `;
  const [result] = await db.query(query, [values]);
  return result;
};

const addOtherImageURL = async (values) => {
  const query = `
    INSERT INTO other_images (item_id, other)
    VALUES (?)
  `;
  const [result] = await db.query(query, [values]);
  return result;
};

const getSetTypes = async () => {
  const query = `
    SELECT * FROM set_types
  `;
  const [records] = await db.query(query);
  return records;
};

const createItem = async (values) => {
  const query = `
      INSERT INTO items (item_name, price, age, piece_count, type_id)
      VALUES (?)  
    `;
  const [result] = await db.query(query, [values]);
  return result;
};

const createUser = async (values) => {
  const query = `
    INSERT INTO users (name, email, password, salt)
    VALUES (?)
  `;
  await db.query(query, [values]);
};

const updateUserRights = async (user_id, right) => {
  const query = `
    UPDATE users
    SET rights = CASE
        WHEN rights = ? THEN NULL
        ELSE ?
    END
    WHERE user_id = ?;
  `;
  await db.query(query, [right, right, user_id]);
};

const getUserBy = async (col, value) => {
  const query = `
    SELECT * FROM users WHERE ${col} = ?
  `;
  const [records] = await db.query(query, [value]);
  return records;
};

const getUsers = async () => {
  const [records] = await db.query(`SELECT * FROM users`);
  return records;
};

const getFromDBBy = async (table, col, value) => {
  const query = `
    SELECT * FROM ${table} WHERE ${col} = "${value}" 
  `;
  const [records] = await db.query(query);
  return records;
};

const countOf = async (table, col, value) => {
  const query = `
  SELECT COUNT(*) AS count FROM ${table} WHERE ${col} = "${value}" 
  `;
  const [records] = db.query(query, [table, col, value]);
  return records;
};

const addReview = async (values) => {
  const query = `
    INSERT INTO rating (user_id, rating, review, item_id)
    VALUES (?)
  `;
  await db.query(query, [values]);
};

const getReviewsByItemID = async (id) => {
  const query = `
    SELECT * FROM rating
    LEFT JOIN users
    ON users.user_id = rating.user_id
    WHERE item_id = ?
  `;
  const [records] = await db.query(query, [id]);
  return records;
};

module.exports = {
  getFromDBBy,
  getItemsFromDB,
  getCartItems,
  addItemToCart,
  deleteItemFromCart,
  updateCartItemQuantity,
  getReviewsByItemID,
  getOtherImagesByItemID,
  getSetTypes,
  addImageURL,
  addOtherImageURL,
  createItem,
  createUser,
  countOf,
  getItemByID,
  deleteItemByID,
  deleteReviewByID,
  deleteUserByID,
  addReview,
  getUserBy,
  getUsers,
  updateUserRights,
};
