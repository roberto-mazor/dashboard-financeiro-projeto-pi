// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota: POST /api/auth/registrar
router.post('/registrar', usuarioController.registrar);
router.post('/login', usuarioController.login);

// Rota protegida de exemplo (apenas para teste)
router.get('/perfil', authMiddleware, (req, res) => {
    res.json({ message: 'Você acessou uma rota protegida!', usuarioLogado: req.usuario });
});

module.exports = router;