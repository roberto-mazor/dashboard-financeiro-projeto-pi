const express = require('express');
const router = express.Router();
const cartaoController = require('../controllers/cartaoController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.use(authMiddleware);

router.get('/', cartaoController.listar);
router.post('/', cartaoController.criar);
router.delete('/:id', cartaoController.excluir);

module.exports = router;