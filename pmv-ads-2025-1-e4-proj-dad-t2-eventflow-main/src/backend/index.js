const express = require("express");
const { connectDB } = require("./db"); // <-- importa a função connectDB corretamente
const cors = require("cors");
const path = require("path");

// Rotas
const apiRouter = require("./routes/apiRouter");
const eventosRouter = require("./routes/eventos");
const meusEventosRouter = require("./routes/MeusEventos");
const usuariosRouter = require("./routes/usuarios");
const comprasRouter = require("./routes/compras");
const pixRouter = require("./routes/pix");
const relatoriosRouter = require("./routes/relatorios");
const uploadsRouter = require("./routes/uploads");

const app = express();
const port = 3000;

// Conexão com o banco de dados
connectDB(app)
  .then(() => console.log("Conectado ao banco de dados!"))
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
    process.exit(1);
  });

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas
app.use("/api/v1", apiRouter);
app.use("/api/v1/eventos", eventosRouter);
app.use("/api/v1/meus-eventos", meusEventosRouter);
app.use("/api/v1/usuarios", usuariosRouter);
app.use("/api/v1/compras", comprasRouter);
app.use("/api/v1/gerar-pix", pixRouter);
app.use("/api/v1/relatorios", relatoriosRouter);
app.use("/api/v1/uploads", uploadsRouter);

// Só roda o servidor se não estiver em ambiente de teste
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;
