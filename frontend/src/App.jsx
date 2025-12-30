import AppRoutes from './routes';
import './App.css'; 
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast'; // Sugestão: Feedback visual global

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="min-h-screen transition-colors duration-300">
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}

export default App;