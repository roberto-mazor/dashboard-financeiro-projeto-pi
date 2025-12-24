import { ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SummaryCards = ({ resumo }) => {
  const { theme } = useTheme();

  // Classe base para os cards para evitar repetição
  const cardClassName = "p-5 rounded-xl text-white flex flex-col gap-2.5 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
      
      {/* Card Entradas */}
      <div 
        className={cardClassName}
        style={{ backgroundColor: theme.cardEntrada }}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium opacity-90 text-sm sm:text-base tracking-wide">Entradas</span>
          <ArrowUpCircle size={24} className="opacity-80" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold truncate">
          R$ {resumo.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>
      </div>

      {/* Card Saídas */}
      <div 
        className={cardClassName}
        style={{ backgroundColor: theme.cardSaida }}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium opacity-90 text-sm sm:text-base tracking-wide">Saídas</span>
          <ArrowDownCircle size={24} className="opacity-80" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold truncate">
          R$ {resumo.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>
      </div>

      {/* Card Saldo Total */}
      <div 
        className={`${cardClassName} md:col-span-2 lg:col-span-1`}
        style={{ backgroundColor: theme.cardSaldo }}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium opacity-90 text-sm sm:text-base tracking-wide">Saldo Total</span>
          <DollarSign size={24} className="opacity-80" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold truncate">
          R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h2>
      </div>

    </div>
  );
};

export default SummaryCards;