// backend/db.js
const mongoose = require("mongoose");

// Remova a linha `const dbURI = "..."`
// const dbURI = "mongodb+srv://eventFlow:eventflowpucads@cluster0.hc5eh.mongodb.net/eventflow?retryWrites=true&w=majority"; // <-- REMOVA ESTA LINHA OU COMENTE

const connectDB = async (app) => {
  try {
    // Use process.env.MONGODB_URI para acessar a variável de ambiente
    await mongoose.connect(process.env.MONGODB_URI); // <-- ALTERADO AQUI
    app.locals.db = mongoose.connection;
    console.log("Conectado ao MongoDB Atlas!"); // Adicionado para clareza
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    // É bom lançar o erro para que o index.js saiba que a conexão falhou
    throw error;
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
  console.log("Conexão com MongoDB fechada."); // Adicionado para clareza
};

module.exports = { connectDB, closeDB, db: mongoose.connection };