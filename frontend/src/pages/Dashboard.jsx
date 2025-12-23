import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import api from '../services/api';

// Importação dos subcomponentes
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Estados de Dados
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0 });
  
  // Estados de Interface
  const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });
  const [form, setForm] = useState({
    id_transacao: null, 
    descricao: '',
    valor: '',
    id_categoria: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Dados do Usuário
  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : { nome: 'Usuário' };

  // Helper para alertas
  const mostrarFeedback = (msg, tipo) => {
    setFeedback({ mensagem: msg, tipo });
    setTimeout(() => setFeedback({ mensagem: '', tipo: '' }), 3000);
  };

  // Busca principal de dados
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
      mostrarFeedback('Erro de conexão com o servidor', 'erro');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Ações de Transação
  const handleSaveTransacao = async (e) => {
    e.preventDefault();
    try {
      if (form.id_transacao) {
        await api.put(`/transacoes/${form.id_transacao}`, form);
        mostrarFeedback('Transação atualizada!', 'sucesso');
      } else {
        await api.post('/transacoes', form);
        mostrarFeedback('Lançamento realizado com sucesso!', 'sucesso');
      }
      setForm({ id_transacao: null, descricao: '', valor: '', id_categoria: '', data: new Date().toISOString().split('T')[0] });
      carregarDados();
    } catch (error) {
      mostrarFeedback('Erro ao processar operação', 'erro');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir este registro?')) {
      try {
        await api.delete(`/transacoes/${id}`);
        mostrarFeedback('Registro removido', 'sucesso');
        carregarDados();
      } catch (error) {
        mostrarFeedback('Erro ao excluir', 'erro');
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

  // Ação de Categoria (passada para o TransactionForm)
  const handleAddCategoria = async (nome, tipo) => {
    try {
      const response = await api.post('/categorias', { nome, tipo });
      setCategorias([...categorias, response.data]);
      setForm(prev => ({ ...prev, id_categoria: response.data.id_categoria }));
      mostrarFeedback('Nova categoria disponível!', 'sucesso');
      return true;
    } catch (error) {
      mostrarFeedback('Erro ao criar categoria', 'erro');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard Financeiro</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Olá, <strong>{user.nome}</strong></span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11d48' }}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {feedback.mensagem && (
        <div style={{
          padding: '15px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold',
          backgroundColor: feedback.tipo === 'sucesso' ? '#dcfce7' : '#fee2e2',
          color: feedback.tipo === 'sucesso' ? '#166534' : '#991b1b',
          border: `1px solid ${feedback.tipo === 'sucesso' ? '#166534' : '#991b1b'}`
        }}>
          {feedback.mensagem}
        </div>
      )}

      <SummaryCards resumo={resumo} />

      <TransactionForm 
        form={form} 
        setForm={setForm} 
        categorias={categorias} 
        onSave={handleSaveTransacao} 
        onAddCategoria={handleAddCategoria} 
      />

      <TransactionTable 
        transacoes={transacoes} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default Dashboard;