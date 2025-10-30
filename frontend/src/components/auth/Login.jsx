import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock, FaSignInAlt, FaBook } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";

const Login = () => {
  // ===== ESTADO DEL COMPONENTE =====
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ===== HOOKS =====
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // ===== REDIRECCIÓN SI YA ESTÁ AUTENTICADO =====
  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // ===== MANEJO DE CAMBIOS EN EL FORMULARIO =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ===== VALIDACIÓN DEL FORMULARIO =====
  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== MANEJO DEL SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validar formulario
    if (!validateForm()) {
      toast.error("Por favor corrija los errores en el formulario");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      const { token, primerLogin } = response.data;
      login(token, primerLogin);

      // Verificar si es el primer login (debe cambiar contraseña)
      if (primerLogin) {
        toast.info("Por seguridad, debes cambiar tu contraseña temporal");
        setTimeout(() => {
          navigate("/cambiar-password-obligatorio");
        }, 1500);
      } else {
        toast.success("Inicio de sesión exitoso. Redirigiendo...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      setIsLoading(false);

      // Mostrar errores con toast
      if (error.response?.status === 401) {
        toast.error("Credenciales inválidas. Verifique su email y contraseña.");
      } else if (error.response) {
        toast.error(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        toast.error("No se pudo conectar con el servidor. Verifique su conexión.");
      } else {
        toast.error("Error inesperado. Intente nuevamente.");
      }

      return;
    } finally {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  };

  // ===== RENDER DEL COMPONENTE =====
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Logo y Título */}
          <div className="login-header">
            <div className="login-logo">
              <FaBook className="logo-icon" />
            </div>
            <h2 className="login-title">Iniciar Sesión</h2>
            <p className="login-subtitle">
              Sistema de Gestión de Biblioteca IPT
            </p>
          </div>

          {/* Formulario */}
          <Form onSubmit={handleSubmit} noValidate className="login-form">
            {/* Campo Email */}
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                <FaEnvelope className="label-icon" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                disabled={isLoading}
                className="form-input"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Campo Password */}
            <Form.Group className="form-group">
              <Form.Label className="form-label">
                <FaLock className="label-icon" />
                Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                disabled={isLoading}
                className="form-input"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Botón Submit */}
            <Button
              type="submit"
              variant="primary"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FaSignInAlt className="button-icon" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </Form>

          {/* Enlaces */}
          <div className="login-links">
            {/* REGISTRO PÚBLICO DESHABILITADO - Solo el ADMIN puede crear usuarios */}
            {/* <p className="register-link">
              ¿No tiene cuenta?{" "}
              <Link to="/register" className="link">
                Regístrese aquí
              </Link>
            </p> */}
            <Link to="/" className="home-link">
              ← Volver al inicio
            </Link>
          </div>

          {/* Credenciales de prueba */}
          <Alert variant="info" className="credentials-alert">
            <strong className="alert-title">Credenciales de prueba:</strong>
            <div className="credential-item">
              👤 Admin: admin@biblioteca.com / admin123
            </div>
            <div className="credential-item">
              👤 Usuario: usuario@biblioteca.com / usuario123
            </div>
          </Alert>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2025 Biblioteca IPT - Todos los derechos reservados</p>
        </div>
      </div>

      {/* Estilos CSS */}
      <style>{`
        /* ========== CONTENEDOR PRINCIPAL ========== */
        .login-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .login-container {
          width: 100%;
          max-width: 28rem;
          margin: 0 auto;
        }

        /* ========== CARD ========== */
        .login-card {
          background: rgba(255, 255, 255, 0.98);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ========== HEADER ========== */
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-logo {
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }

        .logo-icon {
          font-size: 3rem;
          color: #667eea;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .login-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }

        .login-subtitle {
          font-size: 0.875rem;
          color: #718096;
          margin: 0;
        }

        /* ========== FORMULARIO ========== */
        .login-form {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .label-icon {
          margin-right: 0.5rem;
          font-size: 0.875rem;
        }

        .form-input {
          font-size: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        /* ========== BOTÓN ========== */
        .submit-button {
          width: 100%;
          padding: 0.875rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 0.5rem;
          border: none;
          background: #667eea;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-button:hover:not(:disabled) {
          background: #5a67d8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .submit-button:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }

        .button-icon {
          margin-right: 0.5rem;
        }

        /* ========== ENLACES ========== */
        .login-links {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .register-link {
          font-size: 0.875rem;
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .link {
          color: #667eea;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .link:hover {
          opacity: 0.8;
          text-decoration: none;
        }

        .home-link {
          display: inline-block;
          font-size: 0.875rem;
          color: #718096;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .home-link:hover {
          opacity: 0.8;
        }

        /* ========== ALERT ========== */
        .credentials-alert {
          font-size: 0.875rem;
          border-radius: 0.5rem;
          margin-bottom: 0;
        }

        .alert-title {
          display: block;
          margin-bottom: 0.5rem;
        }

        .credential-item {
          margin-top: 0.25rem;
        }

        /* ========== FOOTER ========== */
        .login-footer {
          text-align: center;
          margin-top: 1rem;
        }

        .login-footer p {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        /* ========== RESPONSIVE - MOBILE ========== */
        @media (max-width: 576px) {
          .login-card {
            padding: 1.5rem;
          }

          .login-title {
            font-size: 1.5rem;
          }

          .logo-icon {
            font-size: 2.5rem;
          }

          .form-input {
            font-size: 0.95rem;
          }

          .submit-button {
            font-size: 0.95rem;
          }
        }

        /* ========== RESPONSIVE - DESKTOP GRANDE ========== */
        @media (min-width: 1200px) {
          .login-container {
            max-width: 30rem;
          }

          .login-card {
            padding: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
