// src/components/prestamos/DevolucionForm.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col, Alert, ListGroup, Badge } from "react-bootstrap";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";

const DevolucionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID del préstamo

  const [prestamo, setPrestamo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos del préstamo
  useEffect(() => {
    const fetchPrestamo = async () => {
      try {
        // Obtener todos los préstamos y buscar el que coincida con el ID
        const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BASE);
        const prestamoEncontrado = response.data.find((p) => p.idPrestamo === parseInt(id));

        if (!prestamoEncontrado) {
          toast.error("Préstamo no encontrado");
          navigate("/prestamos");
          return;
        }

        if (prestamoEncontrado.devuelto) {
          toast.warning("Este préstamo ya fue devuelto");
          navigate("/prestamos");
          return;
        }

        setPrestamo(prestamoEncontrado);
      } catch (error) {
        console.error("Error al cargar préstamo:", error);
        toast.error("Error al cargar información del préstamo");
        navigate("/prestamos");
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamo();
  }, [id, navigate]);

  // Verificar si habrá falta
  const verificarFalta = () => {
    if (!prestamo) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    const fechaEsperada = new Date(prestamo.fechaDevolucionEsperada + 'T00:00:00');
    return hoy > fechaEsperada;
  };

  // Calcular días de retraso
  const calcularDiasRetraso = () => {
    if (!prestamo) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas
    const fechaEsperada = new Date(prestamo.fechaDevolucionEsperada + 'T00:00:00');
    const diffTime = hoy - fechaEsperada;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Formatear fecha (evita problema de timezone)
  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    // Agregar 'T00:00:00' para forzar interpretación como hora local
    const fechaLocal = new Date(fecha + 'T00:00:00');
    return fechaLocal.toLocaleDateString("es-AR");
  };

  // Registrar devolución
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prestamo) return;

    setSubmitting(true);

    try {
      await axiosInstance.put(ENDPOINTS.PRESTAMOS.DEVOLVER, {
        idPrestamo: parseInt(id),
      });

      toast.success("Devolución registrada exitosamente");
      navigate("/prestamos");
    } catch (error) {
      console.error("Error al registrar devolución:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al registrar la devolución");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (!prestamo) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Préstamo no encontrado</Alert>
        <Button variant="secondary" onClick={() => navigate("/prestamos")}>
          <FaArrowLeft className="me-2" />
          Volver al Listado
        </Button>
      </Container>
    );
  }

  const hayFalta = verificarFalta();
  const diasRetraso = calcularDiasRetraso();

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">🔄 Registrar Devolución de Préstamo</h4>
        </Card.Header>
        <Card.Body>
          {/* Advertencia de falta */}
          {hayFalta && (
            <Alert variant="warning" className="mb-4">
              <strong>⚠️ Atención:</strong> Este préstamo se está devolviendo con{" "}
              <strong>{diasRetraso} día(s) de retraso</strong>. Se registrará una falta.
            </Alert>
          )}

          {/* Información del Préstamo */}
          <h5 className="mb-3">Información del Préstamo</h5>
          <ListGroup className="mb-4">
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>ID Préstamo:</strong></Col>
                <Col sm={8}>{prestamo.idPrestamo}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Usuario:</strong></Col>
                <Col sm={8}>{prestamo.nombreUsuario} {prestamo.apellidoUsuario}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Libro:</strong></Col>
                <Col sm={8}>{prestamo.tituloLibro}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Fecha Préstamo:</strong></Col>
                <Col sm={8}>{formatearFecha(prestamo.fechaPrestamo)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Fecha Devolución Esperada:</strong></Col>
                <Col sm={8}>
                  {formatearFecha(prestamo.fechaDevolucionEsperada)}{" "}
                  {hayFalta && <Badge bg="danger" className="ms-2">Vencido</Badge>}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Fecha Devolución Real:</strong></Col>
                <Col sm={8}>
                  <Badge bg="info">{new Date().toLocaleDateString("es-AR")} (Hoy)</Badge>
                </Col>
              </Row>
            </ListGroup.Item>
            {prestamo.observacion && (
              <ListGroup.Item>
                <Row>
                  <Col sm={4}><strong>Observación:</strong></Col>
                  <Col sm={8}>{prestamo.observacion}</Col>
                </Row>
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>¿Habrá Falta?</strong></Col>
                <Col sm={8}>
                  {hayFalta ? (
                    <Badge bg="danger">Sí - {diasRetraso} día(s) de retraso</Badge>
                  ) : (
                    <Badge bg="success">No</Badge>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>

          {/* Confirmación */}
          <Alert variant="info">
            <strong>ℹ️ Información:</strong> Al confirmar, se registrará la devolución de este préstamo
            con la fecha actual como fecha de devolución real.
            {hayFalta && " Se registrará automáticamente una falta por devolución tardía."}
          </Alert>

          {/* Formulario */}
          <Form onSubmit={handleSubmit}>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                onClick={() => navigate("/prestamos")}
                disabled={submitting}
              >
                <FaArrowLeft className="me-2" />
                Cancelar
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  "Registrando..."
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Confirmar Devolución
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

export default DevolucionForm;
