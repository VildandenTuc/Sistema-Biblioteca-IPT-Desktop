// src/components/reportes/ReporteLibrosMasPrestados.jsx

import { useState, useEffect } from "react";
import { Card, Table, Spinner, Badge, ProgressBar } from "react-bootstrap";
import { FaTrophy } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import EmptyState from "../common/EmptyState";
import ExportButton from "../common/ExportButton";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const ReporteLibrosMasPrestados = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibrosMasPrestados();
  }, []);

  const fetchLibrosMasPrestados = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.PRESTAMOS.ESTADISTICAS_LIBROS
      );

      const data = response.data || [];
      setLibros(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      toast.error(error.errorMessage || "Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const maxPrestamos = libros.length > 0 ? libros[0].total : 1;

  const getMedalColor = (index) => {
    if (index === 0) return "gold";
    if (index === 1) return "silver";
    if (index === 2) return "#CD7F32"; // bronze
    return "transparent";
  };

  const handleExportExcel = () => {
    if (libros.length === 0) {
      toast.warning("No hay datos para exportar");
      return false;
    }

    const dataToExport = libros.map((libro, index) => ({
      Posición: index + 1,
      "ID Libro": libro.idLibro,
      Título: libro.titulo,
      "Cantidad de Préstamos": libro.total,
      "Popularidad (%)": Math.round(
        (libro.total / maxPrestamos) * 100
      ),
    }));

    return exportToExcel(dataToExport, "Libros_Mas_Prestados", "Ranking");
  };

  const handleExportPDF = () => {
    if (libros.length === 0) {
      toast.warning("No hay datos para exportar");
      return false;
    }

    const dataToExport = libros.map((libro, index) => ({
      posicion: index + 1,
      idLibro: libro.idLibro,
      titulo: libro.titulo,
      prestamos: libro.total,
      popularidad: `${Math.round(
        (libro.total / maxPrestamos) * 100
      )}%`,
    }));

    const columns = [
      { header: "Pos.", dataKey: "posicion" },
      { header: "ID", dataKey: "idLibro" },
      { header: "Título", dataKey: "titulo" },
      { header: "Préstamos", dataKey: "prestamos" },
      { header: "Popularidad", dataKey: "popularidad" },
    ];

    return exportToPDF(
      dataToExport,
      columns,
      "Libros_Mas_Prestados",
      "Ranking de Libros Más Prestados"
    );
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando estadísticas...</p>
        </div>
      ) : libros.length === 0 ? (
        <EmptyState
          icon="book"
          title="No hay datos disponibles"
          message="No se encontraron libros con préstamos registrados"
        />
      ) : (
        <>
          {/* Podio Top 3 */}
          {libros.length >= 3 && (
            <Card className="mb-3" style={{ backgroundColor: "#f8f9fa" }}>
              <Card.Body>
                <h5 className="text-center mb-4">
                  <FaTrophy className="me-2 text-warning" />
                  Top 3 Libros Más Prestados
                </h5>
                <div className="d-flex justify-content-center align-items-end gap-3">
                  {/* Segundo Lugar */}
                  <div className="text-center" style={{ flex: 1, maxWidth: "200px" }}>
                    <div
                      className="p-3 rounded"
                      style={{
                        backgroundColor: "silver",
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div>
                        <h1 className="mb-0">2</h1>
                        <h4 className="mb-0">{libros[1].total}</h4>
                      </div>
                    </div>
                    <p className="mt-2 mb-0 small fw-bold">{libros[1].titulo}</p>
                  </div>

                  {/* Primer Lugar */}
                  <div className="text-center" style={{ flex: 1, maxWidth: "200px" }}>
                    <div
                      className="p-3 rounded"
                      style={{
                        backgroundColor: "gold",
                        height: "160px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div>
                        <FaTrophy size={30} className="mb-2" />
                        <h1 className="mb-0">1</h1>
                        <h4 className="mb-0">{libros[0].total}</h4>
                      </div>
                    </div>
                    <p className="mt-2 mb-0 small fw-bold">{libros[0].titulo}</p>
                  </div>

                  {/* Tercer Lugar */}
                  <div className="text-center" style={{ flex: 1, maxWidth: "200px" }}>
                    <div
                      className="p-3 rounded"
                      style={{
                        backgroundColor: "#CD7F32",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div>
                        <h1 className="mb-0">3</h1>
                        <h4 className="mb-0">{libros[2].total}</h4>
                      </div>
                    </div>
                    <p className="mt-2 mb-0 small fw-bold">{libros[2].titulo}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Tabla Completa */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Ranking Completo ({libros.length} libros)</span>
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
                    <th style={{ width: "10%" }}>Posición</th>
                    <th style={{ width: "10%" }}>ID Libro</th>
                    <th style={{ width: "40%" }}>Título</th>
                    <th style={{ width: "20%" }}>Préstamos</th>
                    <th style={{ width: "20%" }}>Popularidad</th>
                  </tr>
                </thead>
                <tbody>
                  {libros.map((libro, index) => (
                    <tr key={libro.idLibro}>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {index < 3 && (
                            <div
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: getMedalColor(index),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {index + 1}
                            </div>
                          )}
                          {index >= 3 && (
                            <Badge bg="secondary">{index + 1}</Badge>
                          )}
                        </div>
                      </td>
                      <td>{libro.idLibro}</td>
                      <td>
                        <strong>{libro.titulo}</strong>
                      </td>
                      <td>
                        <Badge bg="primary" pill>
                          {libro.total} préstamo(s)
                        </Badge>
                      </td>
                      <td>
                        <ProgressBar
                          now={(libro.total / maxPrestamos) * 100}
                          label={`${Math.round(
                            (libro.total / maxPrestamos) * 100
                          )}%`}
                          variant={index < 3 ? "success" : "info"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReporteLibrosMasPrestados;
