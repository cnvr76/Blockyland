const express = require("express");
const router = express.Router();
const dbHandler = require("../util/dbHandler");
const cloudinary = require("../data/cloudinary");
const fs = require("fs");

const multer = require("multer");
const { fileFilter, storage } = require("../util/multer");
const upload = multer({ storage, fileFilter });

// adding items
router.get("/add-item", async (req, res) => {
  const set_types = await dbHandler.getSetTypes();
  res.render("add-item", { set_types });
});

const loadToCloud = async (path) => {
  let url = "";
  await cloudinary.uploader.upload(path).then((result) => {
    url = result.secure_url;
  });
  return url;
};
router.post(
  "/add-item",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "other_images", maxCount: 5 },
  ]),
  async (req, res) => {
    const { set_type, name, age, pieces, price } = req.body;
    const { main_image, other_images } = req.files;

    try {
      // loading single image to cloud
      let path = main_image[0].path;
      let main_path = "";
      if (main_image) {
        main_path = path.substr(path.indexOf("/") + 1);
      }
      const url = await loadToCloud(main_path);
      // delete this image from "/public/upload"
      fs.unlink(main_path, (err) => {
        if (err) throw err;
        console.log(err);
      });
      // writing info of the item to DB with single image
      const type = await dbHandler.getFromDBBy("set_types", "name", set_type);
      const result = await dbHandler.createItem([
        name,
        parseFloat(price),
        parseInt(age),
        parseInt(pieces),
        type[0].type_id,
      ]);
      const items = await dbHandler.getItemsFromDB();
      await dbHandler.addImageURL([url, items[items.length - 1].id]);
    } catch (error) {
      console.log(error);
      return res.status(500).render("500");
    }

    try {
      const items = await dbHandler.getItemsFromDB();
      const item_id = items[items.length - 1].id;
      for (const elem of other_images) {
        let path = elem.path;
        let other_path = "";
        if (path) {
          other_path = path.substr(path.indexOf("/") + 1);
        }
        // loading multiple images to cloud
        let url = await loadToCloud(other_path);
        // delete this image from "/public/upload"
        fs.unlink(other_path, (err) => {
          if (err) throw err;
          console.log(err);
        });
        // loading multiple images with the same item_id to DB
        let result = await dbHandler.addOtherImageURL([item_id, url]);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).render("500");
    }
    return res.redirect("/");
  }
);
// making possible to delete items and reviews
router.post("/shop/:id/delete", async (req, res) => {
  try {
    await dbHandler.deleteItemByID(req.params.id);
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
  res.redirect("/shop");
});

router.post("/shop/:id/details/reviews/:r_id/delete", async (req, res) => {
  try {
    await dbHandler.deleteReviewByID(req.params.r_id);
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
  res.redirect(`/shop/${req.params.id}/details`);
});
// making possible for admin to work with existing users
router.get("/admin-panel", async (req, res) => {
  try {
    const allUsers = await dbHandler.getUsers();
    res.render("admin-panel", { allUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.get("/admin-panel/:user_id/delete", async (req, res) => {
  try {
    await dbHandler.deleteUserByID(req.params.user_id);
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
  res.redirect("/admin-panel");
});

router.get("/admin-panel/:user_id/make-admin", async (req, res) => {
  try {
    await dbHandler.updateUserRights(req.params.user_id, "admin");
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
  res.redirect("/admin-panel");
});

module.exports = router;
