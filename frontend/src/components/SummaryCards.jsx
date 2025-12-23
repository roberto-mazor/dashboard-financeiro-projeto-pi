import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SummaryCards = ({ resumo }) => {
  const { theme } = useTheme();

  const cardStyle = {
    padding: '20px',
    borderRadius: '12px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px', 
      marginBottom: '40px' 
    }}>
      {/* Card Entradas */}
      <div style={{ ...cardStyle, backgroundColor: theme.cardEntrada }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '500', opacity: 0.9 }}>Entradas</span>
          <ArrowUpCircle size={24} />
        </div>
        <h2 style={{ fontSize: '28px', margin: 0 }}>
          R$ {resumo.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>
      </div>

      {/* Card Saídas */}
      <div style={{ ...cardStyle, backgroundColor: theme.cardSaida }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '500', opacity: 0.9 }}>Saídas</span>
          <ArrowDownCircle size={24} />
        </div>
        <h2 style={{ fontSize: '28px', margin: 0 }}>
          R$ {resumo.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>
      </div>

      {/* Card Saldo Total */}
      <div style={{ ...cardStyle, backgroundColor: theme.cardSaldo }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '500', opacity: 0.9 }}>Saldo Total</span>
          <DollarSign size={24} />
        </div>
        <h2 style={{ fontSize: '28px', margin: 0 }}>
          R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>
      </div>
    </div>
  );
};

export default SummaryCards;