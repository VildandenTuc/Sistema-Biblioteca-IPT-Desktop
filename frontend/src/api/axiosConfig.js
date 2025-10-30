import axios from "axios";
import { toast } from "react-toastify";

// Obtener URL base desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  withCredentials: true, // ✅ Necesario para CORS con credentials
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Función helper para generar mensajes de error descriptivos
 * @param {object} error - Error de Axios
 * @returns {string} Mensaje de error personalizado
 */
const getErrorMessage = (error) => {
  // Si hay un mensaje del servidor, usarlo
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Si hay un mensaje del servidor sin wrapper
  if (error.response?.data && typeof error.response.data === 'string') {
    return error.response.data;
  }

  // Mensajes por código de estado HTTP
  const status = error.response?.status;

  switch (status) {
    case 400:
      return 'Solicitud incorrecta. Por favor verifica los datos ingresados.';
    case 401:
      return 'Sesión expirada. Por favor inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado. Por favor intenta nuevamente.';
    case 409:
      return 'Conflicto con los datos existentes. Verifica la información.';
    case 422:
      return 'Datos de validación incorrectos. Revisa el formulario.';
    case 500:
      return 'Error del servidor. Por favor contacta al administrador.';
    case 502:
      return 'Error de conexión con el servidor. Intenta más tarde.';
    case 503:
      return 'Servicio temporalmente no disponible. Intenta más tarde.';
    default:
      if (error.code === 'ECONNABORTED') {
        return 'Tiempo de espera agotado. Verifica tu conexión a internet.';
      }
      if (error.code === 'ERR_NETWORK') {
        return 'Error de red. Verifica tu conexión a internet.';
      }
      return 'Ocurrió un error inesperado. Por favor intenta nuevamente.';
  }
};

// Interceptor de REQUEST - Agregar token JWT automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem(TOKEN_KEY);

    // Si existe token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - Manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornarla tal cual
    return response;
  },
  (error) => {
    // Generar mensaje de error descriptivo
    const errorMessage = getErrorMessage(error);

    // Agregar mensaje al objeto error para que sea accesible en los componentes
    error.errorMessage = errorMessage;

    // Manejar error 401 (token expirado o inválido)
    if (error.response && error.response.status === 401) {
      // Solo limpiar token y redirigir si NO estamos en la página de login
      const currentPath = window.location.pathname;

      if (currentPath !== "/login") {
        // Mostrar toast informativo
        toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');

        // Limpiar token del localStorage
        localStorage.removeItem(TOKEN_KEY);

        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
      // Si estamos en /login, dejar que el componente Login maneje el error
    }

    // Manejar error 403 (sin permisos)
    if (error.response && error.response.status === 403) {
      const currentPath = window.location.pathname;
      // Si no estamos ya en una página de error, mostrar toast
      if (!currentPath.includes('/unauthorized')) {
        toast.error(errorMessage);
      }
    }

    // Manejar errores de red
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
