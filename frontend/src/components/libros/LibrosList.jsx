// src/components/libros/LibrosList.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Spinner, Badge, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaBook, FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilter, FaSort, FaSortUp, FaSortDown, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../hooks/useAuth';
import useAutoRefresh from '../../hooks/useAutoRefresh';
import ConfirmModal from '../common/ConfirmModal';
import EmptyState from '../common/EmptyState';

const LibrosList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  // Estados para datos
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Estados para filtros
  const [searchTitulo, setSearchTitulo] = useState('');
  const [searchAutor, setSearchAutor] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterDisponible, setFilterDisponible] = useState('todos'); // todos | disponibles | no_disponibles

  // Estados para ordenamiento
  const [sortField, setSortField] = useState('titulo'); // titulo | autores
  const [sortDirection, setSortDirection] = useState('asc'); // asc | desc

  // Estados para UI
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Estados para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger',
    confirmText: 'Confirmar',
  });

  /**
   * Obtener lista de categorías activas para el filtro
   */
  const fetchCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const response = await api.get(ENDPOINTS.CATEGORIAS.ACTIVAS);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error(error.errorMessage || 'Error al cargar las categorías');
    } finally {
      setLoadingCategorias(false);
    }
  };

  /**
   * Obtener lista de libros con filtros y paginación
   * TODOS LOS ENDPOINTS AHORA USAN PAGINACIÓN
   */
  const fetchLibros = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = ENDPOINTS.LIBROS.DISPONIBLES;

      // Mapeo de campos de ordenamiento frontend -> backend
      // Solo campos directos de la entidad Libro (no relaciones)
      const sortFieldMap = {
        'titulo': 'titulo',
        'autores': 'autores'
      };

      const sortParam = sortFieldMap[sortField] || 'titulo';
      const sortValue = sortDirection === 'desc' ? `${sortParam},desc` : sortParam;

      let params = {
        page: currentPage,
        size: pageSize,
        sort: sortValue
      };

      // Determinar endpoint según filtro de disponibilidad
      if (filterDisponible === 'todos') {
        endpoint = ENDPOINTS.LIBROS.TODOS;
      } else if (filterDisponible === 'no_disponibles') {
        endpoint = ENDPOINTS.LIBROS.NO_DISPONIBLES;
      }
      // Si es 'disponibles', usar el endpoint por defecto (DISPONIBLES)

      // Si hay filtro de título, usar endpoint específico (prioridad alta)
      if (searchTitulo.trim()) {
        endpoint = ENDPOINTS.LIBROS.POR_TITULO;
        params.titulo = searchTitulo.trim();
      }

      // Si hay filtro de autor, usar endpoint específico (sobrescribe el anterior si no hay título)
      if (searchAutor.trim() && !searchTitulo.trim()) {
        endpoint = ENDPOINTS.LIBROS.POR_AUTOR;
        params.autor = searchAutor.trim();
      }

      // Si hay filtro de categoría, usar endpoint específico (sobrescribe el anterior)
      if (filterCategoria) {
        endpoint = ENDPOINTS.LIBROS.POR_CATEGORIA(filterCategoria);
      }

      const response = await api.get(endpoint, { params });

      // La respuesta siempre es un objeto Page de Spring
      let librosData = response.data.content || [];

      // Si se usa categoría o autor con filtro de disponibilidad, aplicar filtro localmente
      // porque esos endpoints devuelven todos los libros (disponibles y no disponibles)
      if ((filterCategoria || searchAutor.trim()) && filterDisponible !== 'disponibles') {
        if (filterDisponible === 'disponibles') {
          librosData = librosData.filter(libro => libro.disponible === true);
        } else if (filterDisponible === 'no_disponibles') {
          librosData = librosData.filter(libro => libro.disponible === false);
        }
        // Si es "todos", no filtrar

        // Recalcular totales después de filtrar
        setTotalPages(1);
        setTotalElements(librosData.length);
      } else {
        // Usar totales del backend
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      }

      setLibros(librosData);
      setLastUpdate(new Date());

    } catch (error) {
      console.error('Error al cargar libros:', error);
      toast.error(error.errorMessage || 'Error al cargar los libros');
      setLibros([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTitulo, searchAutor, filterCategoria, filterDisponible, pageSize, sortField, sortDirection]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Cargar libros cuando cambian los filtros o la página
  useEffect(() => {
    fetchLibros();
  }, [fetchLibros]);

  // Auto-refresh cada 30 segundos si está habilitado
  useAutoRefresh(fetchLibros, 30000, autoRefreshEnabled);

  /**
   * Manejar búsqueda por título
   */
  const handleSearchTitulo = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Resetear a primera página
    fetchLibros();
  };

  /**
   * Manejar búsqueda por autor
   */
  const handleSearchAutor = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Resetear a primera página
    fetchLibros();
  };

  /**
   * Manejar cambio de filtro de categoría
   */
  const handleFilterCategoria = (e) => {
    setFilterCategoria(e.target.value);
    setCurrentPage(0); // Resetear a primera página
  };

  /**
   * Manejar ordenamiento por columna
   */
  const handleSort = (field) => {
    if (sortField === field) {
      // Si ya está ordenando por este campo, cambiar dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es un nuevo campo, ordenar ascendente por defecto
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0); // Resetear a primera página
  };

  /**
   * Obtener icono de ordenamiento para una columna
   */
  const getSortIcon = (field) => {
    const isActive = sortField === field;

    if (!isActive) {
      return (
        <span className="ms-2" style={{ opacity: 0.3 }}>
          <FaSortUp style={{ fontSize: '0.7em', marginBottom: '2px' }} />
          <FaSortDown style={{ fontSize: '0.7em', marginTop: '-4px' }} />
        </span>
      );
    }

    return (
      <span className="ms-2 text-primary">
        {sortDirection === 'asc' ? (
          <>
            <FaSortUp style={{ fontSize: '0.8em', fontWeight: 'bold' }} />
            <FaSortDown style={{ fontSize: '0.7em', opacity: 0.2, marginTop: '-4px' }} />
          </>
        ) : (
          <>
            <FaSortUp style={{ fontSize: '0.7em', opacity: 0.2, marginBottom: '2px' }} />
            <FaSortDown style={{ fontSize: '0.8em', fontWeight: 'bold' }} />
          </>
        )}
      </span>
    );
  };

  /**
   * Limpiar todos los filtros
   */
  const handleClearFilters = () => {
    setSearchTitulo('');
    setSearchAutor('');
    setFilterCategoria('');
    setFilterDisponible('todos');
    setCurrentPage(0);
  };

  /**
   * Eliminar libro (eliminación lógica)
   */
  const handleDelete = (id, titulo) => {
    setConfirmModalConfig({
      title: 'Eliminar Libro',
      message: `¿Está seguro de eliminar el libro "${titulo}"? Esta acción marcará el libro como no disponible.`,
      variant: 'danger',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await api.delete(ENDPOINTS.LIBROS.ELIMINAR_LOGICA(id));
          toast.success('Libro eliminado exitosamente');
          setShowConfirmModal(false);
          fetchLibros(); // Recargar lista
        } catch (error) {
          console.error('Error al eliminar libro:', error);
          toast.error(error.errorMessage || 'Error al eliminar el libro');
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
  };

  /**
   * Activar/Desactivar libro (toggle disponible)
   */
  const handleToggleDisponible = (id, disponibleActual, titulo) => {
    const accion = disponibleActual ? 'marcar como no disponible' : 'marcar como disponible';
    const variant = disponibleActual ? 'warning' : 'success';
    const confirmText = disponibleActual ? 'Desactivar' : 'Activar';

    setConfirmModalConfig({
      title: disponibleActual ? 'Desactivar Libro' : 'Activar Libro',
      message: `¿Está seguro de ${accion} el libro "${titulo}"?`,
      variant: variant,
      confirmText: confirmText,
      onConfirm: async () => {
        try {
          if (disponibleActual) {
            // Desactivar (marcar como no disponible)
            await api.delete(ENDPOINTS.LIBROS.ELIMINAR_LOGICA(id));
            toast.success('Libro marcado como no disponible');
          } else {
            // Activar (marcar como disponible)
            await api.put(ENDPOINTS.LIBROS.ACTIVAR(id));
            toast.success('Libro marcado como disponible');
          }
          setShowConfirmModal(false);
          fetchLibros(); // Recargar lista
        } catch (error) {
          console.error(`Error al ${accion}:`, error);
          toast.error(error.errorMessage || `Error al ${accion} el libro`);
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
  };

  /**
   * Cambiar página
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Generar items de paginación
   */
  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    // Ajustar startPage si estamos cerca del final
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    // Primera página
    if (startPage > 0) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(0)} />
      );
    }

    // Página anterior
    if (currentPage > 0) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />
      );
    }

    // Páginas numeradas
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

    // Página siguiente
    if (currentPage < totalPages - 1) {
      items.push(
        <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />
      );
    }

    // Última página
    if (endPage < totalPages - 1) {
      items.push(
        <Pagination.Last key="last" onClick={() => handlePageChange(totalPages - 1)} />
      );
    }

    return items;
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <FaBook className="me-2" />
                Gestión de Libros
              </h2>
              <div className="d-flex align-items-center gap-3">
                <p className="text-muted mb-0">
                  Total de libros: <strong>{totalElements}</strong>
                </p>
                {lastUpdate && (
                  <small className="text-muted">
                    Última actualización: {lastUpdate.toLocaleTimeString()}
                  </small>
                )}
              </div>
            </div>
            <div className="d-flex gap-2">
              {/* Botón Auto-Refresh */}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip>
                    {autoRefreshEnabled
                      ? 'Auto-actualización activada (30s)'
                      : 'Activar auto-actualización'}
                  </Tooltip>
                }
              >
                <Button
                  variant={autoRefreshEnabled ? 'success' : 'outline-secondary'}
                  onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                  size="sm"
                  className="d-flex align-items-center"
                >
                  <FaSync className={autoRefreshEnabled ? 'me-2' : ''} />
                  {autoRefreshEnabled && 'Activado'}
                </Button>
              </OverlayTrigger>

              {/* Botón Nuevo Libro (solo ADMIN) */}
              {isAdmin && (
                <Button
                  variant="primary"
                  onClick={() => navigate('/libros/nuevo')}
                >
                  <FaPlus className="me-2" />
                  Nuevo Libro
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Filtros */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          {/* Fila 1: Búsquedas por título y autor */}
          <Row className="g-3 mb-3">
            {/* Búsqueda por título */}
            <Col md={6}>
              <Form onSubmit={handleSearchTitulo}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por título..."
                    value={searchTitulo}
                    onChange={(e) => setSearchTitulo(e.target.value)}
                  />
                  <Button type="submit" variant="outline-primary">
                    Buscar
                  </Button>
                </InputGroup>
              </Form>
            </Col>

            {/* Búsqueda por autor */}
            <Col md={6}>
              <Form onSubmit={handleSearchAutor}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por autor..."
                    value={searchAutor}
                    onChange={(e) => setSearchAutor(e.target.value)}
                  />
                  <Button type="submit" variant="outline-primary">
                    Buscar
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>

          {/* Fila 2: Filtros por categoría, disponibilidad y botón limpiar */}
          <Row className="g-3">
            {/* Filtro por categoría */}
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={filterCategoria}
                  onChange={handleFilterCategoria}
                  disabled={loadingCategorias}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>

            {/* Filtro por disponibilidad */}
            <Col md={3}>
              <Form.Select
                value={filterDisponible}
                onChange={(e) => {
                  setFilterDisponible(e.target.value);
                  setCurrentPage(0);
                }}
              >
                <option value="todos">Todos</option>
                <option value="disponibles">Disponibles</option>
                <option value="no_disponibles">No disponibles</option>
              </Form.Select>
            </Col>

            {/* Botón limpiar filtros */}
            <Col md={3}>
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={handleClearFilters}
                disabled={!searchTitulo && !searchAutor && !filterCategoria && filterDisponible === 'todos'}
              >
                Limpiar Filtros
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla de libros */}
      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Cargando libros...</p>
            </div>
          ) : libros.length === 0 ? (
            <EmptyState
              icon="book"
              title="No se encontraron libros"
              message={
                searchTitulo || searchAutor || filterCategoria || filterDisponible !== 'todos'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay libros registrados en el sistema'
              }
              actionText={
                searchTitulo || searchAutor || filterCategoria || filterDisponible !== 'todos'
                  ? 'Limpiar filtros'
                  : ''
              }
              onAction={
                searchTitulo || searchAutor || filterCategoria || filterDisponible !== 'todos'
                  ? handleClearFilters
                  : null
              }
            />
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th
                        onClick={() => handleSort('titulo')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Título {getSortIcon('titulo')}
                      </th>
                      <th
                        onClick={() => handleSort('autores')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Autores {getSortIcon('autores')}
                      </th>
                      <th style={{ width: '150px' }}>Categoría</th>
                      <th style={{ width: '100px' }} className="text-center">Ejemplares</th>
                      <th style={{ width: '150px' }} className="text-center">Disponibilidad</th>
                      <th className="text-center" style={{ width: '150px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libros.map((libro) => (
                      <tr key={libro.idLibro}>
                        <td>{libro.idLibro}</td>
                        <td className="fw-bold">{libro.titulo}</td>
                        <td>{libro.autores || 'N/A'}</td>
                        <td>
                          <Badge bg="info">{libro.nombreCategoria}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg="secondary" pill>
                            {libro.ejemplares}
                          </Badge>
                        </td>
                        <td className="text-center">
                          {libro.disponible ? (
                            <div className="d-flex flex-column align-items-center">
                              <Badge bg="success" className="mb-1">
                                ✓ Disponible
                              </Badge>
                              <small className="text-success" style={{ fontSize: '0.75rem' }}>
                                En catálogo
                              </small>
                            </div>
                          ) : (
                            <div className="d-flex flex-column align-items-center">
                              <Badge bg="danger" className="mb-1">
                                ✗ No disponible
                              </Badge>
                              <small className="text-danger" style={{ fontSize: '0.75rem' }}>
                                Fuera de catálogo
                              </small>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* Ver detalle */}
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => navigate(`/libros/${libro.idLibro}`)}
                              title="Ver detalle"
                            >
                              <FaEye />
                            </Button>

                            {/* Editar (solo ADMIN) */}
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="outline-warning"
                                onClick={() => navigate(`/libros/editar/${libro.idLibro}`)}
                                title="Editar"
                              >
                                <FaEdit />
                              </Button>
                            )}

                            {/* Activar/Desactivar disponibilidad (solo ADMIN) */}
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant={libro.disponible ? 'outline-danger' : 'outline-success'}
                                onClick={() => handleToggleDisponible(libro.idLibro, libro.disponible, libro.titulo)}
                                title={libro.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
                              >
                                {libro.disponible ? <FaTrash /> : '✓'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Paginación y selector de tamaño */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted">
                    Mostrando {libros.length > 0 ? currentPage * pageSize + 1 : 0} - {Math.min((currentPage + 1) * pageSize, totalElements)} de {totalElements} libros
                  </small>
                  <Form.Select
                    size="sm"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(0);
                    }}
                    style={{ width: 'auto' }}
                  >
                    <option value={10}>10 por página</option>
                    <option value={25}>25 por página</option>
                    <option value={50}>50 por página</option>
                  </Form.Select>
                </div>
                {totalPages > 1 && (
                  <Pagination className="mb-0">
                    {renderPaginationItems()}
                  </Pagination>
                )}
              </div>
            </>
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

export default LibrosList;
