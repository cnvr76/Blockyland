const express = require("express");
const router = express.Router();
const dbHandler = require("../util/dbHandler");

router.get("/shop", async (req, res) => {
  try {
    const items = await dbHandler.getItemsFromDB();
    res.render("shop", { items });
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.get("/shop/:id/details", async (req, res) => {
  try {
    const id = req.params.id;
    const records = await dbHandler.getItemByID(id);
    const reviews = await dbHandler.getReviewsByItemID(id);
    const other_images = await dbHandler.getOtherImagesByItemID(id);

    let allRating = 0;
    for (const review of reviews) {
      allRating += review.rating;
    }
    let averageRating = Math.round(allRating / reviews.length);

    if (records.length > 0) {
      return res.render("product-page", {
        item: records[0],
        averageRating,
        reviews,
        other_images,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.post("/shop/:id/details/reviews", async (req, res) => {
  const { rating, review } = req.body;
  try {
    await dbHandler.addReview([
      res.locals.user.id,
      rating,
      review,
      req.params.id,
    ]);
    return res.redirect(`/shop/${req.params.id}/details`);
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

module.exports = router;
