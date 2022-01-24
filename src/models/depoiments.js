const mongoose = require("../database/index");

const depoimentSchema = new mongoose.Schema({
  text: String,
  author: String,
  avatar: String,
});

const Depoiments = mongoose.model("Depoiments", depoimentSchema);

module.exports = Depoiments;
