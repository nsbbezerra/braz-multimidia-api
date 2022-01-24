const Portifolio = require("../models/portifilio");
const configs = require("../configs/index");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfit = require("../configs/multerConfig");

router.post(
  "/catalog",
  multer(multerConfit).single("catalog"),
  async (req, res) => {
    const { filename } = req.file;
    const { product, imageDescription } = req.body;

    try {
      await Portifolio.create({
        product,
        imageDescription,
        image: filename,
        active: true,
      });
      return res
        .status(200)
        .json({ message: "Item do catálogo cadastrado com sucesso" });
    } catch (error) {
      const erro = {
        message: "Erro ao cadastrar o item do catálogo",
        type: error.message,
      };
      return res.status(400).json(erro);
    }
  }
);

router.get("/catalog/:product", async (req, res) => {
  const { product } = req.params;
  try {
    const catalog = await Portifolio.find({ product: product });
    const urlImage = configs.photo_url;
    return res.status(200).json({ catalog, urlImage });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar o item do catálogo",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.put("/catalog/:id", async (req, res) => {
  const { active } = req.body;
  const { id } = req.params;
  try {
    await Portifolio.findOneAndUpdate(
      { _id: id },
      { $set: { active: active } }
    );
    return res
      .status(200)
      .json({ message: "Item ativado/bloqueado com sucesso" });
  } catch (error) {
    const erro = {
      message: "Erro ao ativar/bloquear o item do catálogo",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

module.exports = (app) => app.use("/", router);
