import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {object} - { user, isAuth, login, logout, loading }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Verificar que el hook se usa dentro del AuthProvider
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};
