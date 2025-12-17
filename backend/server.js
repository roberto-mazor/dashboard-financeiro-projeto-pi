// backend/server.js
const path = require('path'); 
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') }); 

const express = require('express');
const { sequelize, testConnection } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const transacaoRoutes = require('./src/routes/transacaoRoutes');

// Models

require('./src/models/Usuario');
require('./src/models/Categoria');
require('./src/models/Transacao');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());


// Rotas
app.get('/', (req, res) => {
    res.send('API do Dashboard Financeiro em execução!');
});

app.use('/api/auth', authRoutes);

app.use('/api/categorias', categoriaRoutes);
app.use('/api/transacoes', transacaoRoutes);


// Iniciar o servidor

const startServer = async () => {
    try {
        const isConnected = await testConnection();
        if (isConnected) {
            await sequelize.sync({ alter: true });
            console.log('✅ Tabelas sincronizadas com o banco de dados.');

            app.listen(PORT, () => {
                console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            });
        }
    } catch (error) {
        console.error("❌ Falha ao iniciar o servidor:", error);
    }
};

startServer();