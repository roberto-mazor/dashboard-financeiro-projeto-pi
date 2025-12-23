import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Estados para dados
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0 });
  
  // Estado para o formulário
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    id_categoria: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Lógica do Usuário
  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : { nome: 'Usuário' };

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

  const handleAddTransacao = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transacoes', form);
      setForm({ descricao: '', valor: '', id_categoria: '', data: new Date().toISOString().split('T')[0] });
      carregarDados(); // Recarrega os dados sem dar refresh na página
    } catch (error) {
      alert('Erro ao salvar transação: ' + (error.response?.data?.error || 'Erro desconhecido'));
    }
  };

  const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' },
    card: { padding: '20px', borderRadius: '12px', color: 'white', display: 'flex', flexDirection: 'column', gap: '10px' },
    form: { display: 'flex', gap: '10px', marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', flexWrap: 'wrap' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1, minWidth: '150px' },
    button: { padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' }
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

      {/* Formulário de Cadastro */}
      <section>
        <h3 style={{ marginBottom: '15px' }}>Nova Transação</h3>
        <form onSubmit={handleAddTransacao} style={styles.form}>
          <input style={styles.input} type="text" placeholder="Descrição" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} required />
          <input style={styles.input} type="number" placeholder="Valor" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} required />
          <input style={styles.input} type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})} required />
          <select style={styles.input} value={form.id_categoria} onChange={e => setForm({...form, id_categoria: e.target.value})} required>
            <option value="">Categoria...</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome} ({cat.tipo})</option>
            ))}
          </select>
          <button type="submit" style={styles.button}>
            <PlusCircle size={20} /> Adicionar
          </button>
        </form>
      </section>

      {/* Tabela de Transações */}
      <section style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px' }}>Histórico de Transações</h3>
        <table style={styles.table}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Descrição</th>
              <th>Categoria</th>
              <th>Data</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map(t => (
              <tr key={t.id_transacao} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>{t.descricao}</td>
                <td style={{ color: '#64748b', fontSize: '14px' }}>{t.categoria?.nome || 'Sem categoria'}</td>
                <td>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', color: t.categoria?.tipo === 'receita' ? '#10b981' : '#f43f5e' }}>
                  {t.categoria?.tipo === 'receita' ? '+' : '-'} R$ {parseFloat(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;