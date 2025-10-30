import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";
import { getToken, isValidToken } from "../../utils/tokenUtils";

/**
 * Componente de orden superior (HOC) para proteger rutas
 * que requieren autenticación y/o roles específicos
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user, primerLogin } = useAuth();
  const location = useLocation();

  // Verificación adicional en tiempo real del token
  const token = getToken();
  const hasValidToken = token && isValidToken(token);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Verificar tanto el estado del contexto como el token en localStorage
  // Si alguno falla, redirigir al login
  if (!isAuthenticated || !hasValidToken) {
    return <Navigate to="/login" replace />;
  }

  // Si es el primer login y no está en la página de cambio de contraseña, redirigir
  if (primerLogin && location.pathname !== "/cambiar-password-obligatorio") {
    return <Navigate to="/cambiar-password-obligatorio" replace />;
  }

  // Si requiere un rol específico, verificar que el usuario lo tenga
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si pasa todas las validaciones, mostrar el componente hijo
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string, // "ADMIN" o "USER"
};

export default ProtectedRoute;
