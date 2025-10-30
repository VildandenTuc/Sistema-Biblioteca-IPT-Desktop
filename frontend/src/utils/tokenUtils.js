// src/utils/tokenUtils.js

import { jwtDecode } from "jwt-decode";

/**
 * Nombre de la clave en localStorage donde se guarda el token
 */
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "biblioteca_token";
const PRIMER_LOGIN_KEY = "biblioteca_primer_login";

/**
 * Guarda el token JWT en localStorage
 * @param {string} token - Token JWT a guardar
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Obtiene el token JWT de localStorage
 * @returns {string|null} - Token JWT o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Elimina el token JWT de localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Verifica si existe un token en localStorage
 * @returns {boolean} - true si existe token, false si no
 */
export const hasToken = () => {
  return !!getToken();
};

/**
 * Decodifica el token JWT y devuelve su payload
 * @param {string} token - Token JWT a decodificar (opcional, usa el guardado si no se pasa)
 * @returns {object|null} - Payload del token o null si no es válido
 */
export const decodeToken = (token = null) => {
  try {
    const tokenToUse = token || getToken();
    if (!tokenToUse) return null;
    return jwtDecode(tokenToUse);
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};

/**
 * Verifica si el token está expirado
 * @param {string} token - Token JWT a verificar (opcional, usa el guardado si no se pasa)
 * @returns {boolean} - true si está expirado, false si no
 */
export const isTokenExpired = (token = null) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    // exp está en segundos, Date.now() en milisegundos
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Obtiene el email del usuario desde el token
 * @param {string} token - Token JWT (opcional, usa el guardado si no se pasa)
 * @returns {string|null} - Email del usuario o null
 */
export const getUserEmailFromToken = (token = null) => {
  try {
    const decoded = decodeToken(token);
    // CAMBIO: Leer email del claim 'email' (sub ahora es userId)
    return decoded?.email || null;
  } catch (error) {
    return null;
  }
};

/**
 * Obtiene el rol del usuario desde el token
 * @param {string} token - Token JWT (opcional, usa el guardado si no se pasa)
 * @returns {string|null} - Rol del usuario o null
 */
export const getUserRoleFromToken = (token = null) => {
  try {
    const decoded = decodeToken(token);
    // El backend envía el rol en el claim 'authorities' como un array
    const authorities = decoded?.authorities || [];
    if (authorities.length > 0) {
      // Extraer el rol sin el prefijo ROLE_
      return authorities[0].replace("ROLE_", "");
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Obtiene el ID del usuario desde el token
 * @param {string} token - Token JWT (opcional, usa el guardado si no se pasa)
 * @returns {number|null} - ID del usuario o null
 */
export const getUserIdFromToken = (token = null) => {
  try {
    const decoded = decodeToken(token);
    // CAMBIO: El userId ahora está en el 'sub' (subject) del token
    return decoded?.sub ? parseInt(decoded.sub) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} requiredRole - Rol requerido (ej: 'ADMIN', 'USER')
 * @param {string} token - Token JWT (opcional, usa el guardado si no se pasa)
 * @returns {boolean} - true si tiene el rol, false si no
 */
export const hasRole = (requiredRole, token = null) => {
  const userRole = getUserRoleFromToken(token);
  return userRole === requiredRole;
};

/**
 * Verifica si el token es válido (existe y no está expirado)
 * @param {string} token - Token JWT (opcional, usa el guardado si no se pasa)
 * @returns {boolean} - true si es válido, false si no
 */
export const isValidToken = (token = null) => {
  const tokenToUse = token || getToken();
  if (!tokenToUse) return false;
  return !isTokenExpired(tokenToUse);
};

/**
 * Guarda el flag primerLogin en localStorage
 * @param {boolean} primerLogin - Flag indicando si es el primer login
 */
export const setPrimerLogin = (primerLogin) => {
  localStorage.setItem(PRIMER_LOGIN_KEY, primerLogin.toString());
};

/**
 * Obtiene el flag primerLogin de localStorage
 * @returns {boolean} - true si es primer login, false si no
 */
export const getPrimerLogin = () => {
  const value = localStorage.getItem(PRIMER_LOGIN_KEY);
  return value === "true";
};

/**
 * Elimina el flag primerLogin de localStorage
 */
export const removePrimerLogin = () => {
  localStorage.removeItem(PRIMER_LOGIN_KEY);
};

/**
 * Limpia toda la información de autenticación
 */
export const clearAuth = () => {
  removeToken();
  removePrimerLogin();
  // Aquí se pueden limpiar otros datos relacionados si es necesario
};

// Exportación por defecto (opcional)
export default {
  setToken,
  getToken,
  removeToken,
  hasToken,
  decodeToken,
  isTokenExpired,
  getUserEmailFromToken,
  getUserRoleFromToken,
  getUserIdFromToken,
  hasRole,
  isValidToken,
  setPrimerLogin,
  getPrimerLogin,
  removePrimerLogin,
  clearAuth,
};
