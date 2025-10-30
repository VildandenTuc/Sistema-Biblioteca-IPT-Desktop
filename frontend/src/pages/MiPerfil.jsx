// src/pages/MiPerfil.jsx

import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaUserTag, FaSave, FaTimes, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../api/axiosConfig";
import { ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";

const MiPerfil = () => {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  // Estados para edición de perfil
  const [formData, setFormData] = useState({
    email: "",
    telefono: "",
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    passwordActual: "",
    passwordNuevo: "",
    passwordConfirmar: "",
  });

  // Estados de validación
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Cargar datos del usuario
  useEffect(() => {
    fetchUsuario();
  }, [user]);

  const fetchUsuario = async () => {
    if (!user || !user.id) return;

    try {
      setLoading(true);
      const response = await axios.get(ENDPOINTS.USUARIOS.BY_ID(user.id));
      setUsuario(response.data);
      setFormData({
        email: response.data.email || "",
        telefono: response.data.telefono || "",
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      toast.error(error.errorMessage || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en formulario de perfil
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Manejar cambios en formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validar formulario de perfil
  const validateForm = () => {
    const newErrors = {};

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    if (formData.email && formData.email.length > 100) {
      newErrors.email = "El email no puede exceder 100 caracteres";
    }

    // Teléfono
    if (formData.telefono) {
      const telefonoRegex = /^[0-9]{10,15}$/;
      if (!telefonoRegex.test(formData.telefono)) {
        newErrors.telefono = "El teléfono debe tener entre 10 y 15 dígitos numéricos";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar formulario de contraseña
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.passwordActual) {
      newErrors.passwordActual = "La contraseña actual es obligatoria";
    }

    if (!passwordData.passwordNuevo) {
      newErrors.passwordNuevo = "La nueva contraseña es obligatoria";
    } else if (passwordData.passwordNuevo.length < 6) {
      newErrors.passwordNuevo = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!passwordData.passwordConfirmar) {
      newErrors.passwordConfirmar = "Debe confirmar la nueva contraseña";
    } else if (passwordData.passwordNuevo !== passwordData.passwordConfirmar) {
      newErrors.passwordConfirmar = "Las contraseñas no coinciden";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar cambios de perfil
  const handleSubmitPerfil = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      // Preparar datos para actualización (UsuarioActualizarDTO)
      const dataToUpdate = {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        tipoUsuario: usuario.tipoUsuario,
        email: formData.email || null,
        telefono: formData.telefono || null,
      };

      await axios.put(ENDPOINTS.USUARIOS.BY_ID(user.id), dataToUpdate);

      // Recargar datos ANTES de mostrar éxito
      await fetchUsuario();

      // Solo mostrar éxito si todo salió bien
      toast.success("Perfil actualizado exitosamente");
      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error(error.errorMessage || "Error al actualizar el perfil");
    }
  };

  // Cambiar contraseña
  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    try {
      await axios.put(ENDPOINTS.USUARIOS.CAMBIAR_PASSWORD(user.id), {
        passwordActual: passwordData.passwordActual,
        passwordNuevo: passwordData.passwordNuevo,
      });

      toast.success("Contraseña cambiada exitosamente");
      setCambiandoPassword(false);
      setPasswordData({
        passwordActual: "",
        passwordNuevo: "",
        passwordConfirmar: "",
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast.error(error.errorMessage || "Error al cambiar la contraseña");
    }
  };

  // Cancelar edición
  const handleCancelar = () => {
    setFormData({
      email: usuario.email || "",
      telefono: usuario.telefono || "",
    });
    setErrors({});
    setEditando(false);
  };

  // Cancelar cambio de contraseña
  const handleCancelarPassword = () => {
    setPasswordData({
      passwordActual: "",
      passwordNuevo: "",
      passwordConfirmar: "",
    });
    setPasswordErrors({});
    setCambiandoPassword(false);
  };

  // Obtener badge de tipo de usuario
  const getTipoBadge = (tipo) => {
    const badges = {
      ALUMNO: "primary",
      DOCENTE: "success",
      ADMINISTRATIVO: "warning",
    };
    return badges[tipo] || "secondary";
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">No se pudo cargar la información del perfil</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FaUser className="me-2" />
            Mi Perfil
          </h2>
        </Col>
      </Row>

      <Row>
        {/* Información Personal */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Información Personal
              </h5>
            </Card.Header>
            <Card.Body>
              {!editando ? (
                <>
                  {/* Vista de solo lectura */}
                  <div className="mb-3">
                    <strong>
                      <FaIdCard className="me-2 text-primary" />
                      DNI:
                    </strong>
                    <p className="mb-2 ms-4">{usuario.dni}</p>
                  </div>

                  <div className="mb-3">
                    <strong>
                      <FaUser className="me-2 text-primary" />
                      Nombre Completo:
                    </strong>
                    <p className="mb-2 ms-4">
                      {usuario.apellido}, {usuario.nombre}
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>
                      <FaUserTag className="me-2 text-primary" />
                      Tipo de Usuario:
                    </strong>
                    <p className="mb-2 ms-4">
                      <span className={`badge bg-${getTipoBadge(usuario.tipoUsuario)}`}>
                        {usuario.tipoUsuario}
                      </span>
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>
                      <FaEnvelope className="me-2 text-primary" />
                      Email:
                    </strong>
                    <p className="mb-2 ms-4">{usuario.email || "No especificado"}</p>
                  </div>

                  <div className="mb-3">
                    <strong>
                      <FaPhone className="me-2 text-primary" />
                      Teléfono:
                    </strong>
                    <p className="mb-2 ms-4">{usuario.telefono || "No especificado"}</p>
                  </div>

                  <div className="d-grid gap-2">
                    <Button variant="primary" onClick={() => setEditando(true)}>
                      <FaSave className="me-2" />
                      Editar Perfil
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Formulario de edición */}
                  <Form onSubmit={handleSubmitPerfil}>
                    {/* DNI (no editable) */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaIdCard className="me-2" />
                        DNI
                      </Form.Label>
                      <Form.Control type="text" value={usuario.dni} disabled />
                      <Form.Text className="text-muted">El DNI no puede ser modificado</Form.Text>
                    </Form.Group>

                    {/* Nombre (no editable) */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaUser className="me-2" />
                        Nombre
                      </Form.Label>
                      <Form.Control type="text" value={usuario.nombre} disabled />
                    </Form.Group>

                    {/* Apellido (no editable) */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaUser className="me-2" />
                        Apellido
                      </Form.Label>
                      <Form.Control type="text" value={usuario.apellido} disabled />
                    </Form.Group>

                    {/* Email (editable) */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaEnvelope className="me-2" />
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="correo@ejemplo.com"
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Teléfono (editable) */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaPhone className="me-2" />
                        Teléfono
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        isInvalid={!!errors.telefono}
                        placeholder="381XXXXXXX"
                      />
                      <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
                      <Form.Text className="text-muted">Solo números, entre 10 y 15 dígitos</Form.Text>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button variant="success" type="submit">
                        <FaSave className="me-2" />
                        Guardar Cambios
                      </Button>
                      <Button variant="secondary" onClick={handleCancelar}>
                        <FaTimes className="me-2" />
                        Cancelar
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Cambiar Contraseña */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <FaLock className="me-2" />
                Seguridad
              </h5>
            </Card.Header>
            <Card.Body>
              {!cambiandoPassword ? (
                <>
                  <Alert variant="info">
                    <strong>Cambiar Contraseña</strong>
                    <p className="mb-0 mt-2">
                      Por seguridad, te recomendamos cambiar tu contraseña periódicamente.
                    </p>
                  </Alert>

                  <div className="d-grid gap-2">
                    <Button variant="warning" onClick={() => setCambiandoPassword(true)}>
                      <FaLock className="me-2" />
                      Cambiar Contraseña
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Form onSubmit={handleSubmitPassword}>
                    {/* Contraseña Actual */}
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña Actual</Form.Label>
                      <Form.Control
                        type="password"
                        name="passwordActual"
                        value={passwordData.passwordActual}
                        onChange={handlePasswordChange}
                        isInvalid={!!passwordErrors.passwordActual}
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.passwordActual}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Nueva Contraseña */}
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="passwordNuevo"
                        value={passwordData.passwordNuevo}
                        onChange={handlePasswordChange}
                        isInvalid={!!passwordErrors.passwordNuevo}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.passwordNuevo}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Confirmar Contraseña */}
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="passwordConfirmar"
                        value={passwordData.passwordConfirmar}
                        onChange={handlePasswordChange}
                        isInvalid={!!passwordErrors.passwordConfirmar}
                        placeholder="Repite la nueva contraseña"
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.passwordConfirmar}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button variant="warning" type="submit">
                        <FaLock className="me-2" />
                        Cambiar Contraseña
                      </Button>
                      <Button variant="secondary" onClick={handleCancelarPassword}>
                        <FaTimes className="me-2" />
                        Cancelar
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MiPerfil;
