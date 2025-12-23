import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';

const SummaryCards = ({ resumo }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
    <div style={{ padding: '20px', borderRadius: '12px', color: 'white', backgroundColor: '#10b981' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Entradas</span> <ArrowUpCircle /></div>
      <h2 style={{ fontSize: '28px' }}>R$ {resumo.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
    </div>
    <div style={{ padding: '20px', borderRadius: '12px', color: 'white', backgroundColor: '#f43f5e' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Saídas</span> <ArrowDownCircle /></div>
      <h2 style={{ fontSize: '28px' }}>R$ {resumo.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
    </div>
    <div style={{ padding: '20px', borderRadius: '12px', color: 'white', backgroundColor: '#3b82f6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Saldo Total</span> <DollarSign /></div>
      <h2 style={{ fontSize: '28px' }}>R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
    </div>
  </div>
);

export default SummaryCards;