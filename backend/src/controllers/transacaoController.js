const { Op } = require('sequelize');
const { Transacao, Categoria, Cartao, sequelize } = require('../config/db');

// 1. CRIAR TRANSAÇÃO (com suporte a Cartão de Crédito e abatimento de limite)
exports.criarTransacao = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id_usuario = req.usuario?.id || req.usuario?.id_usuario || req.id_usuario || req.userId;
        const { valor, data, descricao, id_categoria, id_cartao } = req.body;

        if (!id_usuario) {
            await t.rollback();
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        if (!valor || !descricao || !id_categoria) {
            await t.rollback();
            return res.status(400).json({ error: 'Preencha valor, descrição e categoria.' });
        }

        // Valida se a categoria existe e pertence ao usuário para saber se é 'receita' ou 'despesa'
        const categoria = await Categoria.findOne({
            where: { id_categoria, id_usuario },
            transaction: t,
        });

        if (!categoria) {
            await t.rollback();
            return res.status(404).json({ error: 'Categoria não encontrada ou não pertence ao usuário.' });
        }

        const valorNum = parseFloat(valor);
        const dataFinal = data || new Date().toISOString().split('T')[0];
        const tipoCategoria = String(categoria.tipo || '').toLowerCase();

        // Cria a transação
        const novaTransacao = await Transacao.create(
            {
                valor: valorNum,
                data: dataFinal,
                descricao: descricao.trim(),
                id_categoria,
                id_usuario,
                id_cartao: id_cartao ? Number(id_cartao) : null,
            },
            { transaction: t }
        );

        // Se for despesa vinculada a um cartão, abate o limite disponível
        if (tipoCategoria.includes('desp') && id_cartao) {
            const cartao = await Cartao.findOne({
                where: { id_cartao: Number(id_cartao), id_usuario },
                transaction: t,
            });

            if (cartao) {
                const limiteAtual = Number(cartao.limite_disponivel);
                const novoLimiteDisp = Math.max(0, limiteAtual - valorNum);
                await cartao.update({ limite_disponivel: novoLimiteDisp }, { transaction: t });
            }
        }

        await t.commit();
        return res.status(201).json(novaTransacao);
    } catch (error) {
        await t.rollback();
        console.error('Erro ao registrar transação:', error);
        return res.status(500).json({ error: 'Erro ao registrar transação.', detalhes: error.message });
    }
};

// 2. LISTAR TRANSAÇÕES (com inclusão dos dados do cartão e da categoria)
exports.listarTransacoes = async (req, res) => {
    try {
        const id_usuario = req.usuario?.id || req.usuario?.id_usuario || req.id_usuario || req.userId;
        const { data_inicio, data_fim, busca } = req.query;

        if (!id_usuario) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        let onde = { id_usuario };

        // Filtro por busca textual (ignora data para facilidade de busca global)
        if (busca) {
            onde.descricao = { [Op.iLike]: `%${busca}%` };
        } else if (data_inicio && data_fim) {
            onde.data = { [Op.between]: [data_inicio, data_fim] };
        }

        const transacoes = await Transacao.findAll({
            where: onde,
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nome', 'tipo', 'status'],
                },
                {
                    model: Cartao,
                    as: 'cartao',
                    attributes: ['id_cartao', 'nome', 'bandeira'],
                    required: false,
                },
            ],
            order: [
                ['data', 'DESC'],
                ['id_transacao', 'DESC'],
            ],
        });

        return res.json(transacoes);
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        return res.status(500).json({ error: 'Erro ao buscar transações.', detalhes: error.message });
    }
};

// 3. DELETAR TRANSAÇÃO (estorna o valor de volta ao limite se for cartão)
exports.deletarTransacao = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const id_usuario = req.usuario?.id || req.usuario?.id_usuario || req.id_usuario || req.userId;

        const transacao = await Transacao.findOne({
            where: { id_transacao: id, id_usuario },
            transaction: t,
        });

        if (!transacao) {
            await t.rollback();
            return res.status(404).json({ error: 'Transação não encontrada.' });
        }

        // Se estava vinculada a um cartão, devolve o valor ao limite disponível
        if (transacao.id_cartao) {
            const cartao = await Cartao.findOne({
                where: { id_cartao: transacao.id_cartao, id_usuario },
                transaction: t,
            });

            if (cartao) {
                const limiteRestaurado = Number(cartao.limite_disponivel) + Number(transacao.valor);
                const limiteMaximo = Number(cartao.limite_total);
                // Não ultrapassa o limite total contratado
                const limiteFinal = Math.min(limiteRestaurado, limiteMaximo);
                await cartao.update({ limite_disponivel: limiteFinal }, { transaction: t });
            }
        }

        await transacao.destroy({ transaction: t });
        await t.commit();

        return res.json({ message: 'Transação removida com sucesso!' });
    } catch (error) {
        await t.rollback();
        console.error('Erro ao remover transação:', error);
        return res.status(500).json({ error: 'Erro ao remover transação.', detalhes: error.message });
    }
};

// 4. EDITAR TRANSAÇÃO (ajusta categoria, valor e data com integridade)
exports.editarTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { valor, data, descricao, id_categoria, id_cartao } = req.body;
        const id_usuario = req.usuario?.id || req.usuario?.id_usuario || req.id_usuario || req.userId;

        const transacao = await Transacao.findOne({
            where: { id_transacao: id, id_usuario },
        });

        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada.' });
        }

        if (id_categoria) {
            const categoriaExistente = await Categoria.findOne({
                where: { id_categoria, id_usuario },
            });
            if (!categoriaExistente) {
                return res.status(404).json({ error: 'Nova categoria não encontrada.' });
            }
            transacao.id_categoria = id_categoria;
        }

        if (valor !== undefined) transacao.valor = parseFloat(valor);
        if (data) transacao.data = data;
        if (descricao) transacao.descricao = descricao.trim();
        if (id_cartao !== undefined) transacao.id_cartao = id_cartao ? Number(id_cartao) : null;

        await transacao.save();

        return res.json({ message: 'Transação atualizada com sucesso!', transacao });
    } catch (error) {
        console.error('Erro ao editar transação:', error);
        return res.status(500).json({ error: 'Erro ao editar transação.', detalhes: error.message });
    }
};