// backend/server.js

// 1. IMPORTANTE: Carregar o driver pg antes de tudo para evitar o erro "install pg manually / Erro na vercel"
require('pg'); 

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/db');

// Importar dotenv apenas para ambiente local
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const transacaoRoutes = require('./src/routes/transacaoRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const cartaoRoutes = require('./src/routes/cartaoRoutes');


// Models
require('./src/models/Usuario');
require('./src/models/Categoria');
require('./src/models/Transacao');
require('./src/models/Cartao');

const app = express();

// CONFIGURAR O CORS
app.use(cors({
  origin: '*', // Permite qualquer origem (ideal para desenvolvimento)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

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
app.use('/api/cartoes', cartaoRoutes);

// Configuração de Inicialização para ambiente LOCAL
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    const startServer = async () => {
        try {
            const isConnected = await sequelize.authenticate();
            console.log(' Conexão com o banco de dados estabelecida com sucesso.');
            if (isConnected) {
                await sequelize.sync({ alter: true });
                console.log('✅ Tabelas sincronizadas localmente.');
                app.listen(PORT, () => {
                    console.log(` Servidor rodando em http://localhost:${PORT}`);
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