import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, PlusCircle, ArrowUpCircle, ArrowDownCircle, 
  DollarSign, Edit, Trash2, CheckCircle, XCircle 
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Estados para dados
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0 });
  
  // Estado para Feedback Visual
  const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });

  // Estados para Nova Categoria
  const [mostraFormCategoria, setMostraFormCategoria] = useState(false);
  const [novoNomeCategoria, setNovoNomeCategoria] = useState('');
  const [tipoCategoria, setTipoCategoria] = useState('despesa');

  // Estado para o formulário de Transação
  const [form, setForm] = useState({
    id_transacao: null, 
    descricao: '',
    valor: '',
    id_categoria: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Lógica do Usuário
  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : { nome: 'Usuário' };

  // Função para exibir alertas que somem sozinhos
  const mostrarFeedback = (msg, tipo) => {
    setFeedback({ mensagem: msg, tipo });
    setTimeout(() => setFeedback({ mensagem: '', tipo: '' }), 3000);
  };

  const carregarDados = async () => {
    try {
      const [resResumo, resLista, resCats] = await Promise.all([
        api.get('/dashboard/resumo'),
        api.get('/transacoes'),
        api.get('/categorias')
      ]);
      
      setResumo(resResumo.data);
      setTransacoes(resLista.data);
      setCategorias(resCats.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      mostrarFeedback('Erro ao carregar dados do servidor', 'erro');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddCategoria = async () => {
    if (!novoNomeCategoria) return mostrarFeedback("Digite o nome da categoria", "erro");
    try {
      const response = await api.post('/categorias', { 
        nome: novoNomeCategoria, 
        tipo: tipoCategoria 
      });
      setCategorias([...categorias, response.data]);
      setForm({ ...form, id_categoria: response.data.id_categoria });
      setNovoNomeCategoria('');
      setMostraFormCategoria(false);
      mostrarFeedback('Categoria criada com sucesso!', 'sucesso');
    } catch (error) {
      mostrarFeedback("Erro ao criar categoria", "erro");
    }
  };

  const handleSaveTransacao = async (e) => {
    e.preventDefault();
    try {
      if (form.id_transacao) {
        await api.put(`/transacoes/${form.id_transacao}`, form);
        mostrarFeedback('Transação atualizada!', 'sucesso');
      } else {
        await api.post('/transacoes', form);
        mostrarFeedback('Lançamento realizado!', 'sucesso');
      }
      setForm({ id_transacao: null, descricao: '', valor: '', id_categoria: '', data: new Date().toISOString().split('T')[0] });
      carregarDados();
    } catch (error) {
      mostrarFeedback('Erro ao salvar transação', 'erro');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta transação?')) {
      try {
        await api.delete(`/transacoes/${id}`);
        mostrarFeedback('Transação removida!', 'sucesso');
        carregarDados();
      } catch (error) {
        mostrarFeedback('Erro ao excluir transação', 'erro');
      }
    }
  };

  const handleEdit = (t) => {
    setForm({
      id_transacao: t.id_transacao,
      descricao: t.descricao,
      valor: t.valor,
      id_categoria: t.id_categoria,
      data: t.data.split('T')[0]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' },
    card: { padding: '20px', borderRadius: '12px', color: 'white', display: 'flex', flexDirection: 'column', gap: '10px' },
    feedback: {
      padding: '15px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold',
      backgroundColor: feedback.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2',
      color: feedback.tipo === 'sucesso' ? '#166534' : '#991b1b',
      border: `1px solid ${feedback.tipo === 'sucesso' ? '#166534' : '#991b1b'}`,
    },
    formContainer: { marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px' },
    form: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1, minWidth: '150px' },
    button: { padding: '10px 20px', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' },
    tableSection: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard Financeiro</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Olá, <strong>{user.nome}</strong></span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11d48' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Alerta de Feedback */}
      {feedback.mensagem && (
        <div style={styles.feedback}>{feedback.mensagem}</div>
      )}

      {/* Cards de Resumo */}
      <div style={styles.grid}>
        <div style={{ ...styles.card, backgroundColor: '#10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Entradas</span> <ArrowUpCircle /></div>
          <h2 style={{ fontSize: '28px' }}>R$ {resumo.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#f43f5e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Saídas</span> <ArrowDownCircle /></div>
          <h2 style={{ fontSize: '28px' }}>R$ {resumo.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Saldo Total</span> <DollarSign /></div>
          <h2 style={{ fontSize: '28px' }}>R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
        </div>
      </div>

      {/* Formulário de Cadastro/Edição */}
      <section style={styles.formContainer}>
        <h3 style={{ marginBottom: '15px' }}>{form.id_transacao ? 'Editar Transação' : 'Nova Transação'}</h3>
        <form onSubmit={handleSaveTransacao} style={styles.form}>
          <input style={styles.input} type="text" placeholder="Descrição" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} required />
          <input style={styles.input} type="number" step="0.01" placeholder="Valor" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} required />
          <input style={styles.input} type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})} required />
          
          <div style={{ display: 'flex', gap: '5px', flex: 1, minWidth: '200px' }}>
            <select style={styles.input} value={form.id_categoria} onChange={e => setForm({...form, id_categoria: e.target.value})} required>
              <option value="">Categoria...</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome} ({cat.tipo})</option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={() => setMostraFormCategoria(!mostraFormCategoria)}
              style={{ ...styles.button, backgroundColor: '#6366f1', padding: '10px' }}
              title="Criar Categoria"
            >
              <PlusCircle size={20} />
            </button>
          </div>

          <button type="submit" style={{ ...styles.button, backgroundColor: form.id_transacao ? '#f59e0b' : '#2563eb' }}>
            {form.id_transacao ? <><CheckCircle size={20} /> Atualizar</> : <><PlusCircle size={20} /> Adicionar</>}
          </button>
        </form>

        {mostraFormCategoria && (
          <div style={{ marginTop: '15px', padding: '15px', border: '1px dashed #6366f1', borderRadius: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input style={styles.input} placeholder="Nome da categoria" value={novoNomeCategoria} onChange={e => setNovoNomeCategoria(e.target.value)} />
            <select style={{ ...styles.input, maxWidth: '150px' }} value={tipoCategoria} onChange={e => setTipoCategoria(e.target.value)}>
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
            <button type="button" onClick={handleAddCategoria} style={{ ...styles.button, backgroundColor: '#6366f1' }}>Salvar Categoria</button>
            <button type="button" onClick={() => setMostraFormCategoria(false)} style={{ ...styles.button, backgroundColor: '#94a3b8' }}><XCircle size={18}/></button>
          </div>
        )}
      </section>

      {/* Tabela de Transações */}
      <section style={styles.tableSection}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Histórico de Transações</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '12px 15px' }}>Descrição</th>
                <th style={{ padding: '12px 15px' }}>Categoria</th>
                <th style={{ padding: '12px 15px' }}>Data</th>
                <th style={{ padding: '12px 15px', textAlign: 'right' }}>Valor</th>
                <th style={{ padding: '12px 15px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map(t => {
                const isEntrada = t.categoria?.tipo?.toLowerCase() === 'receita';
                return (
                  <tr key={t.id_transacao} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px 15px', color: '#1e293b', fontWeight: '500' }}>{t.descricao}</td>
                    <td style={{ padding: '16px 15px' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#475569' }}>
                        {t.categoria?.nome || 'Geral'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 15px', color: '#64748b' }}>
                      {new Date(t.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </td>
                    <td style={{ padding: '16px 15px', textAlign: 'right', fontWeight: 'bold', color: isEntrada ? '#10b981' : '#f43f5e' }}>
                      {isEntrada ? '+ ' : '- '} R$ {Math.abs(parseFloat(t.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '16px 15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button onClick={() => handleEdit(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={18}/></button>
                        <button onClick={() => handleDelete(t.id_transacao)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;