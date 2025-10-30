import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaIdCard,
  FaPhone,
  FaUserPlus,
  FaBook,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";

const Register = () => {
  // ===== ESTADO DEL COMPONENTE =====
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    tipoUsuario: "ALUMNO",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ===== HOOKS =====
  const navigate = useNavigate();

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

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    // Validar DNI
    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio";
    } else if (!/^\d{7,8}$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener 7 u 8 dígitos";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar teléfono (opcional pero si se ingresa debe ser válido)
    if (formData.telefono.trim() && !/^\d{10,15}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener entre 10 y 15 dígitos";
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Debe incluir al menos una letra mayúscula";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Debe incluir al menos una letra minúscula";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Debe incluir al menos un número";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      newErrors.password = "Debe incluir al menos un carácter especial (!@#$%^&*, etc.)";
    }

    // Validar confirmación de password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
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
      // Preparar datos para enviar (sin confirmPassword y con rol USER por defecto)
      const dataToSend = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni.trim(),
        tipoUsuario: formData.tipoUsuario,
        email: formData.email.trim(),
        telefono: formData.telefono.trim() || null,
        password: formData.password,
        rol: "USER", // Por defecto todos se registran como USER
      };

      const response = await axiosInstance.post(
        ENDPOINTS.AUTH.REGISTER,
        dataToSend
      );

      toast.success(
        "Registro exitoso. Redirigiendo al login para iniciar sesión..."
      );

      // Limpiar formulario
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        tipoUsuario: "ALUMNO",
        email: "",
        telefono: "",
        password: "",
        confirmPassword: "",
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setIsLoading(false);

      // Mostrar errores con toast
      if (error.response?.status === 400) {
        // Intentar obtener el mensaje de error más específico
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          JSON.stringify(error.response.data) ||
          "Datos inválidos. Verifique los campos del formulario.";

        toast.error(errorMessage);
      } else if (error.response?.status === 409) {
        toast.error("El email o DNI ya está registrado");
      } else if (error.response) {
        toast.error(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        toast.error("No se pudo conectar con el servidor. Verifique su conexión.");
      } else {
        toast.error("Error inesperado. Intente nuevamente.");
      }

      return;
    }
  };

  // ===== RENDER DEL COMPONENTE =====
  return (
    <div className="register-page">
      <Container fluid className="register-container">
        <Row className="justify-content-center align-items-center min-vh-100 g-0">
          <Col xs={11} sm={10} md={9} lg={8} xl={7} xxl={6}>
            <Card className="register-card shadow-lg border-0">
              <Card.Body className="p-3 p-sm-4 p-md-5">
                {/* Logo y Título */}
                <div className="text-center mb-3 mb-md-4">
                  <div className="register-logo mb-2 mb-md-3">
                    <FaBook size={45} className="text-success" />
                  </div>
                  <h2 className="fw-bold mb-2">Crear Cuenta</h2>
                  <p className="text-muted small mb-0">
                    Sistema de Gestión de Biblioteca IPT
                  </p>
                </div>

                {/* Formulario */}
                <Form onSubmit={handleSubmit} noValidate>
                  <Row>
                    {/* Campo Nombre */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">
                          <FaUser className="me-2" />
                          Nombre
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          placeholder="Juan"
                          value={formData.nombre}
                          onChange={handleChange}
                          isInvalid={!!errors.nombre}
                          disabled={isLoading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.nombre}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Campo Apellido */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">
                          <FaUser className="me-2" />
                          Apellido
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="apellido"
                          placeholder="Pérez"
                          value={formData.apellido}
                          onChange={handleChange}
                          isInvalid={!!errors.apellido}
                          disabled={isLoading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.apellido}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {/* Campo DNI */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">
                          <FaIdCard className="me-2" />
                          DNI
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="dni"
                          placeholder="12345678"
                          value={formData.dni}
                          onChange={handleChange}
                          isInvalid={!!errors.dni}
                          disabled={isLoading}
                          maxLength="8"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.dni}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Campo Tipo de Usuario */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">
                          <FaUser className="me-2" />
                          Tipo de Usuario
                        </Form.Label>
                        <Form.Select
                          name="tipoUsuario"
                          value={formData.tipoUsuario}
                          onChange={handleChange}
                          disabled={isLoading}
                        >
                          <option value="ALUMNO">Alumno</option>
                          <option value="DOCENTE">Docente</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Campo Email */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">
                      <FaEnvelope className="me-2" />
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
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Campo Teléfono (Opcional) */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">
                      <FaPhone className="me-2" />
                      Teléfono <small className="text-muted">(Opcional)</small>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="telefono"
                      placeholder="3814123456"
                      value={formData.telefono}
                      onChange={handleChange}
                      isInvalid={!!errors.telefono}
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.telefono}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    {/* Campo Contraseña */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold">
                          <FaLock className="me-2" />
                          Contraseña
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Ej: Carlos123!"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                          disabled={isLoading}
                        />
                        <Form.Text className="text-muted">
                          <small>
                            Min. 8 caracteres, mayúsculas, minúsculas, números y especiales
                          </small>
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Campo Confirmar Contraseña */}
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="small fw-semibold">
                          <FaLock className="me-2" />
                          Confirmar Contraseña
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Repetir contraseña"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                          disabled={isLoading}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Botón Submit */}
                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 py-2 py-sm-3 fw-semibold"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="me-2" />
                        Registrarse
                      </>
                    )}
                  </Button>
                </Form>

                {/* Enlace a Login */}
                <div className="text-center mt-3 mt-md-4">
                  <p className="text-muted mb-0 small">
                    ¿Ya tiene una cuenta?{" "}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Inicie sesión aquí
                    </Link>
                  </p>
                </div>

                {/* Link a Home */}
                <div className="text-center mt-2">
                  <Link to="/" className="text-muted text-decoration-none small">
                    ← Volver al inicio
                  </Link>
                </div>

                {/* Nota informativa */}
                <Alert variant="info" className="mt-3 mt-md-4 mb-0 small">
                  <strong className="d-block mb-1">Nota:</strong>
                  Al registrarse, su cuenta será creada con rol de Usuario. Para obtener permisos de administrador, contacte al administrador del sistema.
                </Alert>
              </Card.Body>
            </Card>

            {/* Footer */}
            <div className="text-center mt-3 text-white-50 small">
              <p className="mb-0">© 2025 Biblioteca IPT - Todos los derechos reservados</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Estilos CSS personalizados */}
      <style>{`
        /* Contenedor principal con gradiente de fondo */
        .register-page {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          min-height: 100vh;
          position: relative;
        }

        .register-container {
          padding: 1rem;
        }

        /* Card de registro */
        .register-card {
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.98);
          animation: fadeInUp 0.5s ease-out;
          width: 100%;
          max-width: 100%;
        }

        /* Logo animado */
        .register-logo {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Animación de entrada */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mejorar inputs en mobile */
        .register-card .form-control,
        .register-card .form-select {
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .register-card .form-control:focus,
        .register-card .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(17, 153, 142, 0.25);
          border-color: #11998e;
        }

        /* Botón con efecto hover */
        .register-card .btn-success {
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .register-card .btn-success:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);
        }

        /* Alert responsive */
        .register-card .alert {
          border-radius: 0.5rem;
        }

        /* Escalado proporcional SIN transform - Solo ajuste de tamaños */

        /* Mobile - Base */
        @media (max-width: 576px) {
          .register-container {
            padding: 0.5rem;
          }

          .register-card .card-body {
            padding: 1.5rem !important;
          }

          .register-logo svg {
            width: 40px;
            height: 40px;
          }

          .register-card h2 {
            font-size: 1.4rem;
          }

          .register-card .form-control,
          .register-card .form-select {
            font-size: 0.95rem;
          }
        }

        /* Tablets pequeñas */
        @media (min-width: 577px) and (max-width: 767px) {
          .register-card .card-body {
            padding: 2rem !important;
          }

          .register-logo svg {
            width: 45px;
            height: 45px;
          }

          .register-card h2 {
            font-size: 1.65rem;
          }

          .register-card .form-control,
          .register-card .form-select {
            font-size: 1rem;
          }
        }

        /* Tablets */
        @media (min-width: 768px) and (max-width: 991px) {
          .register-card .card-body {
            padding: 2.5rem !important;
          }

          .register-logo svg {
            width: 50px;
            height: 50px;
          }

          .register-card h2 {
            font-size: 1.85rem;
          }

          .register-card .form-control,
          .register-card .form-select {
            font-size: 1.05rem;
            padding: 0.65rem 0.9rem;
          }
        }

        /* Desktop */
        @media (min-width: 992px) and (max-width: 1199px) {
          .register-container {
            padding: 2rem;
          }

          .register-card .card-body {
            padding: 2.75rem !important;
          }

          .register-logo svg {
            width: 55px;
            height: 55px;
          }

          .register-card h2 {
            font-size: 2rem;
          }

          .register-card .form-control,
          .register-card .form-select {
            font-size: 1.08rem;
            padding: 0.68rem 0.95rem;
          }

          .register-card .btn {
            font-size: 1.1rem;
            padding: 0.7rem 1.3rem;
          }
        }

        /* Desktop grande */
        @media (min-width: 1200px) and (max-width: 1399px) {
          .register-container {
            padding: 2rem;
          }

          .register-card .card-body {
            padding: 3rem !important;
          }

          .register-logo svg {
            width: 60px;
            height: 60px;
          }

          .register-card h2 {
            font-size: 2.15rem;
          }

          .register-card .form-control,
          .register-card .form-select {
            font-size: 1.1rem;
            padding: 0.7rem 1rem;
          }

          .register-card .btn {
            font-size: 1.15rem;
            padding: 0.75rem 1.4rem;
          }
        }

        /* XL */
        @media (min-width: 1400px) {
          .register-container {
            padding: 3rem;
          }

          .register-card .card-body {
            padding: 3.5rem !important;
          }

          .register-logo svg {
            width: 65px;
            height: 65px;
          }

          .register-card h2 {
            font-size: 2.3rem;
          }

          .register-card .form-control,
          .register-card .form-select {
            font-size: 1.15rem;
            padding: 0.75rem 1.05rem;
          }

          .register-card .btn {
            font-size: 1.2rem;
            padding: 0.8rem 1.5rem;
          }

          .register-card .alert {
            font-size: 0.95rem;
          }
        }

        /* Links con mejor contraste */
        .register-card a {
          transition: all 0.2s ease;
        }

        .register-card a:hover {
          opacity: 0.8;
        }

        /* Form spacing optimizado para mobile */
        @media (max-width: 768px) {
          .register-card .mb-3 {
            margin-bottom: 0.75rem !important;
          }

          .register-card .mb-4 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
