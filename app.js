const express = require("express");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "StudenT**10",
  database: "sessions_bl",
};

const sessionStore = new MySQLStore(options);

app.use(
  session({
    secret: "superSecretString",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use((req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return next();
  }
  res.locals.isAuth = true;
  res.locals.user = { ...user };
  next();
});

app.use("/", require("./routes/public"));
app.use("/", require("./routes/defaults"));
app.use("/", require("./routes/shop"));
app.use("/", require("./routes/support"));
app.use("/", require("./routes/admin"));
app.use("/", require("./routes/cart"));

app.use((req, res) => {
  res.status(404).render("404");
});

app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(500).render("500");
});

app.listen(3000);
