// src/components/reportes/ReportePrestamosVencidos.jsx

import { useState, useEffect } from "react";
import { Card, Table, Spinner, Badge, Alert } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import EmptyState from "../common/EmptyState";
import ExportButton from "../common/ExportButton";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const ReportePrestamosVencidos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrestamosVencidos();
  }, []);

  const fetchPrestamosVencidos = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.PRESTAMOS.VENCIDOS_NO_DEVUELTOS,
        {
          params: { page: 0, size: 1000 },
        }
      );

      const data = response.data.content || [];
      setPrestamos(data);
    } catch (error) {
      console.error("Error al cargar préstamos vencidos:", error);
      toast.error(error.errorMessage || "Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const calcularDiasRetraso = (fechaEsperada) => {
    const hoy = new Date();
    const fechaDevolucion = new Date(fechaEsperada);
    const diffTime = Math.abs(hoy - fechaDevolucion);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExportExcel = () => {
    if (prestamos.length === 0) {
      toast.warning("No hay datos para exportar");
      return false;
    }

    const dataToExport = prestamos.map((p) => ({
      ID: p.idPrestamo,
      Usuario: `${p.nombreUsuario} ${p.apellidoUsuario}`,
      DNI: p.dniUsuario || "-",
      Libro: p.tituloLibro,
      "Fecha Préstamo": new Date(p.fechaPrestamo).toLocaleDateString("es-AR"),
      "Fecha Devolución Esperada": new Date(p.fechaDevolucionEsperada).toLocaleDateString("es-AR"),
      "Días de Retraso": calcularDiasRetraso(p.fechaDevolucionEsperada),
    }));

    return exportToExcel(
      dataToExport,
      "Prestamos_Vencidos",
      "Préstamos Vencidos"
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
      dni: p.dniUsuario || "-",
      libro: p.tituloLibro,
      fechaPrestamo: new Date(p.fechaPrestamo).toLocaleDateString("es-AR"),
      fechaDevEsperada: new Date(p.fechaDevolucionEsperada).toLocaleDateString("es-AR"),
      diasRetraso: calcularDiasRetraso(p.fechaDevolucionEsperada),
    }));

    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "Usuario", dataKey: "usuario" },
      { header: "DNI", dataKey: "dni" },
      { header: "Libro", dataKey: "libro" },
      { header: "F. Préstamo", dataKey: "fechaPrestamo" },
      { header: "F. Dev. Esperada", dataKey: "fechaDevEsperada" },
      { header: "Días Retraso", dataKey: "diasRetraso" },
    ];

    return exportToPDF(
      dataToExport,
      columns,
      "Prestamos_Vencidos",
      "Préstamos Vencidos (No Devueltos)"
    );
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando préstamos vencidos...</p>
        </div>
      ) : prestamos.length === 0 ? (
        <EmptyState
          icon="check-circle"
          title="¡No hay préstamos vencidos!"
          message="Todos los préstamos activos están al día"
        />
      ) : (
        <>
          <Alert variant="danger" className="mb-3">
            <FaExclamationTriangle className="me-2" />
            <strong>Atención:</strong> Se encontraron {prestamos.length} préstamos
            vencidos que requieren seguimiento.
          </Alert>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center bg-danger text-white">
              <span>Préstamos Vencidos ({prestamos.length})</span>
              <ExportButton
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
                variant="light"
                size="sm"
              />
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>DNI</th>
                    <th>Libro</th>
                    <th>Fecha Préstamo</th>
                    <th>Fecha Devolución Esperada</th>
                    <th>Días de Retraso</th>
                  </tr>
                </thead>
                <tbody>
                  {prestamos.map((prestamo) => {
                    const diasRetraso = calcularDiasRetraso(
                      prestamo.fechaDevolucionEsperada
                    );
                    return (
                      <tr key={prestamo.idPrestamo}>
                        <td>{prestamo.idPrestamo}</td>
                        <td>
                          {prestamo.nombreUsuario} {prestamo.apellidoUsuario}
                        </td>
                        <td>{prestamo.dniUsuario || "-"}</td>
                        <td>{prestamo.tituloLibro}</td>
                        <td>
                          {new Date(prestamo.fechaPrestamo).toLocaleDateString(
                            "es-AR"
                          )}
                        </td>
                        <td>
                          {new Date(
                            prestamo.fechaDevolucionEsperada
                          ).toLocaleDateString("es-AR")}
                        </td>
                        <td>
                          <Badge
                            bg={diasRetraso > 7 ? "danger" : "warning"}
                            className={diasRetraso > 7 ? "" : "text-dark"}
                          >
                            {diasRetraso} día(s)
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportePrestamosVencidos;
