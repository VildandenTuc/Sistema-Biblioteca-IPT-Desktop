// src/components/categorias/CategoriasList.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Table,
  Button,
  Form,
  Badge,
  Spinner,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaTags,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { useAuth } from "../../hooks/useAuth";
import ConfirmModal from "../common/ConfirmModal";
import EmptyState from "../common/EmptyState";

const CategoriasList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.rol === "ADMIN";

  // Estados
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchNombre, setSearchNombre] = useState("");
  const [filterActivo, setFilterActivo] = useState("todas"); // todas | activas | inactivas

  // Estados para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger',
    confirmText: 'Confirmar',
  });

  // Cargar categorías al montar y cuando cambie filtro de estado
  useEffect(() => {
    fetchCategorias();
  }, [filterActivo]);

  // Función para obtener categorías
  const fetchCategorias = async () => {
    setLoading(true);
    try {
      let response;
      let data = [];

      // Siempre obtener TODAS las categorías desde el backend
      response = await axiosInstance.get(ENDPOINTS.CATEGORIAS.BASE);
      data = response.data;

      // Aplicar filtro de estado
      if (filterActivo === "activas") {
        data = data.filter((cat) => cat.activo === true);
      } else if (filterActivo === "inactivas") {
        data = data.filter((cat) => cat.activo === false);
      }
      // Si es "todas", no filtrar por activo

      // Si hay búsqueda por nombre, filtrar localmente (case-insensitive)
      if (searchNombre.trim()) {
        const searchLower = searchNombre.trim().toLowerCase();
        data = data.filter((cat) =>
          cat.nombre.toLowerCase().includes(searchLower)
        );
      }

      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.error(error.errorMessage || "Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCategorias();
  };

  // Restablecer todos los filtros (búsqueda + estado)
  const handleClearAllFilters = async () => {
    setSearchNombre("");
    setFilterActivo("todas");

    // Fetch directo sin filtros para evitar problemas de timing con estados asíncronos
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.CATEGORIAS.BASE);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      toast.error(error.errorMessage || "Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de categoría (activar/desactivar)
  const handleToggleActivo = (id, activoActual, nombreCategoria) => {
    const accion = activoActual ? "desactivar" : "activar";
    const variant = activoActual ? 'warning' : 'success';
    const confirmText = activoActual ? 'Desactivar' : 'Activar';

    setConfirmModalConfig({
      title: activoActual ? 'Desactivar Categoría' : 'Activar Categoría',
      message: `¿Está seguro de ${accion} la categoría "${nombreCategoria}"?`,
      variant: variant,
      confirmText: confirmText,
      onConfirm: async () => {
        try {
          if (activoActual) {
            // Desactivar (eliminación lógica)
            await axiosInstance.delete(ENDPOINTS.CATEGORIAS.ELIMINAR_LOGICA(id));
            toast.success("Categoría desactivada correctamente");
          } else {
            // Activar
            await axiosInstance.put(ENDPOINTS.CATEGORIAS.ACTIVAR(id));
            toast.success("Categoría activada correctamente");
          }
          setShowConfirmModal(false);
          fetchCategorias();
        } catch (error) {
          console.error(`Error al ${accion} categoría:`, error);
          toast.error(error.errorMessage || `Error al ${accion} la categoría`);
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-warning text-dark">
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <FaTags className="me-2" />
                Gestión de Categorías
              </h4>
            </Col>
            <Col xs="auto">
              {isAdmin && (
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => navigate("/categorias/nuevo")}
                >
                  <FaPlus className="me-2" />
                  Nueva Categoría
                </Button>
              )}
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {/* Filtros y búsqueda */}
          <Row className="mb-3">
            <Col md={6}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchNombre}
                    onChange={(e) => setSearchNombre(e.target.value)}
                  />
                  <Button variant="primary" type="submit">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>
            </Col>

            <Col md={3}>
              <Form.Select
                value={filterActivo}
                onChange={(e) => setFilterActivo(e.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="activas">Solo Activas</option>
                <option value="inactivas">Solo Inactivas</option>
              </Form.Select>
            </Col>

            <Col md={3} className="text-end">
              <div className="d-flex flex-column align-items-end gap-2">
                <div className="text-muted">
                  <strong>{categorias.length}</strong> categoría(s)
                </div>
                {(searchNombre || filterActivo !== "todas") && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleClearAllFilters}
                  >
                    Restablecer filtros
                  </Button>
                )}
              </div>
            </Col>
          </Row>

          {/* Tabla de categorías */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando categorías...</p>
            </div>
          ) : categorias.length === 0 ? (
            <EmptyState
              icon="tag"
              title="No se encontraron categorías"
              message={
                searchNombre || filterActivo !== 'todas'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay categorías registradas en el sistema'
              }
              actionText={
                searchNombre || filterActivo !== 'todas'
                  ? 'Limpiar filtros'
                  : ''
              }
              onAction={
                searchNombre || filterActivo !== 'todas'
                  ? handleClearAllFilters
                  : null
              }
            />
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-warning">
                <tr>
                  <th style={{ width: "10%" }}>ID</th>
                  <th style={{ width: "50%" }}>Nombre</th>
                  <th style={{ width: "15%" }}>Estado</th>
                  {isAdmin && <th style={{ width: "25%" }}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.idCategoria}>
                    <td>{categoria.idCategoria}</td>
                    <td>
                      <strong>{categoria.nombre}</strong>
                    </td>
                    <td>
                      {categoria.activo ? (
                        <Badge bg="success">
                          <FaCheckCircle className="me-1" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge bg="danger">
                          <FaTimesCircle className="me-1" />
                          Inactivo
                        </Badge>
                      )}
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/categorias/editar/${categoria.idCategoria}`
                              )
                            }
                          >
                            <FaEdit className="me-1" />
                            Editar
                          </Button>

                          <Button
                            variant={categoria.activo ? "danger" : "success"}
                            size="sm"
                            onClick={() =>
                              handleToggleActivo(
                                categoria.idCategoria,
                                categoria.activo,
                                categoria.nombre
                              )
                            }
                          >
                            {categoria.activo ? (
                              <>
                                <FaTimesCircle className="me-1" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <FaCheckCircle className="me-1" />
                                Activar
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

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

export default CategoriasList;
