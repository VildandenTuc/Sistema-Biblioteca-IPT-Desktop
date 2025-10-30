// src/hooks/useNotifications.js

import { useState, useEffect, useCallback } from "react";
import axios from "../api/axiosConfig";
import { ENDPOINTS } from "../api/endpoints";

/**
 * Hook personalizado para manejar notificaciones de vencimientos próximos
 * @param {number} dias - Número de días hacia adelante para buscar vencimientos (default: 3)
 * @param {boolean} autoRefresh - Si debe refrescar automáticamente (default: false)
 * @param {number} refreshInterval - Intervalo de refresco en ms (default: 300000 = 5 min)
 */
export const useNotifications = (dias = 3, autoRefresh = false, refreshInterval = 300000) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener vencimientos próximos
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${ENDPOINTS.PRESTAMOS.VENCIMIENTOS_PROXIMOS}?dias=${dias}`);
      setNotificaciones(response.data);
      setCount(response.data.length);
    } catch (err) {
      console.error("Error al obtener notificaciones:", err);
      setError(err.errorMessage || "Error al cargar notificaciones");
      setNotificaciones([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [dias]);

  // Cargar notificaciones al montar y cuando cambie 'dias'
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto-refresh opcional
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchNotifications]);

  // Función para refrescar manualmente
  const refresh = () => {
    fetchNotifications();
  };

  // Función para limpiar notificaciones
  const clear = () => {
    setNotificaciones([]);
    setCount(0);
  };

  return {
    notificaciones,
    count,
    loading,
    error,
    refresh,
    clear,
  };
};
