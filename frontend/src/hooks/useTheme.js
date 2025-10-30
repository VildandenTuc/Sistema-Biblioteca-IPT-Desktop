import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook personalizado para usar el contexto del tema
 * @returns {Object} - { theme, setTheme, toggleTheme, isDark }
 */
const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }

  return context;
};

export default useTheme;
