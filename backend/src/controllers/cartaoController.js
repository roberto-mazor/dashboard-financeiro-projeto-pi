const { Cartao } = require('../config/db');

// Listar cartões
exports.listar = async (req, res) => {
  try {
    // Captura o ID do usuário de qualquer convenção usada no seu middleware de autenticação
    const idUsuario = req.id_usuario || req.userId || req.usuario?.id_usuario || req.usuario?.id;

    if (!idUsuario) {
      return res.status(401).json({ error: 'Usuário não autenticado no token.' });
    }

    const cartoes = await Cartao.findAll({
      where: { id_usuario: idUsuario },
      order: [['id_cartao', 'DESC']],
    });

    return res.status(200).json(cartoes);
  } catch (error) {
    console.error('ERRO DETALHADO AO BUSCAR CARTÕES:', error);
    return res.status(500).json({
      error: 'Erro ao buscar cartões.',
      detalhes: error.message,
    });
  }
};

// Criar cartão
exports.criar = async (req, res) => {
  try {
    const idUsuario = req.id_usuario || req.userId || req.usuario?.id_usuario || req.usuario?.id;
    const { nome, bandeira, limite_total, dia_fechamento, dia_vencimento } = req.body;

    if (!idUsuario) {
      return res.status(401).json({ error: 'Usuário não autenticado no token.' });
    }

    if (!nome || !bandeira || !limite_total || !dia_fechamento || !dia_vencimento) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const limiteNum = parseFloat(limite_total);

    const novoCartao = await Cartao.create({
      id_usuario: idUsuario,
      nome: nome.trim(),
      bandeira: bandeira.trim(),
      limite_total: limiteNum,
      limite_disponivel: limiteNum,
      dia_fechamento: parseInt(dia_fechamento, 10),
      dia_vencimento: parseInt(dia_vencimento, 10),
    });

    return res.status(201).json(novoCartao);
  } catch (error) {
    console.error('ERRO AO CRIAR CARTÃO:', error);
    return res.status(500).json({
      error: 'Erro ao criar cartão.',
      detalhes: error.message,
    });
  }
};

// Excluir cartão
exports.excluir = async (req, res) => {
  try {
    const idUsuario = req.id_usuario || req.userId || req.usuario?.id_usuario || req.usuario?.id;
    const { id } = req.params;

    const cartao = await Cartao.findOne({
      where: {
        id_cartao: id,
        id_usuario: idUsuario,
      },
    });

    if (!cartao) {
      return res.status(404).json({ error: 'Cartão não encontrado.' });
    }

    await cartao.destroy();
    return res.status(200).json({ message: 'Cartão excluído com sucesso.' });
  } catch (error) {
    console.error('ERRO AO EXCLUIR CARTÃO:', error);
    return res.status(500).json({
      error: 'Erro ao excluir cartão.',
      detalhes: error.message,
    });
  }
};