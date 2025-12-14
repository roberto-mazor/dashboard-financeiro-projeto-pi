// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const { testConnection } = require('./src/config/db'); // Importa a função de teste

dotenv.config();
const app = express();
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
});