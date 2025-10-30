import { createContext, useState, useEffect } from 'react';

// Crear contexto del tema
export const ThemeContext = createContext();

/**
 * Provider del tema para toda la aplicación
 * Maneja el tema actual (light/dark) y persiste la preferencia en localStorage
 */
export const ThemeProvider = ({ children }) => {
  // Obtener tema guardado o usar 'light' por defecto
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('biblioteca-theme');
    return savedTheme || 'light';
  });

  // Aplicar el tema al document cuando cambia
  useEffect(() => {
    // Remover ambas clases primero
    document.documentElement.classList.remove('light-theme', 'dark-theme');

    // Agregar la clase del tema actual
    document.documentElement.classList.add(`${theme}-theme`);

    // Actualizar atributo data-bs-theme para Bootstrap
    document.documentElement.setAttribute('data-bs-theme', theme);

    // Guardar en localStorage
    localStorage.setItem('biblioteca-theme', theme);
  }, [theme]);

  /**
   * Alternar entre light y dark
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
