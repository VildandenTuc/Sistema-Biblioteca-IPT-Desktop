// src/components/usuarios/UsuarioDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Button, Badge, Spinner, Table } from "react-bootstrap";
import { FaArrowLeft, FaEdit, FaUser, FaEnvelope, FaPhone, FaIdCard, FaUserTag, FaUserCheck, FaUserSlash } from "react-icons/fa";
import axiosInstance from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const UsuarioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.rol === "ADMIN";

  const [usuario, setUsuario] = useState(null);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPrestamos, setLoadingPrestamos] = useState(true);

  useEffect(() => {
    fetchUsuario();
    fetchPrestamos();
  }, [id]);

  const fetchUsuario = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.USUARIOS.BY_ID(id));
      setUsuario(response.data); // UsuarioDetalleDTO
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      toast.error("Error al cargar usuario");
      navigate("/usuarios");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrestamos = async () => {
    setLoadingPrestamos(true);
    try {
      const response = await axiosInstance.get(`/api/prestamos/usuarios/${id}`);
      setPrestamos(response.data);
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
      // No mostramos toast de error aquí para no ser intrusivos
      setPrestamos([]);
    } finally {
      setLoadingPrestamos(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando datos...</p>
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container className="py-5 text-center">
        <p>Usuario no encontrado</p>
      </Container>
    );
  }

  // Función para obtener el color del badge según el tipo de usuario
  const getTipoBadgeColor = (tipo) => {
    switch (tipo) {
      case "ALUMNO":
        return "primary";
      case "DOCENTE":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <FaUser className="me-2" />
            Detalle de Usuario
          </h4>
          <div className="d-flex gap-2">
            {isAdmin && (
              <Button variant="light" size="sm" onClick={() => navigate(`/usuarios/editar/${id}`)}>
                <FaEdit className="me-1" />
                Editar
              </Button>
            )}
          </div>
        </Card.Header>

        <Card.Body>
          <Row className="mb-4">
            <Col md={12} className="text-center mb-3">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: "100px", height: "100px", fontSize: "3rem" }}>
                <FaUser />
              </div>
              <h3 className="mt-3">
                {usuario.apellido}, {usuario.nombre}
              </h3>
              <Badge bg={usuario.activo ? "success" : "danger"} className="fs-6">
                {usuario.activo ? (
                  <>
                    <FaUserCheck className="me-1" />
                    Activo
                  </>
                ) : (
                  <>
                    <FaUserSlash className="me-1" />
                    Inactivo
                  </>
                )}
              </Badge>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card className="mb-3 border-primary">
                <Card.Body>
                  <h6 className="text-primary mb-3">
                    <FaIdCard className="me-2" />
                    Información Personal
                  </h6>
                  <div className="mb-2">
                    <strong>ID:</strong> {usuario.idUsuario}
                  </div>
                  <div className="mb-2">
                    <strong>DNI:</strong> {usuario.dni}
                  </div>
                  <div className="mb-2">
                    <strong>Nombre:</strong> {usuario.nombre}
                  </div>
                  <div className="mb-2">
                    <strong>Apellido:</strong> {usuario.apellido}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-3 border-info">
                <Card.Body>
                  <h6 className="text-info mb-3">
                    <FaUserTag className="me-2" />
                    Información de Contacto
                  </h6>
                  <div className="mb-2">
                    <FaEnvelope className="me-2 text-muted" />
                    <strong>Email:</strong> {usuario.email || "No registrado"}
                  </div>
                  <div className="mb-2">
                    <FaPhone className="me-2 text-muted" />
                    <strong>Teléfono:</strong> {usuario.telefono || "No registrado"}
                  </div>
                  <div className="mb-2">
                    <FaUserTag className="me-2 text-muted" />
                    <strong>Tipo:</strong>{" "}
                    <Badge bg={getTipoBadgeColor(usuario.tipoUsuario)}>
                      {usuario.tipoUsuario}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Botón volver */}
          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate("/usuarios")}>
              <FaArrowLeft className="me-2" />
              Volver al listado
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Sección de Historial de Préstamos */}
      <Card className="mt-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Historial de Préstamos</h5>
        </Card.Header>
        <Card.Body>
          {loadingPrestamos ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" variant="primary" />
              <p className="mt-2 text-muted small">Cargando préstamos...</p>
            </div>
          ) : prestamos.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <p className="mb-0">Este usuario no tiene préstamos registrados</p>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Libro</th>
                  <th>Fecha Préstamo</th>
                  <th>Devolución Esperada</th>
                  <th>Devolución Real</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.idPrestamo}>
                    <td>{prestamo.idPrestamo}</td>
                    <td>{prestamo.tituloLibro}</td>
                    <td>{new Date(prestamo.fechaPrestamo).toLocaleDateString('es-AR')}</td>
                    <td>{new Date(prestamo.fechaDevolucionEsperada).toLocaleDateString('es-AR')}</td>
                    <td>
                      {prestamo.fechaDevolucionReal
                        ? new Date(prestamo.fechaDevolucionReal).toLocaleDateString('es-AR')
                        : '-'}
                    </td>
                    <td>
                      {prestamo.devuelto ? (
                        prestamo.falta ? (
                          <Badge bg="warning" text="dark">Con Falta</Badge>
                        ) : (
                          <Badge bg="success">Devuelto</Badge>
                        )
                      ) : (
                        <Badge bg="primary">Activo</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Resumen */}
          {!loadingPrestamos && prestamos.length > 0 && (
            <div className="mt-3 pt-3 border-top">
              <Row className="text-center">
                <Col xs={4}>
                  <div className="small text-muted">Total</div>
                  <div className="h5 mb-0">{prestamos.length}</div>
                </Col>
                <Col xs={4}>
                  <div className="small text-muted">Activos</div>
                  <div className="h5 mb-0 text-primary">
                    {prestamos.filter(p => !p.devuelto).length}
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="small text-muted">Con Falta</div>
                  <div className="h5 mb-0 text-warning">
                    {prestamos.filter(p => p.falta).length}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UsuarioDetail;
