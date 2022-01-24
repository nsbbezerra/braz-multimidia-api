const mongoose = require("../database/index");

const CategorySchema = new mongoose.Schema({
  name: String,
  thumbnail: String,
  imageDescription: String,
  active: Boolean,
});

const category = mongoose.model("Category", CategorySchema);

module.exports = category;
