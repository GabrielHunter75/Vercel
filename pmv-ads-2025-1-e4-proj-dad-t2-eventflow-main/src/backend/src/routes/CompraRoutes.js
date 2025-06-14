// src/backend/routes/compraRoutes.js
import express from 'express';
import { criarCompra, getComprasPorUsuario } from './controllers/compraController.js';

const router = express.Router();

router.post('/', criarCompra);
router.get('/usuario/:userId', getComprasPorUsuario);

export default router;