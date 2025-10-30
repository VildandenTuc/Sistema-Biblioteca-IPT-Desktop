/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getToken,
  setToken as saveToken,
  removeToken,
  isValidToken,
  decodeToken,
  getUserEmailFromToken,
  getUserRoleFromToken,
  getUserIdFromToken,
  getPrimerLogin,
  setPrimerLogin as savePrimerLogin,
  removePrimerLogin,
} from "../utils/tokenUtils";

// Crear el contexto
export const AuthContext = createContext();

// Función auxiliar para obtener datos del usuario desde el token
export const getUserFromToken = (token = null) => {
  try {
    const tokenToUse = token || getToken();
    if (!tokenToUse || !isValidToken(tokenToUse)) {
      return null;
    }

    const email = getUserEmailFromToken(tokenToUse);
    const role = getUserRoleFromToken(tokenToUse);
    const userId = getUserIdFromToken(tokenToUse);
    const decoded = decodeToken(tokenToUse);

    return {
      id: userId, // ID del usuario
      userId, // Mantener compatibilidad
      email,
      rol: role, // Mantener consistencia con el backend
      role, // Mantener compatibilidad
      isAuthenticated: true,
      exp: decoded?.exp || null,
    };
  } catch (error) {
    console.error("Error al obtener usuario desde token:", error);
    return null;
  }
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  // Estado de autenticación
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [primerLogin, setPrimerLogin] = useState(false);

  // Función para verificar autenticación (reutilizable)
  const checkAuth = () => {
    try {
      const token = getToken();

      if (token && isValidToken(token)) {
        const userData = getUserFromToken(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          // Recuperar primerLogin desde localStorage
          const primerLoginStored = getPrimerLogin();
          setPrimerLogin(primerLoginStored);
          return true;
        } else {
          // Token inválido, limpiar
          removeToken();
          removePrimerLogin();
          setUser(null);
          setIsAuthenticated(false);
          setPrimerLogin(false);
          return false;
        }
      } else {
        // No hay token o está expirado
        removeToken();
        removePrimerLogin();
        setUser(null);
        setIsAuthenticated(false);
        setPrimerLogin(false);
        return false;
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      removeToken();
      removePrimerLogin();
      setUser(null);
      setIsAuthenticated(false);
      setPrimerLogin(false);
      return false;
    }
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, []);

  // Listener para detectar cambios en localStorage (token eliminado en otra pestaña o manualmente)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Solo reaccionar si el token fue eliminado o modificado
      if (e.key === "biblioteca_token" || e.key === null) {
        checkAuth();
      }
    };

    // Escuchar eventos de storage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Verificación periódica del token (cada 10 segundos)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = getToken();

      // Si no hay token o está expirado, hacer logout
      if (!token || !isValidToken(token)) {
        if (isAuthenticated) {
          console.warn("Token expirado o eliminado. Cerrando sesión...");
          logout();
        }
      }
    }, 10000); // 10 segundos

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Función para hacer login
  const login = (token, primerLoginFlag = false) => {
    try {
      if (!token) {
        throw new Error("Token inválido");
      }

      // Guardar token en localStorage
      saveToken(token);
      // Guardar primerLogin en localStorage
      savePrimerLogin(primerLoginFlag);

      // Extraer datos del usuario del token
      const userData = getUserFromToken(token);

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        setPrimerLogin(primerLoginFlag);
        return true;
      } else {
        throw new Error("No se pudo extraer datos del token");
      }
    } catch (error) {
      console.error("Error en login:", error);
      logout();
      return false;
    }
  };

  // Función para hacer logout
  const logout = () => {
    removeToken();
    removePrimerLogin();
    setUser(null);
    setIsAuthenticated(false);
    setPrimerLogin(false);
  };

  // Función para marcar que el usuario completó el cambio de contraseña obligatorio
  const completarCambioPassword = () => {
    savePrimerLogin(false);
    setPrimerLogin(false);
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    return user.role === requiredRole;
  };

  // Función para verificar si el usuario es admin
  const isAdmin = () => {
    return hasRole("ADMIN");
  };

  // Función para verificar si el usuario es user regular
  const isUser = () => {
    return hasRole("USER");
  };

  // Valor del contexto
  const value = {
    user,
    isAuthenticated,
    isLoading,
    primerLogin,
    login,
    logout,
    completarCambioPassword,
    hasRole,
    isAdmin,
    isUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PropTypes para validación
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Exportación por defecto
export default AuthContext;
