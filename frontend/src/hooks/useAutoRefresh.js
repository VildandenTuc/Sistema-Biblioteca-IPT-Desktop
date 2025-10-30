import { useEffect, useRef } from 'react';

/**
 * Hook personalizado para auto-refresh de datos
 * @param {Function} callback - Función a ejecutar en cada refresh
 * @param {number} intervalMs - Intervalo en milisegundos (default: 60000 = 1 minuto)
 * @param {boolean} enabled - Si el auto-refresh está habilitado (default: false)
 */
const useAutoRefresh = (callback, intervalMs = 60000, enabled = false) => {
  const savedCallback = useRef();

  // Guardar el callback más reciente
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configurar el intervalo
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    // Ejecutar el intervalo
    const intervalId = setInterval(tick, intervalMs);

    // Cleanup al desmontar o cambiar dependencias
    return () => clearInterval(intervalId);
  }, [intervalMs, enabled]);
};

export default useAutoRefresh;
