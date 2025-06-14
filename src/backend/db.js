const mongoose = require("mongoose");

const dbURI = "mongodb+srv://eventFlow:eventflowpucads@cluster0.hc5eh.mongodb.net/eventflow?retryWrites=true&w=majority";

const connectDB = async (app) => {
  try {
    await mongoose.connect(dbURI);
    app.locals.db = mongoose.connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados", error);
    throw error;
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
};

module.exports = { connectDB, closeDB, db: mongoose.connection };
