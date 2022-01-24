const mongoose = require("../database/index");

const ModelagemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
  image: String,
  desc: String,
  title: String,
});

const modelagemSchema = mongoose.model("modelagem", ModelagemSchema);

module.exports = modelagemSchema;
