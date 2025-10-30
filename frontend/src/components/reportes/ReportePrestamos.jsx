// src/components/reportes/ReportePrestamos.jsx

import { useState } from "react";
import { Row, Col, Form, Button, Table, Card, Spinner, Badge } from "react-bootstrap";
import { FaSearch, FaCalendar } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import EmptyState from "../common/EmptyState";
import ExportButton from "../common/ExportButton";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const ReportePrestamos = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    devueltos: 0,
    conFalta: 0,
  });

  const handleBuscar = async () => {
    if (!fechaDesde || !fechaHasta) {
      toast.warning("Debe seleccionar ambas fechas");
      return;
    }

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      toast.warning("La fecha desde no puede ser mayor a la fecha hasta");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.PRESTAMOS.BUSCAR_FECHA_PRESTAMO,
        {
          params: {
            desde: fechaDesde,
            hasta: fechaHasta,
            page: 0,
            size: 1000, // Obtener todos los resultados
            sort: "fechaPrestamo,desc",
          },
        }
      );

      const data = response.data.content || [];
      setPrestamos(data);

      // Calcular estadísticas
      const stats = {
        total: data.length,
        activos: data.filter((p) => !p.devuelto).length,
        devueltos: data.filter((p) => p.devuelto && !p.falta).length,
        conFalta: data.filter((p) => p.falta).length,
      };
      setEstadisticas(stats);

      toast.success(`Se encontraron ${data.length} préstamos`);
    } catch (error) {
      console.error("Error al buscar préstamos:", error);
      toast.error(error.errorMessage || "Error al generar el reporte");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setFechaDesde("");
    setFechaHasta("");
    setPrestamos([]);
    setEstadisticas({ total: 0, activos: 0, devueltos: 0, conFalta: 0 });
  };

  const handleExportExcel = () => {
    if (prestamos.length === 0) {
      toast.warning("No hay datos para exportar");
      return false;
    }

    const dataToExport = prestamos.map((p) => ({
      ID: p.idPrestamo,
      Usuario: `${p.nombreUsuario} ${p.apellidoUsuario}`,
      Libro: p.tituloLibro,
      "Fecha Préstamo": new Date(p.fechaPrestamo).toLocaleDateString("es-AR"),
      "Fecha Devolución Esperada": new Date(p.fechaDevolucionEsperada).toLocaleDateString("es-AR"),
      "Fecha Devolución Real": p.fechaDevolucionReal
        ? new Date(p.fechaDevolucionReal).toLocaleDateString("es-AR")
        : "Pendiente",
      Estado: !p.devuelto ? "Activo" : p.falta ? "Con Falta" : "Devuelto",
    }));

    return exportToExcel(
      dataToExport,
      `Prestamos_${fechaDesde}_${fechaHasta}`,
      "Préstamos"
    );
  };

  const handleExportPDF = () => {
    if (prestamos.length === 0) {
      toast.warning("No hay datos para exportar");
      return false;
    }

    const dataToExport = prestamos.map((p) => ({
      id: p.idPrestamo,
      usuario: `${p.nombreUsuario} ${p.apellidoUsuario}`,
      libro: p.tituloLibro,
      fechaPrestamo: new Date(p.fechaPrestamo).toLocaleDateString("es-AR"),
      fechaDevEsperada: new Date(p.fechaDevolucionEsperada).toLocaleDateString("es-AR"),
      fechaDevReal: p.fechaDevolucionReal
        ? new Date(p.fechaDevolucionReal).toLocaleDateString("es-AR")
        : "Pendiente",
      estado: !p.devuelto ? "Activo" : p.falta ? "Con Falta" : "Devuelto",
    }));

    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "Usuario", dataKey: "usuario" },
      { header: "Libro", dataKey: "libro" },
      { header: "F. Préstamo", dataKey: "fechaPrestamo" },
      { header: "F. Dev. Esperada", dataKey: "fechaDevEsperada" },
      { header: "F. Dev. Real", dataKey: "fechaDevReal" },
      { header: "Estado", dataKey: "estado" },
    ];

    return exportToPDF(
      dataToExport,
      columns,
      `Prestamos_${fechaDesde}_${fechaHasta}`,
      `Reporte de Préstamos (${fechaDesde} - ${fechaHasta})`
    );
  };

  return (
    <div>
      {/* Filtros */}
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendar className="me-2" />
                  Fecha Desde
                </Form.Label>
                <Form.Control
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendar className="me-2" />
                  Fecha Hasta
                </Form.Label>
                <Form.Control
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <div className="d-flex gap-2 mb-3 w-100">
                <Button variant="primary" onClick={handleBuscar} className="flex-fill">
                  <FaSearch className="me-2" />
                  Buscar
                </Button>
                <Button variant="secondary" onClick={handleLimpiar}>
                  Limpiar
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Estadísticas */}
      {prestamos.length > 0 && (
        <Row className="mb-3">
          <Col md={3}>
            <Card className="text-center" style={{ backgroundColor: "#e3f2fd" }}>
              <Card.Body>
                <h3 className="mb-0">{estadisticas.total}</h3>
                <small className="text-muted">Total Préstamos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center" style={{ backgroundColor: "#fff3e0" }}>
              <Card.Body>
                <h3 className="mb-0">{estadisticas.activos}</h3>
                <small className="text-muted">Activos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center" style={{ backgroundColor: "#e8f5e9" }}>
              <Card.Body>
                <h3 className="mb-0">{estadisticas.devueltos}</h3>
                <small className="text-muted">Devueltos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center" style={{ backgroundColor: "#ffebee" }}>
              <Card.Body>
                <h3 className="mb-0">{estadisticas.conFalta}</h3>
                <small className="text-muted">Con Falta</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabla de resultados */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Generando reporte...</p>
        </div>
      ) : prestamos.length === 0 ? (
        <EmptyState
          icon="chart-bar"
          title="No hay datos para mostrar"
          message="Selecciona un rango de fechas y haz clic en Buscar"
        />
      ) : (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Detalle de Préstamos ({prestamos.length})</span>
            <ExportButton
              onExportExcel={handleExportExcel}
              onExportPDF={handleExportPDF}
              variant="success"
              size="sm"
            />
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Libro</th>
                  <th>Fecha Préstamo</th>
                  <th>Fecha Devolución Esperada</th>
                  <th>Fecha Devolución Real</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.idPrestamo}>
                    <td>{prestamo.idPrestamo}</td>
                    <td>
                      {prestamo.nombreUsuario} {prestamo.apellidoUsuario}
                    </td>
                    <td>{prestamo.tituloLibro}</td>
                    <td>
                      {new Date(prestamo.fechaPrestamo).toLocaleDateString("es-AR")}
                    </td>
                    <td>
                      {new Date(prestamo.fechaDevolucionEsperada).toLocaleDateString(
                        "es-AR"
                      )}
                    </td>
                    <td>
                      {prestamo.fechaDevolucionReal
                        ? new Date(prestamo.fechaDevolucionReal).toLocaleDateString(
                            "es-AR"
                          )
                        : "-"}
                    </td>
                    <td>
                      {!prestamo.devuelto ? (
                        <Badge bg="warning">Activo</Badge>
                      ) : prestamo.falta ? (
                        <Badge bg="danger">Con Falta</Badge>
                      ) : (
                        <Badge bg="success">Devuelto</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ReportePrestamos;
