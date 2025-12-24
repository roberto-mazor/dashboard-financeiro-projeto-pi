import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

// Importação dos subcomponentes
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';

const Dashboard = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
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

  // Ações de Categoria
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

  // NOVA FUNÇÃO: Atualizar Nome da Categoria
  const handleUpdateCategoria = async (id, novoNome) => {
    try {
      await api.put(`/categorias/${id}`, { nome: novoNome });
      mostrarFeedback('Categoria renomeada!', 'sucesso');
      carregarDados(); // Recarrega para atualizar a tabela e o form
      return true;
    } catch (error) {
      mostrarFeedback('Erro ao atualizar categoria', 'erro');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300 flex flex-col"
      style={{ backgroundColor: theme.background }}
    >
      <div className="w-full max-w-300 mx-auto p-4 sm:p-8 flex-1">
        
        {/* Header Responsivo */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: theme.text }}>
            Dashboard Financeiro
          </h1>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
            >
              {isDarkMode ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-slate-500" />}
            </button>

            <span className="text-sm sm:text-base" style={{ color: theme.text }}>
              Olá, <strong className="font-semibold">{user.nome}</strong>
            </span>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Feedback Alert */}
        {feedback.mensagem && (
          <div 
            className={`p-4 mb-6 rounded-xl text-center font-bold border transition-all animate-in fade-in slide-in-from-top-2`}
            style={{
              backgroundColor: feedback.tipo === 'sucesso' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              color: feedback.tipo === 'sucesso' ? '#10b981' : '#f43f5e',
              borderColor: feedback.tipo === 'sucesso' ? '#10b981' : '#f43f5e'
            }}
          >
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
          onUpdateCategoria={handleUpdateCategoria} // Passando a nova função
        />

        <TransactionTable 
          transacoes={transacoes} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default Dashboard;