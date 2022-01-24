const mongoose = require("../database/index");

const productSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  description: String,
  thumbnail: String,
  slug: String,
  video: String,
  imageDescription: String,
  imageDescMiddle: String,
  active: Boolean,
  models: [
    {
      image: String,
      desc: String,
      title: String,
    },
  ],
  table: [
    {
      image: String,
    },
  ],
});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
