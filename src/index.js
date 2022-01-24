require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use("/img", express.static(path.resolve(__dirname, "..", "uploads")));

require("./controllers/portifolioController")(app);
require("./controllers/categoryController")(app);
require("./controllers/dashboarcdController")(app);
require("./controllers/depoimentsController")(app);
require("./controllers/productController")(app);
require("./controllers/siteController")(app);
require("./controllers/modelagemController")(app);

const port = process.env.PORT || 21489;

app.listen(port, function () {
  console.log("Servidor Ativo na Porta", port);
});
