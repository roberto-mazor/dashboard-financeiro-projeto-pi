import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao conectar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Ajuste de Viewport: 
       - Usamos h-full ou min-h-svh aliado ao flex-col no index.css para garantir
         que o conteúdo ocupe o centro exato da tela disponível.
    */
    <div 
      className="flex flex-col items-center justify-center flex-1 w-full p-4 transition-colors duration-300"
      style={{ backgroundColor: theme?.background }}
    >
      {/* Botão de Tema - Posicionamento fixo para não 'empurrar' o card no mobile */}
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

      {/* Card Principal - Max-w-md garante que não estique demais no Desktop */}
      <div 
        className="w-full max-w-[400px] p-6 sm:p-8 rounded-2xl shadow-2xl border transition-all animate-in fade-in zoom-in duration-300"
        style={{ backgroundColor: theme?.surface, borderColor: theme?.border }}
      >
        <header className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: theme?.text }}>
            Dashboard Financeiro
          </h2>
          <p className="text-sm sm:text-base mt-2 opacity-80" style={{ color: theme?.textSecondary }}>
            Faça login para continuar
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
              style={{ 
                backgroundColor: theme?.inputBg, 
                color: theme?.text, 
                borderColor: theme?.border 
              }}
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
              style={{ 
                backgroundColor: theme?.inputBg, 
                color: theme?.text, 
                borderColor: theme?.border 
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#bb86fc' }}
          >
            {loading ? 'Validando...' : 'Acessar Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;