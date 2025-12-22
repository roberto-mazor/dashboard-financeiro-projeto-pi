// src/config/db.js
const { Sequelize } = require('sequelize'); // Única declaração permitida

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Essencial para Neon na Vercel
    }
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados Neon estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
    return false;
  }
};

module.exports = { sequelize, testConnection };