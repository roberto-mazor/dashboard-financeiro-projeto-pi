
const { Sequelize } = require('sequelize');


// Usa a variável DATABASE_URL do .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
  },
  logging: false,
});

// Função para testar a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados Neon estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados Neon:', error.message);
    return false;
  }
}

module.exports = { sequelize, testConnection };