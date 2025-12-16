// backend/server.js

// 1. Configuração de Variáveis de Ambiente (Deve ser a primeira coisa)
const path = require('path'); 
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') }); 

// 2. Importações de dependências
const express = require('express');
const { sequelize, testConnection } = require('./src/config/db');

// 3. Importação dos modelos (Sequelize precisa conhecê-los para o sync)
require('./src/models/Usuario');
require('./src/models/Categoria');
require('./src/models/Transacao');

// 4. Inicialização do App
const app = express();
const PORT = process.env.PORT || 3001;

// 5. Middlewares
app.use(express.json());

// 6. Rotas (Exemplo de rota de teste)
app.get('/', (req, res) => {
    res.send('API do Dashboard Financeiro em execução!');
});

// 7. Conexão com Banco de Dados e Inicialização do Servidor
const startServer = async () => {
    try {
        // Testa a conexão
        const isConnected = await testConnection();
        
        if (isConnected) {
            // Sincroniza os modelos com as tabelas do Neon
            // alter: true ajusta as tabelas sem apagar os dados existentes
            await sequelize.sync({ alter: true });
            console.log('✅ Tabelas sincronizadas com o banco de dados.');

            // Inicia o servidor apenas se o banco estiver pronto
            app.listen(PORT, () => {
                console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            });
        }
    } catch (error) {
        console.error("❌ Falha ao iniciar o servidor:", error);
    }
};

startServer();