import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // 1. Hooks de Estado (Sempre no topo da função)
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState({ entradas: 0, saidas: 0, saldo: 0 });
  const [listaTransacoes, setListaTransacoes] = useState([]);

  // 2. Lógica do Usuário
  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : { nome: 'Usuário' };
  

  // 3. Hook de Efeito para buscar dados da API
 useEffect(() => {
  const carregarDados = async () => {
    try {
      const resResumo = await api.get('/dashboard/resumo');
      setResumo(resResumo.data);

      const resLista = await api.get('/transacoes'); // Rota que busca todas
      setListaTransacoes(resLista.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };
  carregarDados();
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', color: '#2c3e50' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ecf0f1', marginBottom: '20px', paddingBottom: '10px' },
    logoutBtn: { padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Dashboard Financeiro</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Olá, <strong>{user.nome || 'Usuário'}</strong></span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#d5f5e3', borderRadius: '8px' }}>
          <h3>Entradas</h3>
          <p>R$ {resumo.entradas?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div style={{ padding: '20px', background: '#fadbd8', borderRadius: '8px' }}>
          <h3>Saídas</h3>
          <p>R$ {resumo.saidas?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div style={{ padding: '20px', background: '#d6eaf8', borderRadius: '8px' }}>
          <h3>Saldo Total</h3>
          <p>R$ {resumo.saldo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Valor</th>
            </tr>
        </thead>
        <tbody>
            {listaTransacoes.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 0' }}>{t.descricao}</td>
                <td>{t.categoria?.nome}</td>
                <td>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                <td style={{ color: t.categoria?.tipo === 'receita' ? '#27ae60' : '#e74c3c' }}>
                {t.categoria?.tipo === 'receita' ? '+' : '-'} R$ {parseFloat(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
            </tr>
            ))}
        </tbody>
    </table>

      <section style={{ marginTop: '40px' }}>
        <h2>Últimas Transações</h2>
        <p>Dados vindos de: {import.meta.env.VITE_API_URL}</p>
      </section>
    </div>
  );
  
};



export default Dashboard;