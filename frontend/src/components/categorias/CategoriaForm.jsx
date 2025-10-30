// src/components/categorias/CategoriaForm.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { FaSave, FaArrowLeft, FaTags } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";

const CategoriaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Estados
  const [formData, setFormData] = useState({
    nombre: "",
    activo: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Cargar datos si es modo edición
  useEffect(() => {
    if (isEditMode) {
      fetchCategoria();
    }
  }, [id]);

  const fetchCategoria = async () => {
    setLoadingData(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.CATEGORIAS.BY_ID(id));
      const data = response.data;
      setFormData({
        nombre: data.nombre || "",
        activo: data.activo !== undefined ? data.activo : true,
      });
    } catch (error) {
      console.error("Error al cargar categoría:", error);
      toast.error(error.errorMessage || "Error al cargar los datos de la categoría");
      navigate("/categorias");
    } finally {
      setLoadingData(false);
    }
  };

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo del submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrija los errores en el formulario");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        nombre: formData.nombre.trim(),
        activo: formData.activo,
      };

      if (isEditMode) {
        await axiosInstance.put(ENDPOINTS.CATEGORIAS.BY_ID(id), dataToSend);
        toast.success("Categoría actualizada correctamente");
      } else {
        await axiosInstance.post(ENDPOINTS.CATEGORIAS.BASE, dataToSend);
        toast.success("Categoría creada correctamente");
      }

      navigate("/categorias");
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      toast.error(error.errorMessage || `Error al ${isEditMode ? "actualizar" : "crear"} la categoría`);
    } finally {
      setLoading(false);
    }
  };

  // Loading inicial
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
        <Card.Header className="bg-warning text-dark">
          <h4 className="mb-0">
            <FaTags className="me-2" />
            {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
          </h4>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Nombre */}
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Nombre <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Ej: Ficción, Ciencia, Historia..."
                    value={formData.nombre}
                    onChange={handleChange}
                    isInvalid={!!errors.nombre}
                    disabled={loading}
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Mínimo 3 caracteres, máximo 100
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Activo */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="activo"
                    label="Categoría activa"
                    checked={formData.activo}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Las categorías inactivas no aparecerán en los formularios
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Botones */}
            <div className="d-flex gap-2 mt-4">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    {isEditMode ? "Actualizar" : "Crear"} Categoría
                  </>
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/categorias")}
                disabled={loading}
              >
                <FaArrowLeft className="me-2" />
                Volver
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CategoriaForm;
