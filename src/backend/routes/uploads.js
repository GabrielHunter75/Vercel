const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("imagem"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Nenhum arquivo enviado." });

  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
});

module.exports = router;
