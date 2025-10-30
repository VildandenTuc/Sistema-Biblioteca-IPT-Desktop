// src/components/usuarios/UsuariosList.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Form, Row, Col, Pagination, Badge, InputGroup, Spinner } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaUserPlus, FaSearch, FaUserCheck, FaUserSlash, FaBook } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import ConfirmModal from "../common/ConfirmModal";
import EmptyState from "../common/EmptyState";

const UsuariosList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.rol === "ADMIN";

  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all"); // all, dni, nombre
  const [filterTipo, setFilterTipo] = useState(""); // ALUMNO, DOCENTE
  const [filterActivo, setFilterActivo] = useState("all"); // all, activos, inactivos
  const [prestamosActivos, setPrestamosActivos] = useState({}); // Objeto: { idUsuario: contador }

  // Paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Estados para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger',
    confirmText: 'Confirmar',
  });

  // Cargar usuarios
  useEffect(() => {
    fetchUsuarios();
  }, [currentPage, filterActivo, filterTipo]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      let response;
      let usuariosData = [];

      // Si hay filtro por tipo, obtener TODOS los datos y paginar en cliente
      if (filterTipo) {
        // Obtener todos los datos sin paginación (size muy grande)
        const params = {
          page: 0,
          size: 9999, // Obtener todos los registros
          sort: "apellido,asc",
        };

        if (filterActivo === "activos") {
          response = await axiosInstance.get(ENDPOINTS.USUARIOS.ACTIVOS, { params });
        } else if (filterActivo === "inactivos") {
          response = await axiosInstance.get(ENDPOINTS.USUARIOS.INACTIVOS, { params });
        } else {
          response = await axiosInstance.get(ENDPOINTS.USUARIOS.BASE, { params });
        }

        const allData = response.data.content || [];

        // Filtrar por tipo
        const filteredData = allData.filter(usuario => usuario.tipoUsuario === filterTipo);

        // Paginación client-side
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        usuariosData = filteredData.slice(startIndex, endIndex);

        // Calcular total de páginas
        const totalFiltered = filteredData.length;
        setTotalPages(Math.ceil(totalFiltered / pageSize));
        setTotalElements(totalFiltered);

      } else {
        // Sin filtro por tipo: usar paginación normal del backend
        const params = {
          page: currentPage,
          size: pageSize,
          sort: "apellido,asc",
        };

        if (filterActivo === "activos") {
          response = await axiosInstance.get(ENDPOINTS.USUARIOS.ACTIVOS, { params });
        } else if (filterActivo === "inactivos") {
          response = await axiosInstance.get(ENDPOINTS.USUARIOS.INACTIVOS, { params });
        } else {
          response = await axiosInstance.get(ENDPOINTS.USUARIOS.BASE, { params });
        }

        const data = response.data;
        usuariosData = data.content || [];
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }

      setUsuarios(usuariosData);

      // Cargar contadores de préstamos activos para cada usuario
      if (usuariosData.length > 0) {
        fetchPrestamosActivos(usuariosData);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error(error.errorMessage || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar el conteo de préstamos activos por usuario
  const fetchPrestamosActivos = async (usuariosData) => {
    try {
      const promesas = usuariosData.map(async (usuario) => {
        const id = usuario.idUsuario || usuario.id;
        try {
          const response = await axiosInstance.get(ENDPOINTS.PRESTAMOS.CONTADOR_ACTIVOS_USUARIO(id));
          return { id, contador: response.data };
        } catch (error) {
          console.error(`Error al obtener contador para usuario ${id}:`, error);
          return { id, contador: 0 };
        }
      });

      const resultados = await Promise.all(promesas);

      // Convertir array a objeto { idUsuario: contador }
      const contadores = {};
      resultados.forEach(({ id, contador }) => {
        contadores[id] = contador;
      });

      setPrestamosActivos(contadores);
    } catch (error) {
      console.error("Error al cargar contadores de préstamos:", error);
    }
  };

  // Búsqueda
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchUsuarios();
      return;
    }

    setLoading(true);
    try {
      let response;

      let usuariosData = [];
      if (searchType === "dni") {
        // Buscar por DNI (retorna un solo usuario, no paginado)
        response = await axiosInstance.get(ENDPOINTS.USUARIOS.BUSCAR_DNI, {
          params: { dni: searchTerm },
        });
        usuariosData = [response.data]; // Convertir a array
      } else if (searchType === "nombre") {
        // Buscar por nombre/apellido (retorna lista, no paginado)
        response = await axiosInstance.get(ENDPOINTS.USUARIOS.BUSCAR_NOMBRE_APELLIDO, {
          params: { texto: searchTerm },
        });
        usuariosData = response.data;
      }

      // Aplicar filtro por tipo si está activo
      if (filterTipo && usuariosData.length > 0) {
        usuariosData = usuariosData.filter(usuario => usuario.tipoUsuario === filterTipo);
      }

      // Actualizar estado con los resultados filtrados
      setUsuarios(usuariosData);
      setTotalPages(1);
      setTotalElements(usuariosData.length);

      // Cargar contadores de préstamos activos
      if (usuariosData.length > 0) {
        fetchPrestamosActivos(usuariosData);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      toast.error(error.errorMessage || "Error al buscar usuarios");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar (desactivar) usuario
  const handleDelete = (id, nombreCompleto) => {
    setConfirmModalConfig({
      title: 'Desactivar Usuario',
      message: `¿Está seguro de desactivar al usuario "${nombreCompleto}"? El usuario no podrá acceder al sistema.`,
      variant: 'danger',
      confirmText: 'Desactivar',
      onConfirm: async () => {
        try {
          await axiosInstance.delete(ENDPOINTS.USUARIOS.BY_ID(id));
          toast.success("Usuario desactivado correctamente");
          setShowConfirmModal(false);
          fetchUsuarios();
        } catch (error) {
          console.error("Error al desactivar usuario:", error);
          toast.error(error.errorMessage || "Error al desactivar usuario");
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
  };

  // Activar usuario
  const handleActivate = (id, nombreCompleto) => {
    setConfirmModalConfig({
      title: 'Reactivar Usuario',
      message: `¿Está seguro de reactivar al usuario "${nombreCompleto}"? El usuario podrá acceder nuevamente al sistema.`,
      variant: 'success',
      confirmText: 'Reactivar',
      onConfirm: async () => {
        try {
          await axiosInstance.put(ENDPOINTS.USUARIOS.ACTIVAR(id));
          toast.success("Usuario reactivado correctamente");
          setShowConfirmModal(false);
          fetchUsuarios();
        } catch (error) {
          console.error("Error al reactivar usuario:", error);
          toast.error(error.errorMessage || "Error al reactivar usuario");
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setSearchType("all");
    setFilterTipo("");
    setFilterActivo("all");
    setCurrentPage(0);
    fetchUsuarios();
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaUserPlus className="me-2" />
          Gestión de Usuarios
        </h2>
        {isAdmin && (
          <Button variant="primary" onClick={() => navigate("/usuarios/nuevo")}>
            <FaUserPlus className="me-2" />
            Nuevo Usuario
          </Button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{ maxWidth: "120px" }}
            >
              <option value="all">Todos</option>
              <option value="dni">DNI</option>
              <option value="nombre">Nombre</option>
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              disabled={searchType === "all"}
            />
            <Button variant="primary" onClick={handleSearch} disabled={searchType === "all"}>
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>

        <Col md={3}>
          <Form.Select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="ALUMNO">Alumno</option>
            <option value="DOCENTE">Docente</option>
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select value={filterActivo} onChange={(e) => setFilterActivo(e.target.value)}>
            <option value="all">Activos e inactivos</option>
            <option value="activos">Solo activos</option>
            <option value="inactivos">Solo inactivos</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Button variant="secondary" onClick={handleClearFilters} className="w-100">
            Limpiar
          </Button>
        </Col>
      </Row>

      {/* Tabla de usuarios */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <EmptyState
          icon="user"
          title="No se encontraron usuarios"
          message={
            searchTerm || filterTipo || filterActivo !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay usuarios registrados en el sistema'
          }
          actionText={
            searchTerm || filterTipo || filterActivo !== 'all'
              ? 'Limpiar filtros'
              : ''
          }
          onAction={
            searchTerm || filterTipo || filterActivo !== 'all'
              ? handleClearFilters
              : null
          }
        />
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Apellido y Nombre</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                  <tr key={usuario.idUsuario || usuario.id}>
                    <td>{usuario.idUsuario || usuario.id}</td>
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
                            : usuario.tipoUsuario === "DOCENTE"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {usuario.tipoUsuario}
                      </Badge>
                    </td>
                    <td>{usuario.telefono || "-"}</td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {usuario.activo ? (
                          <Badge bg="success">
                            <FaUserCheck className="me-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge bg="danger">
                            <FaUserSlash className="me-1" />
                            Inactivo
                          </Badge>
                        )}
                        {prestamosActivos[usuario.idUsuario || usuario.id] > 0 && (
                          <Badge bg="info" className="text-dark">
                            {prestamosActivos[usuario.idUsuario || usuario.id]} préstamo(s)
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/usuarios/${usuario.idUsuario || usuario.id}`)}
                          title="Ver usuario y su historial de préstamos"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/prestamos?usuarioId=${usuario.idUsuario || usuario.id}`)}
                          title="Ir a Préstamos"
                        >
                          <FaBook />
                        </Button>
                        {isAdmin && (
                          <>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => navigate(`/usuarios/editar/${usuario.idUsuario || usuario.id}`)}
                            >
                              <FaEdit />
                            </Button>
                            {usuario.activo ? (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(usuario.idUsuario || usuario.id, `${usuario.apellido}, ${usuario.nombre}`)}
                              >
                                <FaTrash />
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleActivate(usuario.idUsuario || usuario.id, `${usuario.apellido}, ${usuario.nombre}`)}
                              >
                                <FaUserCheck />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted">
                Mostrando {usuarios.length} de {totalElements} usuarios
              </span>
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0} />

                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index === currentPage}
                    onClick={() => setCurrentPage(index)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        show={showConfirmModal}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setShowConfirmModal(false)}
        variant={confirmModalConfig.variant}
        confirmText={confirmModalConfig.confirmText}
      />
    </Container>
  );
};

export default UsuariosList;
