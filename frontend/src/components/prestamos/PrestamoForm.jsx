// src/components/prestamos/PrestamoForm.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col, Alert, ListGroup } from "react-bootstrap";
import { FaSave, FaArrowLeft, FaSearch } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";

const PrestamoForm = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [formData, setFormData] = useState({
    idUsuario: "",
    idLibro: "",
    fechaPrestamo: new Date().toISOString().split("T")[0], // Hoy por defecto
    fechaDevolucionEsperada: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Estados para búsqueda de usuario
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [buscandoUsuario, setBuscandoUsuario] = useState(false);

  // Estados para selección de libro
  const [librosDisponibles, setLibrosDisponibles] = useState([]);
  const [loadingLibros, setLoadingLibros] = useState(false);

  // Cargar libros disponibles al montar el componente
  useEffect(() => {
    fetchLibrosDisponibles();
  }, []);

  const fetchLibrosDisponibles = async () => {
    setLoadingLibros(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.LIBROS.DISPONIBLES, {
        params: { page: 0, size: 1000 } // Traer todos los disponibles
      });
      // Ordenar libros alfabéticamente por título
      const librosOrdenados = (response.data.content || []).sort((a, b) =>
        a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' })
      );
      setLibrosDisponibles(librosOrdenados);
    } catch (error) {
      console.error("Error al cargar libros:", error);
      toast.error(error.errorMessage || "Error al cargar libros disponibles");
    } finally {
      setLoadingLibros(false);
    }
  };

  // Buscar usuario por DNI
  const handleBuscarUsuario = async () => {
    if (!dniBusqueda.trim()) {
      toast.warning("Ingrese un DNI para buscar");
      return;
    }

    if (!/^\d{7,8}$/.test(dniBusqueda.trim())) {
      toast.error("El DNI debe tener 7 u 8 dígitos");
      return;
    }

    setBuscandoUsuario(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.USUARIOS.BUSCAR_DNI, {
        params: { dni: dniBusqueda.trim() }
      });

      if (response.data) {
        setUsuarioEncontrado(response.data);
        // El backend puede devolver 'id' o 'idUsuario' según el DTO
        const userId = response.data.idUsuario || response.data.id;
        setFormData(prevData => ({ ...prevData, idUsuario: userId }));
        setErrors(prevErrors => ({ ...prevErrors, idUsuario: "" })); // Limpiar error
        toast.success("Usuario encontrado");
      } else {
        toast.error("Usuario no encontrado");
        setUsuarioEncontrado(null);
        setFormData(prevData => ({ ...prevData, idUsuario: "" }));
      }
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      toast.error(error.errorMessage || "Usuario no encontrado o error en la búsqueda");
      setUsuarioEncontrado(null);
      setFormData(prevData => ({ ...prevData, idUsuario: "" }));
    } finally {
      setBuscandoUsuario(false);
    }
  };

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    // Usuario: requerido
    if (!formData.idUsuario) {
      newErrors.idUsuario = "Debe seleccionar un usuario";
    }

    // Libro: requerido
    if (!formData.idLibro) {
      newErrors.idLibro = "Debe seleccionar un libro";
    }

    // Fecha de préstamo: requerida y no puede ser futura
    if (!formData.fechaPrestamo) {
      newErrors.fechaPrestamo = "La fecha de préstamo es requerida";
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaPrestamo = new Date(formData.fechaPrestamo);
      fechaPrestamo.setHours(0, 0, 0, 0);

      if (fechaPrestamo > hoy) {
        newErrors.fechaPrestamo = "La fecha de préstamo no puede ser futura";
      }
    }

    // Fecha de devolución esperada: requerida y validaciones múltiples
    if (!formData.fechaDevolucionEsperada) {
      newErrors.fechaDevolucionEsperada = "La fecha de devolución esperada es requerida";
    } else {
      // Normalizar fechas usando strings para evitar problemas de zona horaria
      const hoyStr = new Date().toISOString().split("T")[0];
      const fechaDevolucionStr = formData.fechaDevolucionEsperada;
      const fechaPrestamoStr = formData.fechaPrestamo;

      // Comparación de strings (formato YYYY-MM-DD)
      // Debe ser posterior a hoy (mayor que hoy, no igual)
      if (fechaDevolucionStr <= hoyStr) {
        newErrors.fechaDevolucionEsperada = "La fecha de devolución debe ser posterior a hoy";
      }
      // Debe ser posterior a la fecha de préstamo
      else if (fechaDevolucionStr <= fechaPrestamoStr) {
        newErrors.fechaDevolucionEsperada = "La fecha de devolución debe ser posterior a la fecha de préstamo";
      }
      // Máximo 30 días de préstamo
      else {
        const fechaPrestamo = new Date(fechaPrestamoStr + "T00:00:00");
        const fechaDevolucion = new Date(fechaDevolucionStr + "T00:00:00");
        const diferenciaDias = Math.ceil((fechaDevolucion - fechaPrestamo) / (1000 * 60 * 60 * 24));
        if (diferenciaDias > 30) {
          newErrors.fechaDevolucionEsperada = "El plazo de préstamo no puede exceder 30 días";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrija los errores del formulario");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(ENDPOINTS.PRESTAMOS.BASE, {
        idUsuario: parseInt(formData.idUsuario),
        idLibro: parseInt(formData.idLibro),
        fechaPrestamo: formData.fechaPrestamo,
        fechaDevolucionEsperada: formData.fechaDevolucionEsperada,
      });

      toast.success("Préstamo registrado exitosamente");
      navigate("/prestamos");
    } catch (error) {
      console.error("Error al registrar préstamo:", error);
      toast.error(error.errorMessage || "Error al registrar el préstamo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">📚 Registrar Nuevo Préstamo</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Búsqueda de Usuario por DNI */}
            <Row className="mb-4">
              <Col md={12}>
                <h5 className="mb-3">1. Buscar Usuario</h5>
                <Form.Group>
                  <Form.Label>DNI del Usuario</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Ingrese DNI (7-8 dígitos)"
                      value={dniBusqueda}
                      onChange={(e) => setDniBusqueda(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleBuscarUsuario())}
                      maxLength={8}
                    />
                    <Button
                      variant="primary"
                      onClick={handleBuscarUsuario}
                      disabled={buscandoUsuario}
                    >
                      {buscandoUsuario ? "Buscando..." : <><FaSearch className="me-2" />Buscar</>}
                    </Button>
                  </div>
                  {errors.idUsuario && <Form.Text className="text-danger">{errors.idUsuario}</Form.Text>}
                </Form.Group>

                {usuarioEncontrado && (
                  <Alert variant="success" className="mt-3">
                    <strong>✅ Usuario seleccionado correctamente:</strong>
                    <ListGroup className="mt-2">
                      <ListGroup.Item>
                        <strong>ID:</strong> {usuarioEncontrado.idUsuario || usuarioEncontrado.id}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Nombre:</strong> {usuarioEncontrado.nombre} {usuarioEncontrado.apellido}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>DNI:</strong> {usuarioEncontrado.dni}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Tipo:</strong> {usuarioEncontrado.tipoUsuario}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Email:</strong> {usuarioEncontrado.email || "N/A"}
                      </ListGroup.Item>
                    </ListGroup>
                  </Alert>
                )}
              </Col>
            </Row>

            {/* Selección de Libro */}
            <Row className="mb-4">
              <Col md={12}>
                <h5 className="mb-3">2. Seleccionar Libro</h5>
                <Form.Group>
                  <Form.Label>Libro Disponible</Form.Label>
                  <Form.Select
                    name="idLibro"
                    value={formData.idLibro}
                    onChange={handleChange}
                    isInvalid={!!errors.idLibro}
                    disabled={loadingLibros}
                  >
                    <option value="">
                      {loadingLibros ? "Cargando libros..." : "Seleccione un libro"}
                    </option>
                    {librosDisponibles.map((libro) => (
                      <option key={libro.idLibro} value={libro.idLibro}>
                        {libro.titulo} - {libro.autores} (Ejemplares: {libro.ejemplares})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.idLibro}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Fechas */}
            <Row className="mb-4">
              <Col md={12}>
                <h5 className="mb-3">3. Fechas del Préstamo</h5>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fecha de Préstamo</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaPrestamo"
                    value={formData.fechaPrestamo}
                    onChange={handleChange}
                    isInvalid={!!errors.fechaPrestamo}
                    max={new Date().toISOString().split("T")[0]} // Máximo hoy
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fechaPrestamo}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    No puede ser una fecha futura
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fecha de Devolución Esperada</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaDevolucionEsperada"
                    value={formData.fechaDevolucionEsperada}
                    onChange={handleChange}
                    isInvalid={!!errors.fechaDevolucionEsperada}
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Mínimo mañana
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fechaDevolucionEsperada}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Debe ser posterior a hoy. Máximo 30 días de préstamo
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Botones */}
            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                onClick={() => navigate("/prestamos")}
                disabled={loading}
              >
                <FaArrowLeft className="me-2" />
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !usuarioEncontrado}
              >
                {loading ? (
                  "Registrando..."
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Registrar Préstamo
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

export default PrestamoForm;
