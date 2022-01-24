const Category = require("../models/categrory");
const fs = require("fs");
const path = require("path");
const configs = require("../configs/index");
const multer = require("multer");
const multerConfig = require("../configs/multerConfig");
const express = require("express");
const router = express.Router();

router.post(
  "/category",
  multer(multerConfig).single("thumbnail"),
  async (req, res) => {
    const { name, imageDescription } = req.body;
    const { filename } = req.file;

    try {
      const category = await Category.findOne({ name });

      if (category) {
        return res.status(400).json({ message: "Categoria já cadastrada" });
      }

      await Category.create({
        name,
        imageDescription,
        thumbnail: filename,
        active: true,
      });

      return res
        .status(200)
        .json({ message: "Categoria cadastrada com sucesso" });
    } catch (error) {
      const erro = {
        message: "Erro ao cadastrar a categoria",
        type: error.message,
      };
      return res.status(400).json(erro);
    }
  }
);

router.put(
  "/categoryEdit/:id",
  multer(multerConfig).single("thumbnail"),
  async (req, res) => {
    const { filename } = req.file;
    const { name, imageDescription } = req.body;
    const { id } = req.params;

    try {
      const category = await Category.findOne({ _id: id });

      const pathToImage = path.resolve(
        __dirname,
        "..",
        "..",
        "uploads",
        `${category.thumbnail}`
      );

      await ulinkFile(pathToImage);

      async function ulinkFile(filePath) {
        await fs.unlink(filePath, function (err) {
          if (err)
            return res.status(400).json({
              erro: {
                message: "Erro ao deletar o arquivo",
                type: err.message,
              },
            });
          console.log("file deleted successfully");
        });
      }

      await Category.findOneAndUpdate(
        { _id: id },
        { $set: { name, imageDescription, thumbnail: filename } }
      );

      return res
        .status(200)
        .json({ message: "Categoria alterada com sucesso" });
    } catch (error) {
      const erro = {
        message: "Erro ao alterar a categoria",
        type: error.message,
      };
      return res.status(400).json(erro);
    }
  }
);

router.get("/category", async (req, res) => {
  try {
    const category = await Category.find();
    const urlImage = configs.photo_url;
    return res.status(200).json({ category, urlImage });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar as categorias",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.put("/category/:id", async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    await Category.findOneAndUpdate({ _id: id }, { $set: { active } });

    return res.status(200).json({ message: "Categoria alterada com sucesso" });
  } catch (error) {
    const erro = {
      message: "Erro ao alterar a categoria",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

module.exports = (app) => app.use("/", router);
