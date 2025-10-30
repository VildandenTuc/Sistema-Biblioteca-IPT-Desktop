// src/components/prestamos/PrestamoDetail.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Button, ListGroup, Row, Col, Badge, Alert } from "react-bootstrap";
import { FaArrowLeft, FaUndo } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const PrestamoDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "ROLE_ADMIN" || user?.rol === "ROLE_ADMIN" || user?.role === "ADMIN" || user?.rol === "ADMIN";

  const [prestamo, setPrestamo] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Formatear fecha (evita problema de timezone)
  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    // Agregar 'T00:00:00' para forzar interpretación como hora local
    const fechaLocal = new Date(fecha + 'T00:00:00');
    return fechaLocal.toLocaleDateString("es-AR");
  };

  // Obtener badge de estado
  const getEstadoBadge = () => {
    if (!prestamo) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    const fechaDevolucionEsperada = new Date(prestamo.fechaDevolucionEsperada + 'T00:00:00');

    // IMPORTANTE: Verificar primero si tiene falta (prioridad más alta)
    if (prestamo.falta) {
      return <Badge bg="danger" className="fs-6">Con Falta</Badge>;
    } else if (prestamo.devuelto) {
      return <Badge bg="success" className="fs-6">Devuelto</Badge>;
    } else if (fechaDevolucionEsperada < hoy) {
      return <Badge bg="warning" text="dark" className="fs-6">Vencido</Badge>;
    } else {
      return <Badge bg="info" className="fs-6">Pendiente</Badge>;
    }
  };

  // Calcular días de retraso o días restantes
  const calcularDias = () => {
    if (!prestamo) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas
    const fechaEsperada = new Date(prestamo.fechaDevolucionEsperada + 'T00:00:00');
    const diffTime = Math.abs(hoy - fechaEsperada);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (prestamo.devuelto) {
      if (prestamo.fechaDevolucionReal) {
        const fechaReal = new Date(prestamo.fechaDevolucionReal + 'T00:00:00');
        const diffTimeReal = fechaReal - fechaEsperada;
        const diffDaysReal = Math.ceil(diffTimeReal / (1000 * 60 * 60 * 24));

        if (diffDaysReal > 0) {
          return <Badge bg="danger">{diffDaysReal} día(s) de retraso</Badge>;
        } else {
          return <Badge bg="success">A tiempo</Badge>;
        }
      }
      return <Badge bg="success">A tiempo</Badge>;
    }

    if (fechaEsperada < hoy) {
      return <Badge bg="danger">{diffDays} día(s) de retraso</Badge>;
    } else {
      return <Badge bg="info">{diffDays} día(s) restantes</Badge>;
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

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📖 Detalle del Préstamo #{prestamo.idPrestamo}</h4>
          {getEstadoBadge()}
        </Card.Header>
        <Card.Body>
          {/* Información del Usuario */}
          <h5 className="mb-3 text-primary">👤 Información del Usuario</h5>
          <ListGroup className="mb-4">
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Nombre Completo:</strong></Col>
                <Col sm={8}>{prestamo.nombreUsuario} {prestamo.apellidoUsuario}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>

          {/* Información del Libro */}
          <h5 className="mb-3 text-primary">📚 Información del Libro</h5>
          <ListGroup className="mb-4">
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Título:</strong></Col>
                <Col sm={8}>{prestamo.tituloLibro}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>

          {/* Fechas del Préstamo */}
          <h5 className="mb-3 text-primary">📅 Fechas del Préstamo</h5>
          <ListGroup className="mb-4">
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Fecha de Préstamo:</strong></Col>
                <Col sm={8}>{formatearFecha(prestamo.fechaPrestamo)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Fecha Devolución Esperada:</strong></Col>
                <Col sm={8}>{formatearFecha(prestamo.fechaDevolucionEsperada)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Fecha Devolución Real:</strong></Col>
                <Col sm={8}>{formatearFecha(prestamo.fechaDevolucionReal)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>Tiempo:</strong></Col>
                <Col sm={8}>{calcularDias()}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>

          {/* Estado del Préstamo */}
          <h5 className="mb-3 text-primary">ℹ️ Estado del Préstamo</h5>
          <ListGroup className="mb-4">
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>¿Devuelto?</strong></Col>
                <Col sm={8}>
                  {prestamo.devuelto ? (
                    <Badge bg="success">Sí</Badge>
                  ) : (
                    <Badge bg="warning" text="dark">No</Badge>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={4}><strong>¿Tiene Falta?</strong></Col>
                <Col sm={8}>
                  {prestamo.falta ? (
                    <Badge bg="danger">Sí</Badge>
                  ) : (
                    <Badge bg="success">No</Badge>
                  )}
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
          </ListGroup>

          {/* Botones de Acción */}
          <div className="d-flex gap-2 justify-content-end flex-wrap">
            <Button
              variant="secondary"
              onClick={() => navigate("/prestamos")}
            >
              <FaArrowLeft className="me-2" />
              Volver al Listado
            </Button>
            {isAdmin && !prestamo.devuelto && (
              <Button
                variant="success"
                onClick={() => navigate(`/prestamos/devolucion/${prestamo.idPrestamo}`)}
              >
                <FaUndo className="me-2" />
                Registrar Devolución
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PrestamoDetail;
