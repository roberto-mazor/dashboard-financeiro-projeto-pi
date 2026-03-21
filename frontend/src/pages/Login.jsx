import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Sparkles, UserPlus, CheckCircle2, Database, Layout, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const acordarBanco = async () => {
      try {
        await api.get('/auth/health').catch(() => null);
        console.log("Wake-up call enviado...");
      } catch (e) {}
    };
    acordarBanco();
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
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

  const handleRecrutadorDemo = () => {
    setEmail('recrutador@demo.com');
    setSenha('123456');
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col lg:flex-row transition-colors duration-300"
      style={{ backgroundColor: theme?.background }}
    >
      {/* SEÇÃO ESQUERDA: INFORMAÇÕES DO PROJETO */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 space-y-8 bg-black/5 dark:bg-white/5">
        <div className="max-w-xl mx-auto lg:mx-0">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" style={{ color: theme?.text }}>
            Finance <span style={{ color: '#bb86fc' }}>Dashboard</span>
          </h1>
          <p className="text-lg opacity-80 mb-8" style={{ color: theme?.textSecondary }}>
            Projeto Integrador focado em gestão financeira pessoal com análise de dados em tempo real.
          </p>

          {/* Destaques Técnicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              { icon: <Database size={20} />, text: "PostgreSQL no Neon" },
              { icon: <ShieldCheck size={20} />, text: "Autenticação JWT" },
              { icon: <Layout size={20} />, text: "Interface com Tailwind" },
              { icon: <CheckCircle2 size={20} />, text: "Gráficos MUI X Charts" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: theme?.border, backgroundColor: theme?.surface }}>
                <span style={{ color: '#bb86fc' }}>{item.icon}</span>
                <span className="text-sm font-medium" style={{ color: theme?.text }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* ACESSO RÁPIDO PARA RECRUTADOR */}
          <div className="p-6 rounded-2xl border-2 border-dashed" style={{ borderColor: '#bb86fc', backgroundColor: 'rgba(187, 134, 252, 0.05)' }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: theme?.text }}>
              <Sparkles className="text-amber-400" size={20} /> Área do Recrutador
            </h3>
            <p className="text-sm mb-4" style={{ color: theme?.textSecondary }}>
              Use as credenciais abaixo ou clique no botão de preenchimento automático no formulário.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: theme?.textSecondary }}>E-mail:</span>
                <code className="font-bold" style={{ color: '#bb86fc' }}>recrutador@demo.com</code>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: theme?.textSecondary }}>Senha:</span>
                <code className="font-bold" style={{ color: '#bb86fc' }}>123456</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DIREITA: FORMULÁRIO DE LOGIN */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Botão de Tema fixado apenas nesta seção ou no topo da tela */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 rounded-full border shadow-sm z-50 transition-transform active:scale-90"
          style={{ backgroundColor: theme?.surface, borderColor: theme?.border, color: theme?.text }}
        >
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-500" />}
        </button>

        <div 
          className="w-full max-w-md p-8 rounded-3xl shadow-2xl border transition-all animate-in fade-in slide-in-from-right-8 duration-500"
          style={{ backgroundColor: theme?.surface, borderColor: theme?.border }}
        >
          <header className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: theme?.text }}>Bem-vindo de volta</h2>
            <p className="text-sm opacity-70" style={{ color: theme?.textSecondary }}>Entre com sua conta para continuar</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: theme?.textSecondary }}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
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
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                style={{ backgroundColor: theme?.inputBg, color: theme?.text, borderColor: theme?.border }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] hover:brightness-110 flex justify-center items-center gap-2"
              style={{ backgroundColor: '#bb86fc' }}
            >
              {loading ? 'Aguarde...' : 'Acessar Sistema'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-700/10 flex flex-col items-center gap-5">
            <button 
              onClick={handleRecrutadorDemo}
              className="flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
              style={{ color: '#bb86fc' }}
            >
              <Sparkles size={16} /> Preencher dados de teste
            </button>

            <div className="text-sm text-center" style={{ color: theme?.textSecondary }}>
              <span>Ainda não tem conta? </span>
              <Link to="/register" className="font-bold hover:underline" style={{ color: theme?.text }}>
                Criar conta agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;