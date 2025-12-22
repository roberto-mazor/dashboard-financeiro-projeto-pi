
const { Sequelize } = require('sequelize');


// Usa a variável DATABASE_URL do .env
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessário para o Neon funcionar na Vercel
    }
  },
  logging: false // Opcional: limpa o console
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