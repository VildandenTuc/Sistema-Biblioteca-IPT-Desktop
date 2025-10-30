// src/components/prestamos/PrestamosList.jsx

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Table, Button, Form, Row, Col, Pagination, Badge, Alert } from "react-bootstrap";
import { FaSearch, FaPlus, FaEye, FaUndo } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import EmptyState from "../common/EmptyState";

const PrestamosList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isAdmin = user?.role === "ROLE_ADMIN" || user?.rol === "ROLE_ADMIN" || user?.role === "ADMIN" || user?.rol === "ADMIN";

  // Estados de datos
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Estados de búsqueda y filtros
  const [searchDNI, setSearchDNI] = useState("");
  const [searchUsuario, setSearchUsuario] = useState("");
  const [searchLibro, setSearchLibro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // todos, noDevueltos, vencidos, conFalta
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [filtroUsuarioId, setFiltroUsuarioId] = useState(null); // ID de usuario para filtrar desde URL

  // Fetch de préstamos
  const fetchPrestamos = async () => {
    // Leer parámetro de URL directamente para evitar problemas de timing
    const usuarioIdFromURL = searchParams.get('usuarioId');

    setLoading(true);
    try {
      let response;

      // Prioridad de búsqueda/filtros
      if (usuarioIdFromURL) {
        // Filtro por usuario específico (desde URL) - leer directamente de URL
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.POR_USUARIO(usuarioIdFromURL));
        // Ordenar en el cliente por fecha de préstamo descendente
        const prestamosOrdenados = response.data.sort((a, b) => {
          return new Date(b.fechaPrestamo) - new Date(a.fechaPrestamo);
        });
        setPrestamos(prestamosOrdenados);
        setTotalPages(1);
        setTotalElements(prestamosOrdenados.length);
      } else if (searchDNI.trim()) {
        // Búsqueda por DNI (paginado)
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BUSCAR_DNI, {
          params: { dni: searchDNI.trim(), page: currentPage, size: pageSize, sort: "fechaPrestamo,desc" }
        });
        setPrestamos(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else if (searchUsuario.trim()) {
        // Búsqueda por nombre de usuario (paginado)
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BUSCAR_USUARIO, {
          params: { texto: searchUsuario.trim(), page: currentPage, size: pageSize, sort: "fechaPrestamo,desc" }
        });
        setPrestamos(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else if (searchLibro.trim()) {
        // Búsqueda por título de libro (paginado)
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BUSCAR_LIBRO, {
          params: { titulo: searchLibro.trim(), page: currentPage, size: pageSize, sort: "fechaPrestamo,desc" }
        });
        setPrestamos(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else if (fechaDesde && fechaHasta) {
        // Búsqueda por rango de fechas (paginado)
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BUSCAR_FECHA_PRESTAMO, {
          params: { desde: fechaDesde, hasta: fechaHasta, page: currentPage, size: pageSize, sort: "fechaPrestamo,desc" }
        });
        setPrestamos(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else if (filtroEstado === "noDevueltos") {
        // Filtro por préstamos no devueltos (lista sin paginación)
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.NO_DEVUELTOS);
        // Ordenar en el cliente por fecha de préstamo descendente
        const prestamosOrdenados = response.data.sort((a, b) => {
          return new Date(b.fechaPrestamo) - new Date(a.fechaPrestamo);
        });
        setPrestamos(prestamosOrdenados);
        setTotalPages(1);
        setTotalElements(prestamosOrdenados.length);
      } else if (filtroEstado === "vencidos") {
        // Filtro por préstamos vencidos no devueltos (paginado)
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.VENCIDOS_NO_DEVUELTOS, {
          params: { page: currentPage, size: pageSize, sort: "fechaPrestamo,desc" }
        });
        setPrestamos(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else if (filtroEstado === "conFalta") {
        // Filtro por préstamos con falta (paginado)
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.CON_FALTA, {
          params: { page: currentPage, size: pageSize, sort: "fechaPrestamo,desc" }
        });
        setPrestamos(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        // Listado completo de préstamos (paginado)
        response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.TODOS, {
          params: { page: currentPage, size: pageSize, sort: "fechaPrestamo,desc" }
        });
        setPrestamos(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      }
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      toast.error(error.errorMessage || "Error al cargar préstamos");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestamos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filtroEstado, searchParams]);

  // Handlers de búsqueda
  const handleSearchDNI = async () => {
    setSearchUsuario("");
    setSearchLibro("");
    setFechaDesde("");
    setFechaHasta("");
    setFiltroEstado("todos");
    setFiltroUsuarioId(null);
    setCurrentPage(0);
    navigate('/prestamos', { replace: true });

    // Fetch manual con searchDNI
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BUSCAR_DNI, {
        params: { dni: searchDNI.trim(), page: 0, size: pageSize, sort: "fechaPrestamo,desc" }
      });
      setPrestamos(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      toast.error(error.errorMessage || "Error al cargar préstamos");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsuario = async () => {
    setSearchDNI("");
    setSearchLibro("");
    setFechaDesde("");
    setFechaHasta("");
    setFiltroEstado("todos");
    setFiltroUsuarioId(null);
    setCurrentPage(0);
    navigate('/prestamos', { replace: true });

    // Fetch manual con searchUsuario
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BUSCAR_USUARIO, {
        params: { texto: searchUsuario.trim(), page: 0, size: pageSize, sort: "fechaPrestamo,desc" }
      });
      setPrestamos(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      toast.error(error.errorMessage || "Error al cargar préstamos");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchLibro = async () => {
    setSearchDNI("");
    setSearchUsuario("");
    setFechaDesde("");
    setFechaHasta("");
    setFiltroEstado("todos");
    setFiltroUsuarioId(null);
    setCurrentPage(0);
    navigate('/prestamos', { replace: true });

    // Fetch manual con searchLibro
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BUSCAR_LIBRO, {
        params: { titulo: searchLibro.trim(), page: 0, size: pageSize, sort: "fechaPrestamo,desc" }
      });
      setPrestamos(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      toast.error(error.errorMessage || "Error al cargar préstamos");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFecha = async () => {
    if (!fechaDesde || !fechaHasta) {
      toast.warning("Debe seleccionar ambas fechas");
      return;
    }
    setSearchDNI("");
    setSearchUsuario("");
    setSearchLibro("");
    setFiltroUsuarioId(null);
    setFiltroEstado("todos");
    setCurrentPage(0);
    navigate('/prestamos', { replace: true });

    // Fetch manual con fechas
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.BUSCAR_FECHA_PRESTAMO, {
        params: { desde: fechaDesde, hasta: fechaHasta, page: 0, size: pageSize, sort: "fechaPrestamo,desc" }
      });
      setPrestamos(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      toast.error(error.errorMessage || "Error al cargar préstamos");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    // Limpiar todos los estados
    setSearchDNI("");
    setSearchUsuario("");
    setSearchLibro("");
    setFechaDesde("");
    setFechaHasta("");
    setFiltroEstado("todos");
    setFiltroUsuarioId(null);
    setCurrentPage(0);

    // Limpiar parámetros de URL
    navigate('/prestamos', { replace: true });

    // Cargar directamente todos los préstamos (sin esperar actualización de estados)
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.TODOS, {
        params: { page: 0, size: pageSize, sort: "fechaPrestamo,desc" }
      });
      setPrestamos(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      toast.error(error.errorMessage || "Error al cargar préstamos");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener badge de estado
  const getEstadoBadge = (prestamo) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    const fechaDevolucionEsperada = new Date(prestamo.fechaDevolucionEsperada + 'T00:00:00');

    // IMPORTANTE: Verificar primero si tiene falta (prioridad más alta)
    if (prestamo.falta) {
      return <Badge bg="danger">Con Falta</Badge>;
    } else if (prestamo.devuelto) {
      return <Badge bg="success">Devuelto</Badge>;
    } else if (fechaDevolucionEsperada < hoy) {
      return <Badge bg="warning" text="dark">Vencido</Badge>;
    } else {
      return <Badge bg="info">Pendiente</Badge>;
    }
  };

  // Formatear fecha para mostrar (evita problema de timezone)
  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    // Agregar 'T00:00:00' para forzar interpretación como hora local
    const fechaLocal = new Date(fecha + 'T00:00:00');
    return fechaLocal.toLocaleDateString("es-AR");
  };

  // Navegación de páginas
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  // Renderizar paginación
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    if (startPage > 0) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(0)} />
      );
    }

    if (currentPage > 0) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page + 1}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages - 1) {
      items.push(
        <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />
      );
    }

    if (endPage < totalPages - 1) {
      items.push(
        <Pagination.Last key="last" onClick={() => handlePageChange(totalPages - 1)} />
      );
    }

    return <Pagination className="justify-content-center mt-3">{items}</Pagination>;
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📚 Préstamos</h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => navigate("/prestamos/nuevo")}>
            <FaPlus className="me-2" />
            Registrar Préstamo
          </Button>
        )}
      </div>

      {/* Búsquedas */}
      <Row className="mb-3 g-3">
        {/* Búsqueda por DNI */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Buscar por DNI</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="DNI del usuario"
                value={searchDNI}
                onChange={(e) => setSearchDNI(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchDNI()}
              />
              <Button variant="primary" onClick={handleSearchDNI} disabled={!searchDNI.trim()}>
                <FaSearch />
              </Button>
            </div>
          </Form.Group>
        </Col>

        {/* Búsqueda por nombre de usuario */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Buscar por Usuario</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Nombre/Apellido usuario"
                value={searchUsuario}
                onChange={(e) => setSearchUsuario(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchUsuario()}
              />
              <Button variant="primary" onClick={handleSearchUsuario} disabled={!searchUsuario.trim()}>
                <FaSearch />
              </Button>
            </div>
          </Form.Group>
        </Col>

        {/* Búsqueda por título de libro */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Buscar por Libro</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Título del libro"
                value={searchLibro}
                onChange={(e) => setSearchLibro(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchLibro()}
              />
              <Button variant="primary" onClick={handleSearchLibro} disabled={!searchLibro.trim()}>
                <FaSearch />
              </Button>
            </div>
          </Form.Group>
        </Col>

        {/* Filtro por estado */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Filtrar por Estado</Form.Label>
            <Form.Select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setCurrentPage(0);
                setSearchDNI("");
                setSearchUsuario("");
                setSearchLibro("");
                setFechaDesde("");
                setFechaHasta("");
              }}
            >
              <option value="todos">Todos</option>
              <option value="noDevueltos">No Devueltos</option>
              <option value="vencidos">Vencidos</option>
              <option value="conFalta">Con Falta</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Búsqueda por rango de fechas */}
      <Row className="mb-3 g-3">
        <Col xs={12} md={4}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Fecha Préstamo Desde</Form.Label>
            <Form.Control
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group>
            <Form.Label className="small fw-semibold">Fecha Préstamo Hasta</Form.Label>
            <Form.Control
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4} className="d-flex align-items-end gap-2">
          <Button variant="primary" onClick={handleSearchFecha} disabled={!fechaDesde || !fechaHasta}>
            <FaSearch className="me-2" />
            Buscar por Fecha
          </Button>
          <Button variant="secondary" onClick={handleResetFilters}>
            <FaUndo className="me-2" />
            Limpiar
          </Button>
        </Col>
      </Row>

      {/* Información de resultados */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0 text-muted">
          Mostrando {prestamos.length} de {totalElements} préstamos
        </p>
        <Form.Group className="d-flex align-items-center gap-2 mb-0">
          <Form.Label className="mb-0 small">Mostrar:</Form.Label>
          <Form.Select
            size="sm"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ width: "80px" }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Form.Select>
        </Form.Group>
      </div>

      {/* Tabla de préstamos */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : prestamos.length === 0 ? (
        <EmptyState
          icon="clipboard"
          title="No se encontraron préstamos"
          message={
            searchDNI || searchUsuario || searchLibro || fechaDesde || fechaHasta || filtroEstado !== 'todos'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay préstamos registrados en el sistema'
          }
          actionText={
            searchDNI || searchUsuario || searchLibro || fechaDesde || fechaHasta || filtroEstado !== 'todos'
              ? 'Limpiar filtros'
              : ''
          }
          onAction={
            searchDNI || searchUsuario || searchLibro || fechaDesde || fechaHasta || filtroEstado !== 'todos'
              ? handleResetFilters
              : null
          }
        />
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-dark">
                <tr>
                  <th className="text-center">#</th>
                  <th>Usuario</th>
                  <th>Libro</th>
                  <th className="text-center">Fecha Préstamo</th>
                  <th className="text-center">Fecha Dev. Esperada</th>
                  <th className="text-center">Fecha Dev. Real</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.idPrestamo}>
                    <td className="text-center">{prestamo.idPrestamo}</td>
                    <td>
                      {prestamo.nombreUsuario} {prestamo.apellidoUsuario}
                    </td>
                    <td>{prestamo.tituloLibro}</td>
                    <td className="text-center">{formatearFecha(prestamo.fechaPrestamo)}</td>
                    <td className="text-center">{formatearFecha(prestamo.fechaDevolucionEsperada)}</td>
                    <td className="text-center">{formatearFecha(prestamo.fechaDevolucionReal)}</td>
                    <td className="text-center">{getEstadoBadge(prestamo)}</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => navigate(`/prestamos/${prestamo.idPrestamo}`)}
                          title="Ver detalle"
                        >
                          <FaEye />
                        </Button>
                        {isAdmin && !prestamo.devuelto && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => navigate(`/prestamos/devolucion/${prestamo.idPrestamo}`)}
                            title="Registrar devolución"
                          >
                            <FaUndo />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Paginación */}
          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default PrestamosList;
