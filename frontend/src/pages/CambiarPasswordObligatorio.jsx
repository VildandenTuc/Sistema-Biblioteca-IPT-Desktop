// src/pages/CambiarPasswordObligatorio.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaLock, FaKey, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../api/axiosConfig";
import { ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";

const CambiarPasswordObligatorio = () => {
  const { user, completarCambioPassword, logout } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [passwordData, setPasswordData] = useState({
    passwordActual: "",
    passwordNuevo: "",
    passwordConfirmar: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Contraseña actual
    if (!passwordData.passwordActual) {
      newErrors.passwordActual = "La contraseña actual es obligatoria";
    }

    // Nueva contraseña
    if (!passwordData.passwordNuevo) {
      newErrors.passwordNuevo = "La nueva contraseña es obligatoria";
    } else if (passwordData.passwordNuevo.length < 6) {
      newErrors.passwordNuevo = "La contraseña debe tener al menos 6 caracteres";
    }

    // Confirmar contraseña
    if (!passwordData.passwordConfirmar) {
      newErrors.passwordConfirmar = "Debe confirmar la nueva contraseña";
    } else if (passwordData.passwordNuevo !== passwordData.passwordConfirmar) {
      newErrors.passwordConfirmar = "Las contraseñas no coinciden";
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (passwordData.passwordActual && passwordData.passwordNuevo &&
        passwordData.passwordActual === passwordData.passwordNuevo) {
      newErrors.passwordNuevo = "La nueva contraseña debe ser diferente a la actual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrija los errores en el formulario");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.put(ENDPOINTS.USUARIOS.CAMBIAR_PASSWORD(user.id), {
        passwordActual: passwordData.passwordActual,
        passwordNuevo: passwordData.passwordNuevo,
      });

      toast.success("Contraseña actualizada exitosamente");

      // Marcar que completó el cambio de contraseña
      completarCambioPassword();

      // Redirigir al dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);

      if (error.response?.status === 400) {
        toast.error("La contraseña actual es incorrecta");
        setErrors({ passwordActual: "La contraseña actual es incorrecta" });
      } else {
        toast.error(error.response?.data || "Error al cambiar la contraseña");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="cambiar-password-obligatorio-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                {/* Header con advertencia */}
                <div className="text-center mb-4">
                  <div className="icon-warning mb-3">
                    <FaExclamationTriangle size={50} className="text-warning" />
                  </div>
                  <h3 className="fw-bold mb-2">Cambio de Contraseña Obligatorio</h3>
                  <p className="text-muted">
                    Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
                  </p>
                </div>

                {/* Alert informativo */}
                <Alert variant="info" className="mb-4">
                  <Alert.Heading className="h6 mb-2">
                    <FaKey className="me-2" />
                    Información importante
                  </Alert.Heading>
                  <p className="mb-0 small">
                    Tu contraseña temporal es tu <strong>DNI</strong>. Por favor, cámbiala por una contraseña segura
                    que solo tú conozcas (mínimo 6 caracteres).
                  </p>
                </Alert>

                {/* Formulario */}
                <Form onSubmit={handleSubmit}>
                  {/* Contraseña actual (DNI) */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaLock className="me-2" />
                      Contraseña Actual (tu DNI)
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="passwordActual"
                      placeholder="Ingresa tu DNI"
                      value={passwordData.passwordActual}
                      onChange={handleChange}
                      isInvalid={!!errors.passwordActual}
                      disabled={isSubmitting}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.passwordActual}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Nueva contraseña */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaKey className="me-2" />
                      Nueva Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="passwordNuevo"
                      placeholder="Mínimo 6 caracteres"
                      value={passwordData.passwordNuevo}
                      onChange={handleChange}
                      isInvalid={!!errors.passwordNuevo}
                      disabled={isSubmitting}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.passwordNuevo}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Confirmar contraseña */}
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaKey className="me-2" />
                      Confirmar Nueva Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="passwordConfirmar"
                      placeholder="Repite la nueva contraseña"
                      value={passwordData.passwordConfirmar}
                      onChange={handleChange}
                      isInvalid={!!errors.passwordConfirmar}
                      disabled={isSubmitting}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.passwordConfirmar}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Botones */}
                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Cambiando contraseña...
                        </>
                      ) : (
                        <>
                          <FaKey className="me-2" />
                          Cambiar Contraseña
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleLogout}
                      disabled={isSubmitting}
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Estilos personalizados */}
      <style>{`
        .cambiar-password-obligatorio-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .icon-warning {
          animation: pulse-warning 2s infinite;
        }

        @keyframes pulse-warning {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default CambiarPasswordObligatorio;
