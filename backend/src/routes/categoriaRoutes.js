const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas de categoria precisam de login
router.use(authMiddleware);

router.post('/', categoriaController.criarCategoria);
router.get('/', categoriaController.listarCategorias);

module.exports = router;