const mongoose = require("../database/index");

const TabelaSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
  image: String,
});

const tabelaSchema = mongoose.model("Tabelas", TabelaSchema);

module.exports = tabelaSchema;
