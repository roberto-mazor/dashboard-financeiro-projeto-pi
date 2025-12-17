const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota protegida
router.get('/resumo', authMiddleware, dashboardController.getResumo);

module.exports = router;