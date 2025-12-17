// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota: POST /api/auth/registrar
router.post('/registrar', usuarioController.registrar);

module.exports = router;