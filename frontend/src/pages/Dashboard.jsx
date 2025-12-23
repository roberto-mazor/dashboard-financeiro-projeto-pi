import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : { nome: 'Usuário' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'sans-serif',
      color: '#2c3e50'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #ecf0f1',
      marginBottom: '20px',
      paddingBottom: '10px'
    },
    logoutBtn: {
      padding: '8px 16px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
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
          <p>R$ 0,00</p>
        </div>
        <div style={{ padding: '20px', background: '#fadbd8', borderRadius: '8px' }}>
          <h3>Saídas</h3>
          <p>R$ 0,00</p>
        </div>
        <div style={{ padding: '20px', background: '#d6eaf8', borderRadius: '8px' }}>
          <h3>Saldo Total</h3>
          <p>R$ 0,00</p>
        </div>
      </div>

      <section style={{ marginTop: '40px' }}>
        <h2>Últimas Transações</h2>
        <p>As transações do banco Neon aparecerão aqui em breve...</p>
      </section>
    </div>
  );
};

export default Dashboard;