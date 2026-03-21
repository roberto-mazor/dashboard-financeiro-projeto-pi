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
  if (!transacoes || transacoes.length === 0) return [];

  // 1. Agrupamento
  const agrupado = transacoes.reduce((acc, t) => {
    // Verifica se é despesa (ajuste o filtro se sua lógica de 'tipo' for diferente)
    const ehDespesa = t.categoria?.tipo?.toLowerCase() === 'despesa' || parseFloat(t.valor) < 0;
    
    if (ehDespesa) {
      const dataStr = t.data.split('T')[0];
      const valor = Math.abs(parseFloat(t.valor));
      acc[dataStr] = (acc[dataStr] || 0) + valor;
    }
    return acc;
  }, {});

  // 2. Transformação para o Formato do Gráfico
  const resultado = Object.keys(agrupado)
    .map(dataStr => {
      const [ano, mes, dia] = dataStr.split('-').map(Number);
      return {
        data: new Date(ano, mes - 1, dia),
        valor: agrupado[dataStr]
      };
    })
    .sort((a, b) => a.data - b.data);

  console.log("DEBUG - Dados que vão para o gráfico de linha:", resultado);
  return resultado;
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
      <div className="flex flex-col gap-8 mb-8">
        
        {/* --- NOVO GRÁFICO DE LINHA (Adicione este bloco aqui) --- */}
        <div 
          className="p-6 rounded-2xl border shadow-lg transition-all" 
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <h4 className="text-lg font-bold mb-6" style={{ color: theme.text }}>
            Evolução de Gastos (Despesas)
          </h4>
          
          <div className="h-75 w-full" style={{ minWidth: 0 }}>
            {dadosLinha.length > 0 ? (
              <LineChart
                dataset={dadosLinha}
                xAxis={[{ 
                  dataKey: 'data', 
                  scaleType: 'time',
                  label: 'Dias',
                  valueFormatter: (v) => v instanceof Date ? v.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : ''
                }]}
                series={[{ 
                  dataKey: 'valor', 
                  label: 'Total Gasto (R$)', 
                  color: '#8b5cf6', 
                  area: true,
                  showMark: true
                }]}
                height={300}
                margin={{ left: 70, right: 30, top: 30, bottom: 50 }}
                slotProps={{
                  legend: { labelStyle: { fill: theme.text } }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500 italic">
                Nenhuma despesa para exibir no gráfico de linha.
              </div>
            )}
          </div>
        </div>

        {/* --- GRID PARA PIZZA E BARRAS (O que você já tinha) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico de Pizza */}
          <div className="p-6 rounded-xl border shadow-sm" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <h4 className="text-lg font-bold mb-6" style={{ color: theme.text }}>Distribuição de Despesas</h4>
            <PieChart
              series={[{ data: despesasPorCategoria, innerRadius: 40 }]}
              height={300}
              slotProps={{ legend: { labelStyle: { fill: theme.text } } }}
            />
          </div>

          {/* Gráfico de Barras */}
          <div className="p-6 rounded-xl border shadow-sm" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <h4 className="text-lg font-bold mb-6" style={{ color: theme.text }}>Entradas vs Saídas</h4>
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['Resumo'] }]}
              series={[
                { data: [totalEntradas], label: 'Entradas', color: '#10b981' },
                { data: [totalSaidas], label: 'Saídas', color: '#f43f5e' },
              ]}
              height={300}
              slotProps={{ legend: { labelStyle: { fill: theme.text } } }}
            />
          </div>
        </div>

      </div>
    </ThemeProvider>
  );
};

export default DashboardCharts;