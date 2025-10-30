// src/components/libros/LibroForm.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaBook, FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { ENDPOINTS } from '../../api/endpoints';

const LibroForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si existe ID, estamos en modo EDICIÓN
  const isEditMode = Boolean(id);

  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    autores: '',
    idCategoria: '',
    ejemplares: 1,
    disponible: true
  });

  // Estados auxiliares
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingLibro, setLoadingLibro] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Si estamos en modo edición, cargar datos del libro
  useEffect(() => {
    if (isEditMode) {
      fetchLibro();
    }
  }, [id]);

  /**
   * Obtener lista de categorías activas
   */
  const fetchCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const response = await api.get(ENDPOINTS.CATEGORIAS.ACTIVAS);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoadingCategorias(false);
    }
  };

  /**
   * Obtener datos del libro a editar
   */
  const fetchLibro = async () => {
    setLoadingLibro(true);
    try {
      const response = await api.get(ENDPOINTS.LIBROS.BY_ID(id));
      const libro = response.data;

      // El backend retorna 'nombreCategoria', pero necesitamos 'idCategoria'
      // Buscar el ID de la categoría por nombre
      const categoriaEncontrada = categorias.find(
        (cat) => cat.nombre === libro.nombreCategoria
      );

      setFormData({
        titulo: libro.titulo || '',
        autores: libro.autores || '',
        idCategoria: categoriaEncontrada?.idCategoria || '',
        ejemplares: libro.ejemplares || 0,
        disponible: libro.disponible ?? true
      });
    } catch (error) {
      console.error('Error al cargar libro:', error);
      toast.error(error.errorMessage || 'Error al cargar los datos del libro');
      navigate('/libros'); // Volver a la lista si hay error
    } finally {
      setLoadingLibro(false);
    }
  };

  /**
   * Manejar cambios en los inputs
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  /**
   * Validar formulario
   */
  const validateForm = () => {
    const newErrors = {};

    // Título requerido y longitud mínima/máxima
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (formData.titulo.trim().length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres';
    } else if (formData.titulo.length > 255) {
      newErrors.titulo = 'El título no puede exceder 255 caracteres';
    }

    // Autores requerido y longitud máxima
    if (!formData.autores.trim()) {
      newErrors.autores = 'Los autores son obligatorios';
    } else if (formData.autores.trim().length < 3) {
      newErrors.autores = 'Los autores deben tener al menos 3 caracteres';
    } else if (formData.autores.length > 250) {
      newErrors.autores = 'Los autores no pueden exceder 250 caracteres';
    }

    // Categoría requerida
    if (!formData.idCategoria) {
      newErrors.idCategoria = 'Debe seleccionar una categoría';
    }

    // Ejemplares: validar que sea un número positivo
    const ejemplares = Number(formData.ejemplares);
    if (isNaN(ejemplares)) {
      newErrors.ejemplares = 'Los ejemplares deben ser un número';
    } else if (ejemplares < 1) {
      newErrors.ejemplares = 'Debe haber al menos 1 ejemplar';
    } else if (ejemplares > 9999) {
      newErrors.ejemplares = 'Los ejemplares no pueden exceder 9999';
    } else if (!Number.isInteger(ejemplares)) {
      newErrors.ejemplares = 'Los ejemplares deben ser un número entero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Enviar formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar
    if (!validateForm()) {
      toast.error('Por favor corrija los errores del formulario');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos según el DTO del backend (LibroRegistroDTO)
      const dataToSend = {
        titulo: formData.titulo.trim(),
        autores: formData.autores.trim() || null,
        idCategoria: parseInt(formData.idCategoria),
        ejemplares: parseInt(formData.ejemplares),
        disponible: formData.disponible
      };

      if (isEditMode) {
        // Actualizar libro existente
        await api.put(ENDPOINTS.LIBROS.BY_ID(id), dataToSend);
        toast.success('Libro actualizado exitosamente');
      } else {
        // Crear nuevo libro
        await api.post(ENDPOINTS.LIBROS.BASE, dataToSend);
        toast.success('Libro creado exitosamente');
      }

      // Volver a la lista
      navigate('/libros');

    } catch (error) {
      console.error('Error al guardar libro:', error);

      // Manejar errores de validación del backend
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Error de validación');
      } else {
        toast.error('Error al guardar el libro');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancelar y volver a la lista
   */
  const handleCancel = () => {
    navigate('/libros');
  };

  // Mostrar spinner mientras se cargan las categorías en modo edición
  if (isEditMode && (loadingLibro || loadingCategorias)) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando datos del libro...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2>
            <FaBook className="me-2" />
            {isEditMode ? 'Editar Libro' : 'Nuevo Libro'}
          </h2>
          <p className="text-muted">
            {isEditMode
              ? 'Actualice los datos del libro en el formulario'
              : 'Complete los datos del nuevo libro'}
          </p>
        </Col>
      </Row>

      {/* Formulario */}
      <Row>
        <Col lg={8} xl={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Título */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Título <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    isInvalid={!!errors.titulo}
                    placeholder="Ingrese el título del libro"
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.titulo}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Autores */}
                <Form.Group className="mb-3">
                  <Form.Label>Autores</Form.Label>
                  <Form.Control
                    type="text"
                    name="autores"
                    value={formData.autores}
                    onChange={handleChange}
                    isInvalid={!!errors.autores}
                    placeholder="Ingrese el/los autor(es)"
                    maxLength={250}
                  />
                  <Form.Text className="text-muted">
                    Máximo 250 caracteres ({formData.autores.length}/250)
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.autores}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Categoría */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Categoría <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="idCategoria"
                    value={formData.idCategoria}
                    onChange={handleChange}
                    isInvalid={!!errors.idCategoria}
                    disabled={loadingCategorias}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.idCategoria} value={cat.idCategoria}>
                        {cat.nombre}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.idCategoria}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Ejemplares */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Ejemplares <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="ejemplares"
                    value={formData.ejemplares}
                    onChange={handleChange}
                    isInvalid={!!errors.ejemplares}
                    min={0}
                    placeholder="Ingrese la cantidad de ejemplares"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ejemplares}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Disponible */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="disponible"
                    label="Libro disponible para préstamo"
                    checked={formData.disponible}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Botones */}
                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
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
                        {isEditMode ? 'Actualizar' : 'Crear'} Libro
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <FaArrowLeft className="me-2" />
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LibroForm;
