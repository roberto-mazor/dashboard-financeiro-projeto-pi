import { useMemo } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LineChart } from '@mui/x-charts/LineChart';

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

  // LÓGICA 1: Processamento de dados (Pizza)
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

    // --- LÓGICA 2: Evolução Diária (Linha) ---
  const dadosLinha = useMemo(() => {
    const agrupado = transacoes
      .filter(t => t.categoria?.tipo?.toLowerCase() === 'despesa')
      .reduce((acc, t) => {
        // Formata a data para remover o horário e evitar problemas de fuso
        const dataKey = t.data.split('T')[0];
        acc[dataKey] = (acc[dataKey] || 0) + Math.abs(parseFloat(t.valor));
        return acc;
      }, {});

    return Object.keys(agrupado)
      .map(data => ({
        data: new Date(data + 'T00:00:00'), // Garante o início do dia local
        valor: agrupado[data]
      }))
      .sort((a, b) => a.data - b.data);
  }, [transacoes]);

    // --- LÓGICA 3: Totais (Barras) ---
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