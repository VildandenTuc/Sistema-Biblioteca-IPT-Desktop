// src/components/usuarios/UsuarioForm.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaSave, FaArrowLeft, FaUserPlus } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";

const UsuarioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    tipoUsuario: "ALUMNO",
    email: "",
    telefono: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar datos del usuario en modo edición
  useEffect(() => {
    if (isEditMode) {
      fetchUsuario();
    }
  }, [id]);

  const fetchUsuario = async () => {
    setLoadingData(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.USUARIOS.BY_ID(id));
      const usuario = response.data;

      // Cargar datos (UsuarioDetalleDTO)
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni, // DNI no se puede editar, pero lo mostramos
        tipoUsuario: usuario.tipoUsuario,
        email: usuario.email,
        telefono: usuario.telefono || "",
      });
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      toast.error(error.errorMessage || "Error al cargar usuario");
      navigate("/usuarios");
    } finally {
      setLoadingData(false);
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validaciones del formulario
  const validateForm = () => {
    const newErrors = {};

    // Nombre: requerido, min 2, max 50 caracteres
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.length > 50) {
      newErrors.nombre = 'El nombre no puede exceder 50 caracteres';
    }

    // Apellido: requerido, min 2, max 50 caracteres
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    } else if (formData.apellido.length > 50) {
      newErrors.apellido = 'El apellido no puede exceder 50 caracteres';
    }

    // DNI: solo validar al crear (no se puede editar)
    if (!isEditMode) {
      if (!formData.dni.trim()) {
        newErrors.dni = 'El DNI es obligatorio';
      } else if (!/^\d{7,8}$/.test(formData.dni.trim())) {
        newErrors.dni = 'El DNI debe tener entre 7 y 8 dígitos numéricos';
      }
    }

    // Tipo de usuario: requerido
    if (!formData.tipoUsuario) {
      newErrors.tipoUsuario = 'El tipo de usuario es obligatorio';
    }

    // Email: validación mejorada
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'El email no es válido. Formato esperado: usuario@ejemplo.com';
      } else if (formData.email.length > 100) {
        newErrors.email = 'El email no puede exceder 100 caracteres';
      }
    }

    // Teléfono: validación mejorada
    if (formData.telefono && formData.telefono.trim()) {
      const telefonoLimpio = formData.telefono.trim();
      if (!/^\d+$/.test(telefonoLimpio)) {
        newErrors.telefono = 'El teléfono debe contener solo números';
      } else if (telefonoLimpio.length < 10) {
        newErrors.telefono = 'El teléfono debe tener al menos 10 dígitos';
      } else if (telefonoLimpio.length > 15) {
        newErrors.telefono = 'El teléfono no puede exceder 15 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrija los errores del formulario');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // ACTUALIZAR usuario - usa UsuarioActualizarDTO (sin DNI)
        const updateDTO = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          tipoUsuario: formData.tipoUsuario,
          email: formData.email.trim() || null,
          telefono: formData.telefono.trim() || null,
        };

        await axiosInstance.put(ENDPOINTS.USUARIOS.BY_ID(id), updateDTO);
        toast.success("Usuario actualizado correctamente");
      } else {
        // CREAR usuario - usa UsuarioRegistroDTO (con DNI, sin password ni rol)
        const createDTO = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          tipoUsuario: formData.tipoUsuario,
          email: formData.email.trim() || null,
          telefono: formData.telefono.trim() || null,
        };

        await axiosInstance.post(ENDPOINTS.USUARIOS.BASE, createDTO);
        toast.success("Usuario creado correctamente");
      }

      navigate("/usuarios");
    } catch (error) {
      console.error("Error al guardar usuario:", error);

      // Manejo específico de errores de duplicados (409)
      if (error.response && error.response.status === 409) {
        const errorMsg = error.response.data?.message || error.errorMessage || "";

        // Determinar qué campo está duplicado basándose en el mensaje
        if (errorMsg.toLowerCase().includes("email")) {
          toast.error("El email ya está registrado en el sistema");
        } else if (errorMsg.toLowerCase().includes("dni")) {
          toast.error("El DNI ya está registrado en el sistema");
        } else {
          toast.error("Ya existe un usuario con estos datos en el sistema");
        }
      } else {
        toast.error(error.errorMessage || "Error al guardar usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando datos...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">
            <FaUserPlus className="me-2" />
            {isEditMode ? "Editar Usuario" : "Nuevo Usuario"}
          </h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Nombre <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese el nombre"
                    isInvalid={!!errors.nombre}
                    maxLength={50}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Apellido <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ingrese el apellido"
                    isInvalid={!!errors.apellido}
                    maxLength={50}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    DNI <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="12345678"
                    disabled={isEditMode} // DNI no se puede editar
                    isInvalid={!!errors.dni}
                    maxLength={8}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dni}
                  </Form.Control.Feedback>
                  {isEditMode && (
                    <Form.Text className="text-muted">El DNI no se puede modificar</Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Tipo de Usuario <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="tipoUsuario"
                    value={formData.tipoUsuario}
                    onChange={handleChange}
                    isInvalid={!!errors.tipoUsuario}
                  >
                    <option value="ALUMNO">Alumno</option>
                    <option value="DOCENTE">Docente</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.tipoUsuario}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@ejemplo.com"
                    isInvalid={!!errors.email}
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="3814123456"
                    isInvalid={!!errors.telefono}
                    maxLength={15}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telefono}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Solo números, mínimo 10 dígitos
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Botones */}
            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button variant="secondary" onClick={() => navigate("/usuarios")}>
                <FaArrowLeft className="me-2" />
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    {isEditMode ? "Actualizar" : "Crear"} Usuario
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UsuarioForm;
