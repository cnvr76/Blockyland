const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: "your cloud name",
  api_key: "api key",
  api_secret: "api secret",
  secure: true,
});

module.exports = cloudinary;
