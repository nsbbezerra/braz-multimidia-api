const Category = require("../models/categrory");
const Product = require("../models/products");
const Comments = require("../models/depoiments");
const Catalog = require("../models/portifilio");
const Tables = require("../models/tabelas");
const Modelagem = require("../models/modelagem");
const config = require("../configs/index");
const express = require("express");
const router = express.Router();

router.get("/home", async (req, res) => {
  try {
    const category = await Category.find({ active: true });
    const products = await Product.find({ active: true })
      .limit(10)
      .select("thumbnail imageDescription");
    const productsFooter = await Product.find({ active: true })
      .limit(5)
      .select("name");
    const comments = await Comments.find();

    const urlPhoto = config.photo_url;

    return res.status(200).json({
      category,
      products,
      productsFooter,
      comments,
      urlPhoto,
    });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar as informações",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.get("/productPage", async (req, res) => {
  try {
    const category = await Category.find({ active: true }).select("name");
    const products = await Product.find({ active: true }).select(
      "name thumbnail description imageDescription category"
    );
    const urlPhoto = config.photo_url;
    return res.status(200).json({ category, products, urlPhoto });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar as informações",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.get("/catalogPage", async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    const catalogs = await Catalog.find({ active: true });
    const tables = await Tables.find();
    const modelage = await Modelagem.find();
    const urlPhoto = config.photo_url;
    return res
      .status(200)
      .json({ products, urlPhoto, catalogs, tables, modelage });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar as informações",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.get("/findCategory", async (req, res) => {
  try {
    const category = await Category.find({ active: true }).select("name");
    return res.status(200).json({ category });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar as informações",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.get("/findAllProducts", async (req, res) => {
  try {
    const products = await Product.find({ active: true }).select("name");
    return res.status(200).json({ products });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar as informações",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

module.exports = (app) => app.use("/", router);
