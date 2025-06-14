const { gerarPayloadPix } = require("../utils/gerarPayloadPix");

exports.gerarPix = async (req, res) => {
  try {
    const { chave, nome, cidade, valor } = req.body;

    if (!chave || !nome || !cidade || !valor) {
      return res.status(400).json({ message: "Dados insuficientes para gerar Pix" });
    }

    const valorFormatado = parseFloat(valor).toFixed(2);
    const payload = gerarPayloadPix({ chave, nome, cidade, valor: valorFormatado });

    res.status(200).json({ copiaecola: payload });
  } catch (error) {
    console.error("Erro ao gerar Pix:", error);
    res.status(500).json({ message: "Erro ao gerar Pix" });
  }
};
