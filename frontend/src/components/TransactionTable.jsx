import { Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const TransactionTable = ({ transacoes, onEdit, onDelete }) => {
  const { theme } = useTheme();

  return (
    <section 
      className="p-5 rounded-xl shadow-md transition-all duration-300 border"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        Histórico de Transações
      </h3>
      
      {/* Container com scroll horizontal para Mobile */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse min-w-150">
          <thead>
            <tr 
              className="text-left border-b-2" 
              style={{ color: theme.textSecondary, borderColor: theme.border }}
            >
              <th className="p-3.5 font-semibold text-sm">Descrição</th>
              <th className="p-3.5 font-semibold text-sm">Categoria</th>
              <th className="p-3.5 font-semibold text-sm">Data</th>
              <th className="p-3.5 font-semibold text-sm text-right">Valor</th>
              <th className="p-3.5 font-semibold text-sm text-center">Ações</th>
            </tr>
          </thead>
          
          <tbody className="divide-y" style={{ divideColor: theme.border }}>
            {transacoes.map((t) => {
              const isEntrada = t.categoria?.tipo?.toLowerCase() === 'receita';
              
              return (
                <tr 
                  key={t.id_transacao} 
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ borderBottom: `1px solid ${theme.border}` }}
                >
                  <td className="p-4 font-medium text-sm" style={{ color: theme.text }}>
                    {t.descricao}
                  </td>
                  
                  <td className="p-4">
                    <span 
                      className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border"
                      style={{ 
                        backgroundColor: theme.background, 
                        color: theme.textSecondary, 
                        borderColor: theme.border 
                      }}
                    >
                      {t.categoria?.nome || 'Geral'}
                    </span>
                  </td>
                  
                  <td className="p-4 text-sm" style={{ color: theme.textSecondary }}>
                    {new Date(t.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </td>
                  
                  <td 
                    className="p-4 text-sm font-bold text-right" 
                    style={{ color: isEntrada ? '#10b981' : '#f43f5e' }}
                  >
                    {isEntrada ? '+ ' : '- '} 
                    R$ {Math.abs(parseFloat(t.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => onEdit(t)} 
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-all active:scale-90"
                        title="Editar"
                      >
                        <Edit size={18}/>
                      </button>
                      
                      <button 
                        onClick={() => onDelete(t.id_transacao)} 
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                        title="Excluir"
                      >
                        <Trash2 size={18}/>
                      </button>
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
};

export default TransactionTable;