const Cartao = require('../models/Cartao');

// Listar cartões do usuário logado
exports.listar = async (req, res) => {
  try {
    const usuario_id = req.userId || req.usuario?.id;

    const cartoes = await Cartao.findAll({
      where: { usuario_id },
      order: [['id_cartao', 'DESC']],
    });

    return res.status(200).json(cartoes);
  } catch (error) {
    console.error('Erro ao listar cartões:', error);
    return res.status(500).json({ error: 'Erro ao buscar cartões.' });
  }
};

// Criar novo cartão
exports.criar = async (req, res) => {
  try {
    const usuario_id = req.userId || req.usuario?.id;
    const { nome, bandeira, limite_total, dia_fechamento, dia_vencimento } = req.body;

    if (!nome || !bandeira || !limite_total || !dia_fechamento || !dia_vencimento) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const limiteNum = parseFloat(limite_total);

    const novoCartao = await Cartao.create({
      usuario_id,
      nome: nome.trim(),
      bandeira: bandeira.trim(),
      limite_total: limiteNum,
      limite_disponivel: limiteNum, // Inicia com o limite integral disponível
      dia_fechamento: parseInt(dia_fechamento, 10),
      dia_vencimento: parseInt(dia_vencimento, 10),
    });

    return res.status(201).json(novoCartao);
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar cartão.' });
  }
};

// Excluir cartão
exports.excluir = async (req, res) => {
  try {
    const usuario_id = req.userId || req.usuario?.id;
    const { id } = req.params;

    const cartao = await Cartao.findOne({
      where: { id_cartao: id, usuario_id },
    });

    if (!cartao) {
      return res.status(404).json({ error: 'Cartão não encontrado ou não pertence ao usuário.' });
    }

    await cartao.destroy();
    return res.status(200).json({ message: 'Cartão removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir cartão:', error);
    return res.status(500).json({ error: 'Erro ao excluir cartão.' });
  }
};