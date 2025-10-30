// src/components/reportes/ReporteUsuariosActivos.jsx

import { useState, useEffect } from "react";
import { Card, Table, Spinner, Badge } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import EmptyState from "../common/EmptyState";
import ExportButton from "../common/ExportButton";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const ReporteUsuariosActivos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsuariosConPrestamos();
  }, []);

  const fetchUsuariosConPrestamos = async () => {
    setLoading(true);
    try {
      // Primero obtenemos todos los usuarios activos
      const responseUsuarios = await axiosInstance.get(ENDPOINTS.USUARIOS.ACTIVOS, {
        params: { page: 0, size: 1000 },
      });

      const usuariosData = responseUsuarios.data.content || [];

      // Luego obtenemos el contador de préstamos activos para cada uno
      const promesas = usuariosData.map(async (usuario) => {
        try {
          const response = await axiosInstance.get(
            ENDPOINTS.PRESTAMOS.CONTADOR_ACTIVOS_USUARIO(usuario.idUsuario)
          );
          return {
            ...usuario,
            prestamosActivos: response.data,
          };
        } catch (error) {
          return {
            ...usuario,
            prestamosActivos: 0,
          };
        }
      });

      const usuariosConContador = await Promise.all(promesas);

      // Filtrar solo usuarios con préstamos activos y ordenar
      const usuariosConPrestamos = usuariosConContador
        .filter((u) => u.prestamosActivos > 0)
        .sort((a, b) => b.prestamosActivos - a.prestamosActivos);

      setUsuarios(usuariosConPrestamos);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error(error.errorMessage || "Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (usuarios.length === 0) {
      toast.warning("No hay datos para exportar");
      return false;
    }

    const dataToExport = usuarios.map((usuario) => ({
      ID: usuario.idUsuario,
      "Apellido y Nombre": `${usuario.apellido}, ${usuario.nombre}`,
      DNI: usuario.dni,
      Email: usuario.email,
      Tipo: usuario.tipoUsuario,
      "Préstamos Activos": usuario.prestamosActivos,
    }));

    return exportToExcel(
      dataToExport,
      "Usuarios_Con_Prestamos_Activos",
      "Usuarios"
    );
  };

  const handleExportPDF = () => {
    if (usuarios.length === 0) {
      toast.warning("No hay datos para exportar");
      return false;
    }

    const dataToExport = usuarios.map((usuario) => ({
      id: usuario.idUsuario,
      apellidoNombre: `${usuario.apellido}, ${usuario.nombre}`,
      dni: usuario.dni,
      email: usuario.email,
      tipo: usuario.tipoUsuario,
      prestamos: usuario.prestamosActivos,
    }));

    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "Apellido y Nombre", dataKey: "apellidoNombre" },
      { header: "DNI", dataKey: "dni" },
      { header: "Email", dataKey: "email" },
      { header: "Tipo", dataKey: "tipo" },
      { header: "Préstamos", dataKey: "prestamos" },
    ];

    return exportToPDF(
      dataToExport,
      columns,
      "Usuarios_Con_Prestamos_Activos",
      "Usuarios con Préstamos Activos"
    );
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando datos...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <EmptyState
          icon="users"
          title="No hay usuarios con préstamos activos"
          message="Todos los préstamos han sido devueltos"
        />
      ) : (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Usuarios con Préstamos Activos ({usuarios.length})</span>
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
                  <th>Apellido y Nombre</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Préstamos Activos</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.idUsuario}>
                    <td>{usuario.idUsuario}</td>
                    <td>
                      {usuario.apellido}, {usuario.nombre}
                    </td>
                    <td>{usuario.dni}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <Badge
                        bg={
                          usuario.tipoUsuario === "ALUMNO"
                            ? "primary"
                            : "success"
                        }
                      >
                        {usuario.tipoUsuario}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="warning" pill className="text-dark">
                        {usuario.prestamosActivos} activo(s)
                      </Badge>
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

export default ReporteUsuariosActivos;
