const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');
const authMiddleware = require('../middleware/authMiddleware');

// Protege todas as rotas de transação
router.use(authMiddleware);

router.post('/', transacaoController.criarTransacao);
router.get('/', transacaoController.listarTransacoes);
router.delete('/:id', transacaoController.deletarTransacao);

module.exports = router;