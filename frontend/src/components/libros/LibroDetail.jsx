// src/components/libros/LibroDetail.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge, ListGroup } from 'react-bootstrap';
import { FaBook, FaArrowLeft, FaEdit, FaUserEdit, FaHashtag, FaLayerGroup, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../hooks/useAuth';

const LibroDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

  // Estados
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del libro
  useEffect(() => {
    fetchLibro();
  }, [id]);

  /**
   * Obtener datos del libro
   */
  const fetchLibro = async () => {
    setLoading(true);
    try {
      const response = await api.get(ENDPOINTS.LIBROS.BY_ID(id));
      setLibro(response.data);
    } catch (error) {
      console.error('Error al cargar libro:', error);
      toast.error(error.errorMessage || 'Error al cargar los datos del libro');
      navigate('/libros'); // Volver a la lista si hay error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Volver a la lista
   */
  const handleBack = () => {
    navigate('/libros');
  };

  /**
   * Ir a editar
   */
  const handleEdit = () => {
    navigate(`/libros/editar/${id}`);
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando datos del libro...</p>
        </div>
      </Container>
    );
  }

  // Si no hay libro (error)
  if (!libro) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <FaBook size={50} className="text-muted mb-3" />
          <p className="text-muted">No se encontró el libro</p>
          <Button variant="primary" onClick={handleBack}>
            <FaArrowLeft className="me-2" />
            Volver a la lista
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <FaBook className="me-2" />
                Detalle del Libro
              </h2>
              <p className="text-muted mb-0">Información completa del libro</p>
            </div>
            <div className="d-flex gap-2">
              {isAdmin && (
                <Button variant="warning" onClick={handleEdit}>
                  <FaEdit className="me-2" />
                  Editar
                </Button>
              )}
              <Button variant="outline-secondary" onClick={handleBack}>
                <FaArrowLeft className="me-2" />
                Volver
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Contenido principal */}
      <Row>
        <Col lg={8} xl={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaBook className="me-2" />
                {libro.titulo}
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {/* ID */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaHashtag className="text-muted me-2" />
                      <strong>ID:</strong>
                    </div>
                    <span className="text-muted">{libro.idLibro}</span>
                  </div>
                </ListGroup.Item>

                {/* Título */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaBook className="text-primary me-2" />
                      <strong>Título:</strong>
                    </div>
                    <span>{libro.titulo}</span>
                  </div>
                </ListGroup.Item>

                {/* Autores */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaUserEdit className="text-info me-2" />
                      <strong>Autores:</strong>
                    </div>
                    <span>{libro.autores || 'No especificado'}</span>
                  </div>
                </ListGroup.Item>

                {/* Categoría */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaLayerGroup className="text-success me-2" />
                      <strong>Categoría:</strong>
                    </div>
                    <Badge bg="info" className="fs-6">
                      {libro.nombreCategoria}
                    </Badge>
                  </div>
                </ListGroup.Item>

                {/* Ejemplares */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaCopy className="text-warning me-2" />
                      <strong>Ejemplares:</strong>
                    </div>
                    <Badge bg="secondary" className="fs-6">
                      {libro.ejemplares}
                    </Badge>
                  </div>
                </ListGroup.Item>

                {/* Disponibilidad */}
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaCheckCircle
                        className={`me-2 ${libro.disponible ? 'text-success' : 'text-danger'}`}
                      />
                      <strong>Estado:</strong>
                    </div>
                    {libro.disponible ? (
                      <Badge bg="success" className="fs-6">
                        Disponible
                      </Badge>
                    ) : (
                      <Badge bg="danger" className="fs-6">
                        No disponible
                      </Badge>
                    )}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Información adicional */}
          {!libro.disponible && (
            <Card className="mt-3 shadow-sm border-warning">
              <Card.Body className="bg-warning bg-opacity-10">
                <p className="mb-0 text-warning">
                  <strong>Nota:</strong> Este libro no está disponible para préstamo actualmente.
                </p>
              </Card.Body>
            </Card>
          )}

          {libro.ejemplares === 0 && (
            <Card className="mt-3 shadow-sm border-danger">
              <Card.Body className="bg-danger bg-opacity-10">
                <p className="mb-0 text-danger">
                  <strong>Advertencia:</strong> No hay ejemplares de este libro en inventario.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Panel lateral (opcional - información adicional) */}
        <Col lg={4} xl={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h6 className="mb-0">Acciones disponibles</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {isAdmin && (
                  <Button variant="warning" onClick={handleEdit}>
                    <FaEdit className="me-2" />
                    Editar este libro
                  </Button>
                )}
                <Button variant="outline-secondary" onClick={handleBack}>
                  <FaArrowLeft className="me-2" />
                  Volver a la lista
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Card de ayuda */}
          <Card className="mt-3 shadow-sm border-info">
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">Información</h6>
            </Card.Header>
            <Card.Body>
              <small className="text-muted">
                {isAdmin ? (
                  <>
                    Como administrador, puedes editar los datos de este libro o
                    eliminarlo desde la lista de libros.
                  </>
                ) : (
                  <>
                    Si deseas solicitar este libro en préstamo, contacta con el
                    administrador de la biblioteca.
                  </>
                )}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LibroDetail;
