const express = require("express");
const router = express.Router();
const dbHandler = require("../util/dbHandler");

router.get("/", async (req, res) => {
  try {
    const items = await dbHandler.getItemsFromDB();
    res.render("index", { items });
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.get("/home/:id", async (req, res) => {
  try {
    const item = await dbHandler.getItemByID(req.params.id);
    const reviews = await dbHandler.getReviewsByItemID(req.params.id);
    const user_id = req.session.user ? req.session.user.id : null;
    return res.json({ item, reviews, user_id });
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.get("/about-us", (req, res) => {
  res.render("about-us");
});

module.exports = router;
