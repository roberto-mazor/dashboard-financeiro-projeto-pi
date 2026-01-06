// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/auth/health
 * @desc    Rota de "Wake-up call" para acordar o banco de dados Serverless (Neon)
 * @access  Público
 */
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Servidor e Banco ativos' });
});

/**
 * @route   POST /api/auth/register
 * @desc    Registra um novo usuário e cria categorias padrão
 */
router.post('/register', usuarioController.registrar);

/**
 * @route   POST /api/auth/login
 * @desc    Autentica usuário e retorna Token JWT
 */
router.post('/login', usuarioController.login);

/**
 * @route   GET /api/auth/perfil
 * @desc    Retorna dados do perfil do usuário logado
 * @access  Privado (JWT)
 */
router.get('/perfil', authMiddleware, (req, res) => {
    res.json({ 
        message: 'Acesso autorizado', 
        usuario: req.usuario // Preenchido pelo authMiddleware
    });
});

module.exports = router;