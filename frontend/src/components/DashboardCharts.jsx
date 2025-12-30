import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const DashboardCharts = ({ transacoes }) => {
  const { theme, isDarkMode } = useTheme();

  // Cria um tema do MUI que sincroniza com o seu modo Dark/Light
  const muiTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      text: {
        primary: theme.text,
      },
    },
  });

  // Processamento de dados
  const despesasPorCategoria = transacoes
    .filter(t => t.categoria?.tipo?.toLowerCase() === 'despesa')
    .reduce((acc, t) => {
      const catNome = t.categoria?.nome || 'Geral';
      const valor = Math.abs(parseFloat(t.valor));
      const existente = acc.find(item => item.label === catNome);
      if (existente) existente.value += valor;
      else acc.push({ label: catNome, value: valor });
      return acc;
    }, [])
    .map((item, index) => ({ id: index, value: item.value, label: item.label }));

  const totalEntradas = transacoes
    .filter(t => t.categoria?.tipo?.toLowerCase() === 'receita')
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  const totalSaidas = transacoes
    .filter(t => t.categoria?.tipo?.toLowerCase() === 'despesa')
    .reduce((acc, t) => acc + Math.abs(parseFloat(t.valor)), 0);

  return (
    <ThemeProvider theme={muiTheme}>
      {/* O CssBaseline ajuda a normalizar as cores internas dos componentes MUI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Gráfico de Pizza */}
        <div 
          className="p-6 rounded-xl border shadow-sm transition-all" 
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <h4 className="text-lg font-bold mb-6" style={{ color: theme.text }}>Distribuição de Despesas</h4>
          <PieChart
            series={[{
              data: despesasPorCategoria,
              innerRadius: 40,
              outerRadius: 100,
              cx: 120,
            }]}
            height={300}
            // componente lerá as cores do muiTheme automaticamente
          />
        </div>

        {/* Gráfico de Barras */}
        <div 
          className="p-6 rounded-xl border shadow-sm transition-all" 
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <h4 className="text-lg font-bold mb-6" style={{ color: theme.text }}>Entradas vs Saídas</h4>
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['Resumo'] }]}
            series={[
              { data: [totalEntradas], label: 'Entradas', color: '#10b981' },
              { data: [totalSaidas], label: 'Saídas', color: '#f43f5e' },
            ]}
            height={300}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DashboardCharts;