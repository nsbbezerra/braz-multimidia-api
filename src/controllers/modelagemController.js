const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const multerConfig = require("../configs/multerConfig");
const Modelagem = require("../models/modelagem");
const Tabela = require("../models/tabelas");
const configs = require("../configs/index");

router.post(
  "/saveModels",
  multer(multerConfig).single("models"),
  async (req, res) => {
    const { desc, title, id } = req.body;
    const { filename } = req.file;
    try {
      await Modelagem.create({ product: id, desc, title, image: filename });
      return res
        .status(200)
        .json({ message: "Modelagem cadastrada com sucesso" });
    } catch (error) {
      console.log(error);
      const erro = {
        message: "Erro ao cadastrar as modelagens",
        type: error.message,
      };
      return res.status(400).json(erro);
    }
  }
);

router.post(
  "/saveTables",
  multer(multerConfig).single("tables"),
  async (req, res) => {
    const { id } = req.body;
    const { filename } = req.file;
    try {
      await Tabela.create({ product: id, image: filename });
      return res.status(200).json({ message: "Tabela cadastrada com sucesso" });
    } catch (error) {
      const erro = {
        message: "Erro ao cadastrar as tabelas",
        type: error.message,
      };
      return res.status(400).json(erro);
    }
  }
);

router.get("/listModelagem/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const modelagem = await Modelagem.find({ product: id });
    const tabela = await Tabela.find({ product: id });
    const urlImage = configs.photo_url;
    return res.status(200).json({ modelagem, tabela, urlImage });
  } catch (error) {
    const erro = {
      message: "Erro ao cadastrar as tabelas",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.delete("/delModelagem/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const modelagem = await Modelagem.findOne({ _id: id });
    const pathToImage = path.resolve(
      __dirname,
      "..",
      "..",
      "uploads",
      `${modelagem.image}`
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
    await Modelagem.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "Modelagem excluída com sucesso" });
  } catch (error) {
    const erro = {
      message: "Erro ao excluir a modelagem",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

router.delete("/delTabela/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const modelagem = await Tabela.findOne({ _id: id });
    const pathToImage = path.resolve(
      __dirname,
      "..",
      "..",
      "uploads",
      `${modelagem.image}`
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
    await Tabela.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "Tabela excluída com sucesso" });
  } catch (error) {
    const erro = {
      message: "Erro ao excluir a tabela",
      type: error.message,
    };
    return res.status(400).json(erro);
  }
});

module.exports = (app) => app.use("/", router);
