import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = {
    background: isDarkMode ? '#121212' : '#f4f7fe',
    surface: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1e293b',
    textSecondary: isDarkMode ? '#b0b0b0' : '#64748b',
    border: isDarkMode ? '#333333' : '#f1f5f9',
    cardEntrada: isDarkMode ? '#065f46' : '#10b981',
    cardSaida: isDarkMode ? '#991b1b' : '#f43f5e',
    cardSaldo: isDarkMode ? '#1e40af' : '#3b82f6',
    inputBg: isDarkMode ? '#2d2d2d' : '#ffffff',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);