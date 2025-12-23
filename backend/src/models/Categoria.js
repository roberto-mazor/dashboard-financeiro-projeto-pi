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
  
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // nome da tabela de usuários
      key: 'id'
    }
  }
}, {
  tableName: 'categorias',
  timestamps: false,
});