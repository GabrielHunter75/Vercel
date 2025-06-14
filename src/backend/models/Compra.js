const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
  evento_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evento',
    required: true
  },
  comprador: {
    type: String,
    required: true
  },
  quantidade: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  dataCompra: {
    type: Date,
    default: Date.now
  },
  pdfUrl: {
    type: String
  }
});

const Compra = mongoose.model('Compra', compraSchema);

module.exports = Compra;
