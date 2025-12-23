const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Verifique se o caminho está correto
const Usuario = require('./Usuario');

const Categoria = sequelize.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('Receita', 'Despesa'),
    allowNull: false,
  },
  // Adicionando explicitamente para o Sequelize não se perder no INSERT
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'categorias',
  timestamps: false,
});

// Relacionamento
Categoria.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = Categoria;