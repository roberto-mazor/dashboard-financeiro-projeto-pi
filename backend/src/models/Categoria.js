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
}, {
  tableName: 'categorias',
  timestamps: false,
});

// Relacionamento: Categoria pertence a um Usuário
Categoria.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Categoria.hasMany(require('./Transacao'), { foreignKey: 'id_categoria' });

module.exports = Categoria;