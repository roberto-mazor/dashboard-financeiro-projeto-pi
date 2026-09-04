const Cartao = require('../models/Cartao');
const { Cartao, Transacao, Categoria, sequelize } = require('../config/db');

// Listar cartões
exports.listar = async (req, res) => {
  try {
    const idUsuario = req.id_usuario || req.userId || req.usuario?.id_usuario || req.usuario?.id || req.user?.id;

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
    const idUsuario = req.id_usuario || req.userId || req.usuario?.id_usuario || req.usuario?.id || req.user?.id;
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
    const idUsuario = req.id_usuario || req.userId || req.usuario?.id_usuario || req.usuario?.id || req.user?.id;
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

exports.pagarFatura = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const idUsuario = req.id_usuario || req.userId || req.usuario?.id_usuario || req.usuario?.id;
    const { id } = req.params;

    if (!idUsuario) {
      await t.rollback();
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const cartao = await Cartao.findOne({
      where: {
        id_cartao: Number(id),
        id_usuario: Number(idUsuario),
      },
      transaction: t,
    });

    if (!cartao) {
      await t.rollback();
      return res.status(404).json({ error: 'Cartão não encontrado.' });
    }

    const limiteTotal = parseFloat(cartao.limite_total) || 0;
    const limiteDisponivel = parseFloat(cartao.limite_disponivel) || 0;
    const valorFatura = parseFloat((limiteTotal - limiteDisponivel).toFixed(2));

    if (valorFatura <= 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Este cartão não possui fatura em aberto para pagar.' });
    }

    // 1. Busca ou cria uma categoria 'Pagamento de Fatura' do tipo despesa
    let categoriaFatura = await Categoria.findOne({
      where: {
        id_usuario: Number(idUsuario),
        nome: 'Pagamento de Fatura',
      },
      transaction: t,
    });

    if (!categoriaFatura) {
      categoriaFatura = await Categoria.create(
        {
          id_usuario: Number(idUsuario),
          nome: 'Pagamento de Fatura',
          tipo: 'despesa',
        },
        { transaction: t }
      );
    }

    const hoje = new Date().toISOString().split('T')[0];

    // 2. Cria o registro de despesa em conta
    await Transacao.create(
      {
        id_usuario: Number(idUsuario),
        descricao: `Pagamento Fatura - ${cartao.nome}`,
        valor: valorFatura,
        data: hoje,
        id_categoria: categoriaFatura.id_categoria || categoriaFatura.id,
        id_cartao: null, // Débito em conta, não vincula a outro cartão
      },
      { transaction: t }
    );

    // 3. Restabelece o limite do cartão
    await cartao.update(
      {
        limite_disponivel: limiteTotal,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      message: 'Fatura paga com sucesso!',
      valorPago: valorFatura,
      cartaoAtualizado: cartao,
    });
  } catch (error) {
    await t.rollback();
    console.error('ERRO AO PAGAR FATURA:', error);
    return res.status(500).json({
      error: 'Erro ao processar pagamento da fatura.',
      detalhes: error.message,
    });
  }
};