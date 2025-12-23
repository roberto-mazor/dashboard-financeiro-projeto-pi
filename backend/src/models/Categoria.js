const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
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
  // Campo explícito para evitar erros de mapeamento no INSERT
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