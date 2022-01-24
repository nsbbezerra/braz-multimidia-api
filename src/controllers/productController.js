const Products = require("../models/products");
const configs = require("../configs/index");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("../configs/multerConfig");

router.post(
  "/products",
  multer(multerConfig).single("thumbnail"),
  async (req, res) => {
    const {
      name,
      category,
      description,
      slug,
      video,
      imageDescription,
    } = req.body;
    const { filename } = req.file;

    try {
      const product = await Products.findOne({ name });
      if (product) {
        return res.status(400).json({ message: "Produto já cadastrado" });
      }
      const productSave = await Products.create({
        name,
        category,
        description,
        thumbnail: filename,
        slug,
        video,
        imageDescription,
        active: true,
      });
      let idProduct = productSave._id;
      return res.status(200).json(idProduct);
    } catch (error) {
      const erro = {
        message: "Erro ao cadastrar o produto",
        type: error.message,
      };
      return res.status(400).json(erro);
    }
  }
);

router.post(
  "/middle/:id",
  multer(multerConfig).single("middle"),
  async (req, res) => {
    const { id } = req.params;
    const { filename } = req.file;

    try {
      await Products.findOneAndUpdate(
        { _id: id },
        { $set: { imageDescMiddle: filename } }
      );

      return res.status(200).json({ message: "Imagem cadastrada com sucesso" });
    } catch (error) {
      const erro = {
        message: "Erro ao cadastrar a imagem",
        type: error.message,
      };
      return res.status(400).json(erro);
    }
  }
);

router.get("/products", async (req, res) => {
  try {
    const products = await Products.find();
    const urlImage = configs.photo_url;
    return res.status(200).json({ products, urlImage });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar os produtos",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.put(
  "/products/:id",
  multer(multerConfig).single("thumbnail"),
  async (req, res) => {
    const { name, description, slug, video, imageDescription } = req.body;
    const { id } = req.params;
    const { filename } = req.file;
    try {
      const product = await Products.findOne({ _id: id });
      const pathToImage = path.resolve(
        __dirname,
        "..",
        "..",
        "uploads",
        `${product.thumbnail}`
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

      await Products.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            description,
            thumbnail: filename,
            slug,
            video,
            imageDescription,
          },
        }
      );
      return res.status(200).json({ message: "Produto alterado com sucesso" });
    } catch (error) {
      const erro = {
        message: "Erro ao editar o produto",
        type: error.message,
      };
      return res.status(400).json(erro);
    }
  }
);

router.put("/active/:id", async (req, res) => {
  const { active } = req.body;
  const { id } = req.params;
  try {
    await Products.findOneAndUpdate({ _id: id }, { $set: { active: active } });
    return res.status(200).json({ message: "Atualizado com sucesso" });
  } catch (error) {
    const erro = {
      message: "Erro ao ativar/bloquear o produto",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.get("/findByCategory/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Products.find({ category: category });
    const urlImage = configs.photo_url;
    return res.status(200).json({ products, urlImage });
  } catch (error) {
    const erro = {
      message: "Erro ao buscar os produtos",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

module.exports = (app) => app.use("/", router);
