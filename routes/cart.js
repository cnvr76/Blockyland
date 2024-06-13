const express = require("express");
const router = express.Router();
const dbHandler = require("../util/dbHandler");

router.get("/cart", (req, res) => {
  res.render("cart");
});

router.get("/cart/:item_id/delete", async (req, res) => {
  try {
    const user_id = req.session.user.id;
    await dbHandler.deleteItemFromCart(user_id, req.params.item_id);
    return res.redirect(`/cart/${user_id}`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.get("/cart/:item_id/:quantity/update", async (req, res) => {
  try {
    const user_id = req.session.user.id;
    await dbHandler.updateCartItemQuantity(
      user_id,
      req.params.item_id,
      req.params.quantity
    );
    return res.redirect(`/cart/${user_id}`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.get("/cart/:item_id/:quantity/add", async (req, res) => {
  try {
    const user_id = req.session.user.id;
    await dbHandler.addItemToCart(
      user_id,
      req.params.item_id,
      req.params.quantity
    );
    return res.redirect(`/shop/${req.params.item_id}/details`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.get("/cart/:user_id", async (req, res) => {
  try {
    const cart_items = await dbHandler.getCartItems(req.params.user_id);
    const items = await dbHandler.getItemsFromDB();

    // console.log(items);

    let sum = 0;
    const cart = [];
    for (const cart_item of cart_items) {
      let item_id = cart_item.item_id;
      let quantity = cart_item.quantity;
      let cart_id = cart_item.cart_id;
      let user_id = cart_item.user_id;
      for (const item of items) {
        if (item.id === item_id) {
          if (cart_item.user_id === req.session.user.id) {
            sum += item.price * quantity;
          }
          cart.push({
            ...item,
            quantity: quantity,
            cart_id: cart_id,
            user_id: user_id,
          });
        }
      }
    }
    // console.log(cart);
    res.render("cart", { cart, sum });
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

module.exports = router;
