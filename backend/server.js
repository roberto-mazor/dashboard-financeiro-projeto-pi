// backend/server.js

// 1. IMPORTANTE: Carregar o driver pg antes de tudo para evitar o erro "install pg manually"
require('pg'); 

const express = require('express');
const { sequelize, testConnection } = require('./src/config/db');

// Importar dotenv apenas para ambiente local
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const transacaoRoutes = require('./src/routes/transacaoRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Models
require('./src/models/Usuario');
require('./src/models/Categoria');
require('./src/models/Transacao');

const app = express();

// Middlewares
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
    res.send('API do Dashboard Financeiro em execução!');
});

app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Configuração de Inicialização para ambiente LOCAL
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    const startServer = async () => {
        try {
            const isConnected = await testConnection();
            if (isConnected) {
                await sequelize.sync({ alter: true });
                console.log('✅ Tabelas sincronizadas localmente.');
                app.listen(PORT, () => {
                    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
                });
            }
        } catch (error) {
            console.error("❌ Falha ao iniciar o servidor local:", error);
        }
    };
    startServer();
}

// Exportar app para a Vercel transformar em Serverless Function
module.exports = app;