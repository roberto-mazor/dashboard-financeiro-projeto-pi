import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Sparkles, UserPlus, Database, Layout, ShieldCheck, CheckCircle2, Code2 } from 'lucide-react';
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
    setSenha('Recrut@Dash2026');
  };

  return (
    <div 
      className="min-h-screen lg:h-screen w-full flex flex-col-reverse lg:flex-row lg:overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: theme?.background }}
    >
      {/* SEÇÃO ESQUERDA: INFORMAÇÕES (Scroll apenas no Desktop) */}
      <div className="flex-1 lg:overflow-y-auto p-8 lg:p-16 bg-black/5 dark:bg-white/5 custom-scrollbar">
        <div className="max-w-xl mx-auto lg:mx-0 space-y-10">
          
          <header>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4" style={{ color: theme?.text }}>
              Finance <span style={{ color: '#bb86fc' }}>Dashboard</span>
            </h1>
            <p className="text-lg opacity-80" style={{ color: theme?.textSecondary }}>
              Projeto Integrador focado em gestão financeira pessoal com análise de dados em tempo real. <br/>
              Senac (Técnico Informatica para Internet)
            </p>
          </header>

          {/* ÁREA DO RECRUTADOR */}
          <div className="p-6 rounded-2xl border-2 border-dashed" 
               style={{ borderColor: '#bb86fc', backgroundColor: 'rgba(187, 134, 252, 0.03)' }}>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: theme?.text }}>
              <Sparkles className="text-amber-400" size={20} /> Área do Recrutador
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-purple-500/10 pb-2">
                <span style={{ color: theme?.textSecondary }}>E-mail:</span>
                <code className="font-bold" style={{ color: '#bb86fc' }}>recrutador@demo.com</code>
              </div>
              <div className="flex justify-between pt-1">
                <span style={{ color: theme?.textSecondary }}>Senha:</span>
                <code className="font-bold" style={{ color: '#bb86fc' }}>Recrut@Dash2026</code>
              </div>
            </div>
          </div>

          {/* TECNOLOGIAS UTILIZADAS */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme?.text }}>
              <Code2 size={22} className="text-purple-500" /> Tecnologias Utilizadas
            </h2>
            
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="space-y-3">
                <h4 className="font-bold uppercase text-[11px] tracking-widest opacity-50" style={{ color: theme?.text }}>Frontend</h4>
                <p style={{ color: theme?.textSecondary }}><strong>React.js (Vite):</strong> Estrutura de SPA rápida e moderna.</p>
                <p style={{ color: theme?.textSecondary }}><strong>Tailwind CSS:</strong> Estilização responsiva e temas.</p>
                <p style={{ color: theme?.textSecondary }}><strong>MUI X Charts:</strong> Visualização de dados avançada.</p>
                <p style={{ color: theme?.textSecondary }}><strong>Lucide & Axios:</strong> Ícones e consumo de API.</p>
              </div>

              <div className="space-y-3 pt-4">
                <h4 className="font-bold uppercase text-[11px] tracking-widest opacity-50" style={{ color: theme?.text }}>Backend & Infra</h4>
                <p style={{ color: theme?.textSecondary }}><strong>Node.js & Express:</strong> API REST robusta.</p>
                <p style={{ color: theme?.textSecondary }}><strong>JWT & Bcrypt:</strong> Segurança e criptografia.</p>
                <p style={{ color: theme?.textSecondary }}><strong>Sequelize (ORM):</strong> Abstração de consultas SQL.</p>
                <p style={{ color: theme?.textSecondary }}><strong>PostgreSQL (Neon.tech):</strong> Banco serverless em nuvem.</p>
              </div>
            </div>
          </section>

          {/* FUNCIONALIDADES */}
          <section className="space-y-4 pb-12">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme?.text }}>
              <CheckCircle2 size={22} className="text-emerald-500" /> Funcionalidades Principais
            </h2>
            <ul className="space-y-3 text-sm" style={{ color: theme?.textSecondary }}>
              <li className="flex gap-2">🔹 <strong>Gestão de Transações:</strong> Fluxo completo de Entradas e Saídas.</li>
              <li className="flex gap-2">🔹 <strong>Categorias:</strong> Personalização por usuário.</li>
              <li className="flex gap-2">🔹 <strong>Análise Visual:</strong> Gráficos dinâmicos e balanço mensal.</li>
              <li className="flex gap-2">🔹 <strong>Saldo Real:</strong> Monitoramento automático.</li>
            </ul>
          </section>
        </div>
      </div>

      {/* SEÇÃO DIREITA: LOGIN (Fixa no Desktop, Auto no Mobile) */}
      <div className="lg:w-112.5 flex items-center justify-center p-6 lg:p-12 relative shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-10">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 rounded-full border shadow-sm z-50 transition-all active:scale-90"
          style={{ backgroundColor: theme?.surface, borderColor: theme?.border, color: theme?.text }}
        >
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-500" />}
        </button>

        <div className="w-full max-w-sm p-8 rounded-3xl shadow-2xl border transition-all my-8 lg:my-0"
             style={{ backgroundColor: theme?.surface, borderColor: theme?.border }}>
          <header className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: theme?.text }}>Acessar Conta</h2>
            <p className="text-sm opacity-70" style={{ color: theme?.textSecondary }}>Finance Dashboard Project</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
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
              {loading ? 'Entrando...' : 'Entrar no Dashboard'}
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
              Novo aqui? <Link to="/register" className="font-bold hover:underline" style={{ color: theme?.text }}>Criar conta</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;