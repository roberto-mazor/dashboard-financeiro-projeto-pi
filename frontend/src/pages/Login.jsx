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
      console.error('Erro no login:', error);
      alert(error.response?.data?.message || 'Falha ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: theme.background,
      fontFamily: 'Inter, Arial, sans-serif',
      transition: 'background-color 0.3s ease',
      position: 'relative'
    },
    themeToggle: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    card: {
      backgroundColor: theme.surface,
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 15px rgba(0,0,0,0.1)',
      width: '90%',
      maxWidth: '400px',
      transition: 'background-color 0.3s ease'
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      borderRadius: '6px',
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.inputBg,
      color: theme.text,
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '15px',
      transition: 'opacity 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      {/* Botão de Tema na Tela de Login */}
      <button onClick={toggleTheme} style={styles.themeToggle} title="Alternar Tema">
        {isDarkMode ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#64748b" />}
      </button>

      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', color: theme.text, marginBottom: '5px' }}>
          Dashboard Financeiro
        </h2>
        <p style={{ textAlign: 'center', color: theme.textSecondary, marginBottom: '25px' }}>
          Faça login para continuar
        </p>
        
        <form onSubmit={handleLogin}>
          <label style={{ color: theme.textSecondary, fontSize: '14px' }}>E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <label style={{ color: theme.textSecondary, fontSize: '14px' }}>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={styles.input}
            required
          />
          <button 
            type="submit" 
            style={{
              ...styles.button, 
              backgroundColor: loading ? theme.textSecondary : '#2ecc71',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Acessar Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;