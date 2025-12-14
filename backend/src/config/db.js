// backend/src/config/db.js

const { Sequelize } = require('sequelize');
require('dotenv').config(); // Garante que .env seja carregado

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // Desativa logs SQL no console
  }
);

// Função para testar a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}

// Exporta a instância do Sequelize e a função de teste
module.exports = { sequelize, testConnection };