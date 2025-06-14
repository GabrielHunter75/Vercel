const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  data_criacao: { type: Date, default: Date.now },
  eventos_inscritos: [mongoose.Schema.Types.ObjectId],
  eventos_criados: [mongoose.Schema.Types.ObjectId],
  tipo_usuario: { type: String, enum: ['admin', 'normal'], required: true },
});

module.exports = mongoose.model('User', userSchema);
