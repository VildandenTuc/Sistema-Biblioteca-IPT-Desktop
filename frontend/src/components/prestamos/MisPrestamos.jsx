// src/components/prestamos/MisPrestamos.jsx

import { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Spinner, Alert, Row, Col } from "react-bootstrap";
import { FaBook, FaCalendar, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";

const MisPrestamos = () => {
  // Estados
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Obtener préstamos del usuario al cargar
  useEffect(() => {
    if (user?.id) {
      fetchPrestamos();
    }
  }, [user]);

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.POR_USUARIO(user.id));
      setPrestamos(response.data || []);
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
      toast.error(
        error.errorMessage || "Error al cargar tus préstamos. Por favor, intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const date = new Date(fecha + "T00:00:00");
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Obtener badge según estado del préstamo
  const getEstadoBadge = (prestamo) => {
    // IMPORTANTE: Verificar primero si tiene falta (prioridad más alta)
    if (prestamo.falta) {
      return <Badge bg="danger">Con Falta</Badge>;
    } else if (prestamo.devuelto) {
      return <Badge bg="success">Devuelto</Badge>;
    } else {
      // No devuelto, verificar si está vencido
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaEsperada = new Date(prestamo.fechaDevolucionEsperada + "T00:00:00");

      if (fechaEsperada < hoy) {
        return <Badge bg="danger">Vencido</Badge>;
      }
      return <Badge bg="primary">Activo</Badge>;
    }
  };

  // Calcular estadísticas
  const estadisticas = {
    total: prestamos.length,
    activos: prestamos.filter((p) => !p.devuelto).length,
    devueltos: prestamos.filter((p) => p.devuelto && !p.falta).length,
    conFalta: prestamos.filter((p) => p.falta).length,
  };

  // Renderizado
  return (
    <Container className="py-4">
      {/* Encabezado */}
      <div className="d-flex align-items-center mb-4">
        <FaBook className="me-2 text-primary" size={32} />
        <div>
          <h2 className="mb-0">Mis Préstamos</h2>
          <p className="text-muted mb-0">Historial completo de tus préstamos</p>
        </div>
      </div>

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={3} xs={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <h4 className="text-primary mb-1">{estadisticas.total}</h4>
              <small className="text-muted">Total</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <h4 className="text-info mb-1">{estadisticas.activos}</h4>
              <small className="text-muted">Activos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <h4 className="text-success mb-1">{estadisticas.devueltos}</h4>
              <small className="text-muted">Devueltos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} xs={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <h4 className="text-warning mb-1">{estadisticas.conFalta}</h4>
              <small className="text-muted">Con Falta</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de préstamos */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <FaCalendar className="me-2" />
              <strong>Historial de Préstamos</strong>
            </div>
            {prestamos.length > 0 && (
              <Badge bg="secondary">{prestamos.length} préstamo(s)</Badge>
            )}
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">Cargando tus préstamos...</p>
            </div>
          ) : prestamos.length === 0 ? (
            <Alert variant="info" className="m-4 text-center">
              <FaBook size={48} className="mb-3 opacity-50" />
              <p className="mb-0">
                <strong>No tienes préstamos registrados</strong>
              </p>
              <small className="text-muted">
                Cuando realices préstamos de libros, aparecerán aquí.
              </small>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">ID</th>
                    <th>Libro</th>
                    <th className="text-center">Fecha Préstamo</th>
                    <th className="text-center">Devolución Esperada</th>
                    <th className="text-center">Devolución Real</th>
                    <th className="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {prestamos.map((prestamo) => (
                    <tr key={prestamo.idPrestamo}>
                      <td className="text-center align-middle">
                        <Badge bg="secondary">{prestamo.idPrestamo}</Badge>
                      </td>
                      <td className="align-middle">
                        <FaBook className="me-2 text-primary" />
                        <strong>{prestamo.tituloLibro}</strong>
                      </td>
                      <td className="text-center align-middle">
                        {formatearFecha(prestamo.fechaPrestamo)}
                      </td>
                      <td className="text-center align-middle">
                        {formatearFecha(prestamo.fechaDevolucionEsperada)}
                      </td>
                      <td className="text-center align-middle">
                        {prestamo.fechaDevolucionReal ? (
                          formatearFecha(prestamo.fechaDevolucionReal)
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center align-middle">{getEstadoBadge(prestamo)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
        {prestamos.length > 0 && (
          <Card.Footer className="bg-light text-center">
            <small className="text-muted">
              {estadisticas.activos > 0 && (
                <>
                  <FaExclamationTriangle className="me-1 text-warning" />
                  Tienes {estadisticas.activos} préstamo(s) activo(s).{" "}
                  {estadisticas.conFalta > 0 && `${estadisticas.conFalta} con falta.`}
                </>
              )}
              {estadisticas.activos === 0 && (
                <>
                  <FaCheckCircle className="me-1 text-success" />
                  No tienes préstamos activos.
                </>
              )}
            </small>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
};

export default MisPrestamos;
