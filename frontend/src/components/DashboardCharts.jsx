import { useMemo } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const DashboardCharts = ({ transacoes }) => {
  const { theme, isDarkMode } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: { main: '#8b5cf6' },
      text: { primary: theme.text },
    },
  });

  // LÓGICA 1: Pizza (Distribuição por Categoria)
  const despesasPorCategoria = useMemo(() => {
    return transacoes
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
  }, [transacoes]);

  // LÓGICA 2: Barras Diárias 
  const dadosEvolucaoBarras = useMemo(() => {
    if (!transacoes || transacoes.length === 0) return [];
    
    const agrupado = transacoes.reduce((acc, t) => {
      const ehDespesa = t.categoria?.tipo?.toLowerCase() === 'despesa' || parseFloat(t.valor) < 0;
      if (ehDespesa) {
        const dataStr = t.data.split('T')[0];
        const valor = Math.abs(parseFloat(t.valor));
        acc[dataStr] = (acc[dataStr] || 0) + valor;
      }
      return acc;
    }, {});

    return Object.keys(agrupado)
      .map(dataStr => {
        const [ano, mes, dia] = dataStr.split('-').map(Number);
        return {
          dataLabel: `${dia}/${mes}`,
          dataObj: new Date(ano, mes - 1, dia),
          valor: agrupado[dataStr]
        };
      })
      .sort((a, b) => a.dataObj - b.dataObj);
  }, [transacoes]);

  // LÓGICA 3: Resumo Entradas vs Saídas
  const totalEntradas = useMemo(() => 
    transacoes
      .filter(t => t.categoria?.tipo?.toLowerCase() === 'receita')
      .reduce((acc, t) => acc + parseFloat(t.valor), 0)
  , [transacoes]);

  const totalSaidas = useMemo(() => 
    transacoes
      .filter(t => t.categoria?.tipo?.toLowerCase() === 'despesa')
      .reduce((acc, t) => acc + Math.abs(parseFloat(t.valor)), 0)
  , [transacoes]);

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="flex flex-col gap-6 mb-8">
        
        {/* Gráfico de Barras - Gastos Diários */}
        <div className="p-4 sm:p-6 rounded-2xl border shadow-lg" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <h4 className="text-base sm:text-lg font-bold mb-4" style={{ color: theme.text }}>Gastos Diários (Picos)</h4>
          <div className="h-64 sm:h-80 w-full">
            {dadosEvolucaoBarras.length > 0 ? (
              <BarChart
                dataset={dadosEvolucaoBarras}
                xAxis={[{ 
                  dataKey: 'dataLabel', 
                  scaleType: 'band',
                  tickLabelStyle: { fontSize: 10 }
                }]}
                series={[{ dataKey: 'valor', label: 'R$', color: '#8b5cf6' }]}
                // Ajuste: margin left 40 para tirar o buraco na esquerda
                margin={{ left: 40, right: 10, top: 20, bottom: 40 }}
                slotProps={{ legend: { hidden: true } }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500 italic text-sm">
                Nenhuma despesa no período.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico de Pizza - Distribuição */}
          <div className="p-4 sm:p-6 rounded-xl border shadow-sm" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <h4 className="text-base sm:text-lg font-bold mb-4" style={{ color: theme.text }}>Distribuição</h4>
            <div className="h-72 sm:h-80">
              <PieChart
                series={[{ 
                  data: despesasPorCategoria, 
                  innerRadius: 30, 
                  outerRadius: 70, 
                  paddingAngle: 2,
                  cornerRadius: 4,
                }]}
                // Ajuste: bottom 90 para a legenda não cortar o gráfico
                margin={{ top: 10, bottom: 90, left: 0, right: 0 }}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                  }
                }}
              />
            </div>
          </div>

          {/* Gráfico de Barras - Entradas vs Saídas */}
          <div className="p-4 sm:p-6 rounded-xl border shadow-sm" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <h4 className="text-base sm:text-lg font-bold mb-4" style={{ color: theme.text }}>Entradas vs Saídas</h4>
            <div className="h-72 sm:h-80">
              <BarChart
                xAxis={[{ scaleType: 'band', data: ['Total'] }]}
                series={[
                  { data: [totalEntradas], label: 'Entradas', color: '#10b981' },
                  { data: [totalSaidas], label: 'Saídas', color: '#f43f5e' },
                ]}
                margin={{ left: 40, right: 10, top: 20, bottom: 60 }}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                  }
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </ThemeProvider>
  );
};

export default DashboardCharts;