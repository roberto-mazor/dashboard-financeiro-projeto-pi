import { BrowserRouter } from 'react-router-dom'; // ADICIONE ESTE IMPORT
import AppRoutes from './routes';
import './App.css'; 
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      
      {/* O BrowserRouter deve envolver as rotas aqui no topo */}
      <BrowserRouter>
        <div className="min-h-screen transition-colors duration-300">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;