// src/components/reportes/ReportePrestamosConFalta.jsx

import { useState, useEffect } from "react";
import { Card, Table, Spinner, Badge } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import EmptyState from "../common/EmptyState";
import ExportButton from "../common/ExportButton";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const ReportePrestamosConFalta = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrestamosConFalta();
  }, []);

  const fetchPrestamosConFalta = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.CON_FALTA, {
        params: { page: 0, size: 1000 },
      });

      const data = response.data.content || [];
      setPrestamos(data);
    } catch (error) {
      console.error("Error al cargar préstamos con falta:", error);
      toast.error(error.errorMessage || "Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const calcularDiasRetraso = (fechaEsperada, fechaReal) => {
    const fechaDev = new Date(fechaReal);
    const fechaEsp = new Date(fechaEsperada);
    const diffTime = Math.abs(fechaDev - fechaEsp);
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
      Libro: p.tituloLibro,
      "Fecha Préstamo": new Date(p.fechaPrestamo).toLocaleDateString("es-AR"),
      "Fecha Devolución Esperada": new Date(p.fechaDevolucionEsperada).toLocaleDateString("es-AR"),
      "Fecha Devolución Real": new Date(p.fechaDevolucionReal).toLocaleDateString("es-AR"),
      "Días de Retraso": calcularDiasRetraso(p.fechaDevolucionEsperada, p.fechaDevolucionReal),
    }));

    return exportToExcel(
      dataToExport,
      "Historial_Devoluciones_Tardias",
      "Devoluciones Tardías"
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
      fechaDevReal: new Date(p.fechaDevolucionReal).toLocaleDateString("es-AR"),
      diasRetraso: calcularDiasRetraso(p.fechaDevolucionEsperada, p.fechaDevolucionReal),
    }));

    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "Usuario", dataKey: "usuario" },
      { header: "Libro", dataKey: "libro" },
      { header: "F. Préstamo", dataKey: "fechaPrestamo" },
      { header: "F. Dev. Esperada", dataKey: "fechaDevEsperada" },
      { header: "F. Dev. Real", dataKey: "fechaDevReal" },
      { header: "Días Retraso", dataKey: "diasRetraso" },
    ];

    return exportToPDF(
      dataToExport,
      columns,
      "Historial_Devoluciones_Tardias",
      "Historial de Devoluciones Tardías"
    );
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando historial de faltas...</p>
        </div>
      ) : prestamos.length === 0 ? (
        <EmptyState
          icon="check"
          title="¡No hay devoluciones tardías!"
          message="Todos los préstamos se han devuelto a tiempo"
        />
      ) : (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center bg-warning text-dark">
            <span>Historial de Devoluciones Tardías ({prestamos.length})</span>
            <ExportButton
              onExportExcel={handleExportExcel}
              onExportPDF={handleExportPDF}
              variant="dark"
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
                  <th>Días de Retraso</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => {
                  const diasRetraso = calcularDiasRetraso(
                    prestamo.fechaDevolucionEsperada,
                    prestamo.fechaDevolucionReal
                  );
                  return (
                    <tr key={prestamo.idPrestamo}>
                      <td>{prestamo.idPrestamo}</td>
                      <td>
                        {prestamo.nombreUsuario} {prestamo.apellidoUsuario}
                      </td>
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
                        {new Date(
                          prestamo.fechaDevolucionReal
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
      )}
    </div>
  );
};

export default ReportePrestamosConFalta;
