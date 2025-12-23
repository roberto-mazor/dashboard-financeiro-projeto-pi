import { useState } from 'react';
import api from './services/api';

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      alert('Login realizado com sucesso!');
    } catch (error) {
      alert('Erro ao fazer login: ' + (error.response?.data?.message || 'Erro de conexão'));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Financeiro</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <br /><br />
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
        />
        <br /><br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default App;