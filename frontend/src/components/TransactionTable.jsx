import { Edit, Trash2 } from 'lucide-react';

const TransactionTable = ({ transacoes, onEdit, onDelete }) => (
  <section style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <h3 style={{ marginBottom: '20px', color: '#333' }}>Histórico de Transações</h3>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '2px solid #f1f5f9' }}>
            <th style={{ padding: '12px 15px' }}>Descrição</th>
            <th style={{ padding: '12px 15px' }}>Categoria</th>
            <th style={{ padding: '12px 15px' }}>Data</th>
            <th style={{ padding: '12px 15px', textAlign: 'right' }}>Valor</th>
            <th style={{ padding: '12px 15px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map(t => {
            const isEntrada = t.categoria?.tipo?.toLowerCase() === 'receita';
            return (
              <tr key={t.id_transacao} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '16px 15px', color: '#1e293b', fontWeight: '500' }}>{t.descricao}</td>
                <td style={{ padding: '16px 15px' }}>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#475569' }}>
                    {t.categoria?.nome || 'Geral'}
                  </span>
                </td>
                <td style={{ padding: '16px 15px', color: '#64748b' }}>
                  {new Date(t.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </td>
                <td style={{ padding: '16px 15px', textAlign: 'right', fontWeight: 'bold', color: isEntrada ? '#10b981' : '#f43f5e' }}>
                  {isEntrada ? '+ ' : '- '} R$ {Math.abs(parseFloat(t.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '16px 15px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button onClick={() => onEdit(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={18}/></button>
                    <button onClick={() => onDelete(t.id_transacao)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </section>
);

export default TransactionTable;