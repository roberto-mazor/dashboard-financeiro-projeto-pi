import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, Sun, Moon } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast'; // lib de alertas

const Register = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // O caminho deve ser /auth/register para bater com seu authRoutes.js
      await api.post('/auth/register', { nome, email, senha });
      
      toast.success('Conta criada com sucesso!'); 
      navigate('/login');
    } catch (error) {
      const msgErro = error?.response?.data?.error || 'Erro ao criar conta.';
      toast.error(msgErro);
      console.error('Erro no registro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4 transition-all duration-300" 
      style={{ backgroundColor: theme?.background }}
    >
      {/* Botão de Tema */}
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
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl border animate-in fade-in zoom-in duration-300" 
        style={{ backgroundColor: theme?.surface, borderColor: theme?.border }}
      >
        <header className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: theme?.text }}>
            Criar Nova Conta
          </h2>
          <p className="text-sm mt-2 opacity-70" style={{ color: theme?.textSecondary }}>
            Junte-se a nós e organize suas finanças
          </p>
        </header>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: theme?.textSecondary }}>Nome</label>
            <input
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              style={{ backgroundColor: theme?.inputBg, color: theme?.text, borderColor: theme?.border }}
              placeholder="Como deseja ser chamado?"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: theme?.textSecondary }}>E-mail</label>
            <input
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              style={{ backgroundColor: theme?.inputBg, color: theme?.text, borderColor: theme?.border }}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: theme?.textSecondary }}>Senha</label>
            <input
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              style={{ backgroundColor: theme?.inputBg, color: theme?.text, borderColor: theme?.border }}
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl font-bold text-white shadow-lg flex justify-center items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            style={{ backgroundColor: '#bb86fc' }}
          >
            {loading ? 'Criando conta...' : <><UserPlus size={18} /> Finalizar Cadastro</>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700/20 text-center">
          <Link 
            to="/login" 
            className="text-sm font-medium flex items-center justify-center gap-2 hover:underline transition-colors" 
            style={{ color: theme?.text }}
          >
            <ArrowLeft size={16} /> Já tenho uma conta? Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;