const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const dbHandler = require("../util/dbHandler");

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await dbHandler.getUserBy("email", email);
    if (existingUser.length === 0) {
      return res.redirect("/login");
    }
    const hashedPwd = crypto
      .pbkdf2Sync(password, existingUser[0].salt, 1000, 64, "sha512")
      .toString("hex");
    if (existingUser[0].password === hashedPwd) {
      req.session.user = {
        id: existingUser[0].user_id,
        email: existingUser[0].email,
        name: existingUser[0].name,
        isAdmin: existingUser[0].rights ? true : false,
      };
      req.session.save(() => {
        res.redirect("/");
      });
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.get("/signup", (req, res) => {
  let inputData = req.session.inputData;
  if (!inputData) {
    inputData = {
      name: "",
      email: "",
      password: "",
      password_repeat: "",
    };
  }
  req.session.inputData = null;
  res.render("signup", { inputData });
});
router.post("/signup", async (req, res) => {
  const { name, email, password, password_repeat } = req.body;

  const inputData = {
    ...req.body,
  };

  if (password_repeat !== password || password.length < 8) {
    inputData.errorMessage = "Incorrect password";
    req.session.inputData = inputData;
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const existingUser = await dbHandler.getUserBy("email", email);
  if (existingUser.length > 0) {
    inputData.errorMessage = "User already exists";
    req.session.inputData = inputData;
    req.session.save(() => {
      res.redirect("/signup");
    });
    return;
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPwd = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  try {
    // add user to DB
    await dbHandler.createUser([name, email, hashedPwd, salt]);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(500).render("500");
  }
});

router.post("/logout", (req, res) => {
  req.session.user = null;
  req.session.save(() => {
    res.redirect("/");
  });
  return;
});

module.exports = router;
