import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Search, Calendar } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

// Importação dos subcomponentes
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import DashboardCharts from '../components/DashboardCharts';

const Dashboard = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // --- LÓGICA DE DATAS (Mês Atual) ---
  const getPeriodoAtual = () => {
    const agora = new Date();
    // Primeiro dia do mês atual
    const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1);
    // Último dia do mês atual
    const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

    return {
      inicio: primeiroDia.toISOString().split('T')[0],
      fim: ultimoDia.toISOString().split('T')[0]
    };
  };

  const periodoPadrao = getPeriodoAtual();

  // Estados de Dados
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0 });

  // --- ESTADOS: Filtros com Mês Atual como Padrão ---
  const [filtros, setFiltros] = useState({
    data_inicio: periodoPadrao.inicio,
    data_fim: periodoPadrao.fim,
    busca: ''
  });

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

  // Carregar dados com suporte a Query Params (Filtros)
  const carregarDados = async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
      if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
      if (filtros.busca) params.append('busca', filtros.busca);

      // Importante: Note que enviamos os params também para a rota de resumo
      // para que os cards de cima (Entradas/Saídas) respeitem o filtro de data.
      const [resResumo, resLista, resCats] = await Promise.all([
        api.get(`/dashboard/resumo?${params.toString()}`), 
        api.get(`/transacoes?${params.toString()}`),
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

  // Efeito para disparar a busca com Debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      carregarDados();
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [filtros]);

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
        setForm({
    id_transacao: null,
    descricao: '',
    valor: '',
    id_categoria: '',
    data: new Date().toISOString().split('T')[0]
  })
        carregarDados();
      } catch (error) {
        mostrarFeedback('Erro ao excluir', 'erro');
      }
    }
  };

  const handleDeleteCategoria = async (id) => {
  try {
    await api.delete(`/categorias/${id}`);
    mostrarFeedback('Categoria removida!', 'sucesso');
    carregarDados(); // Recarrega para limpar a lista
  } catch (error) {
    mostrarFeedback(error.response?.data?.error || 'Erro ao excluir categoria', 'erro');
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
    window.location.href = '/dashboard/#novaTransacao'
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    
  };

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

  const handleUpdateCategoria = async (id, novoNome) => {
    try {
      await api.put(`/categorias/${id}`, { nome: novoNome });
      mostrarFeedback('Categoria renomeada!', 'sucesso');
      carregarDados();
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

        {/* --- BARRA DE FILTROS --- */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl border shadow-sm mb-8 transition-all"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} style={{ color: theme.text }} />
            <input 
              type="date" 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              style={{ borderColor: theme.border, color: theme.text }}
              value={filtros.data_inicio}
              onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
            />
            <span className="absolute -top-2 left-3 px-1 text-[10px] uppercase tracking-wider font-bold" style={{ backgroundColor: theme.surface, color: theme.text }}>Início</span>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} style={{ color: theme.text }} />
            <input 
              type="date" 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              style={{ borderColor: theme.border, color: theme.text }}
              value={filtros.data_fim}
              onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
            />
            <span className="absolute -top-2 left-3 px-1 text-[10px] uppercase tracking-wider font-bold" style={{ backgroundColor: theme.surface, color: theme.text }}>Fim</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} style={{ color: theme.text }} />
            <input 
              type="text" 
              placeholder="Pesquisar por descrição..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              style={{ borderColor: theme.border, color: theme.text }}
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
            />
          </div>
        </div>

        <SummaryCards resumo={resumo} />
        
        <DashboardCharts transacoes={transacoes} />

        <TransactionForm 
          form={form} 
          setForm={setForm} 
          categorias={categorias} 
          onSave={handleSaveTransacao} 
          onAddCategoria={handleAddCategoria}
          onUpdateCategoria={handleUpdateCategoria}
          onDeleteCategoria={handleDeleteCategoria}
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