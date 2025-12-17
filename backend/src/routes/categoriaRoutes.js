const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', categoriaController.criarCategoria);
router.get('/', categoriaController.listarCategorias);

// Novas rotas com parâmetro :id
router.put('/:id', categoriaController.editarCategoria);
router.delete('/:id', categoriaController.deletarCategoria);

module.exports = router;