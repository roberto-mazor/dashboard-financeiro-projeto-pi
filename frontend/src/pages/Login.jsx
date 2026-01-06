import { useState, useEffect } from 'react'; // useEffect para o wake-up call
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Sparkles, UserPlus } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Wake-up Call para acordar o Neon PostgreSQL
  useEffect(() => {
    const acordarBanco = async () => {
      try {
        // Tenta uma chamada simples para reduzir o impacto do Cold Start
        await api.get('/auth/health').catch(() => null); 
        console.log("Wake-up call enviado: acordando banco de dados...");
      } catch (e) {
      }
    };

    acordarBanco();
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      // Armazenamento de credenciais no navegador
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard');
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao conectar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  // Preenchimento automático para facilitar a avaliação do recrutador
  const handleRecrutadorDemo = () => {
    setEmail('recrutador@demo.com');
    setSenha('123456');
  };

  return (
    <div 
      className="flex flex-col items-center justify-center flex-1 w-full min-h-screen p-4 transition-colors duration-300"
      style={{ backgroundColor: theme?.background }}
    >
      {/* Botão de Troca de Tema */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2.5 rounded-full border transition-all active:scale-90 shadow-sm z-50"
        style={{ 
          backgroundColor: theme?.surface, 
          borderColor: theme?.border,
          color: theme?.text 
        }}
      >
        {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-500" />}
      </button>

      <div 
        className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl border transition-all animate-in fade-in zoom-in duration-300"
        style={{ backgroundColor: theme?.surface, borderColor: theme?.border }}
      >
        <header className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: theme?.text }}>
            Dashboard Financeiro
          </h2>
          <p className="text-sm mt-2 opacity-80" style={{ color: theme?.textSecondary }}>
            Gestão inteligente de finanças pessoais
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: theme?.textSecondary }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-base"
              style={{ backgroundColor: theme?.inputBg, color: theme?.text, borderColor: theme?.border }}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: theme?.textSecondary }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-base"
              style={{ backgroundColor: theme?.inputBg, color: theme?.text, borderColor: theme?.border }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-50 flex justify-center items-center gap-2"
            style={{ backgroundColor: '#bb86fc' }}
          >
            {loading ? 'Validando...' : 'Acessar Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700/20 flex flex-col items-center gap-4">
          
          <button 
            onClick={handleRecrutadorDemo}
            className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: '#bb86fc' }}
          >
            <Sparkles size={16} />
            Preencher dados de teste (Recrutador)
          </button>

          <div className="text-sm flex flex-col items-center gap-1" style={{ color: theme?.textSecondary }}>
            <span>Novo por aqui?</span>
            <Link 
              to="/register" 
              className="font-bold flex items-center gap-1 hover:underline"
              style={{ color: theme?.text }}
            >
              <UserPlus size={16} />
              Criar uma conta nova
            </Link>
          </div>

          <div className="mt-2 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold" style={{ color: theme?.text }}>
              Powered by Neon PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;