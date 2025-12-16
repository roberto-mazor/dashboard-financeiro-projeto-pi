// backend/server.js

// Importações necessárias
const express = require('express');
const dotenv = require('dotenv');
// Importar o módulo 'path' para resolver caminhos de arquivos
const path = require('path'); 

dotenv.config({ path: path.resolve(__dirname, '.env') }); 

const { testConnection } = require('./src/config/db'); 

const app = express();
// Se o carregamento do .env falhar por algum motivo, ele usará a porta 3001
const PORT = process.env.PORT || 3001; 

// Middlewares
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.send('API do Dashboard Financeiro em execução!');
});

// Testa a conexão e inicia o servidor
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}).catch(error => {
    // Se a conexão falhar, o servidor não inicia
    console.error("Falha ao iniciar o servidor devido ao erro de conexão:", error);
});

const { sequelize, testConnection } = require('./src/config/db');

// Importação dos modelos para que o Sequelize os conheça antes do sync
require('./src/models/Usuario');
require('./src/models/Categoria');
require('./src/models/Transacao');

testConnection().then(async () => {
    // alter: true tenta atualizar as tabelas se você mudar o código sem apagar os dados
    await sequelize.sync({ alter: true }); 
    console.log('✅ Tabelas sincronizadas com o banco de dados.');
    
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
});