// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota: POST /api/auth/register
router.post('/register', usuarioController.registrar);

// Rota: POST /api/auth/login
router.post('/login', usuarioController.login);

// Rota protegida: GET /api/auth/perfil
router.get('/perfil', authMiddleware, (req, res) => {
    res.json({ 
        message: 'Acesso autorizado', 
        usuario: req.usuario // req.usuario é preenchido pelo authMiddleware após decodificar o JWT
    });
});

module.exports = router;