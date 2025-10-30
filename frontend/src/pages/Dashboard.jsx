import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaBookReader,
  FaTags,
  FaChartLine,
  FaPlus,
  FaExclamationTriangle,
  FaBell,
  FaDatabase,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";
import { ENDPOINTS } from "../api/endpoints";
import { toast } from "react-toastify";
import { useNotifications } from "../hooks/useNotifications";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { notificaciones, count } = useNotifications(3); // Préstamos que vencen en 3 días
  const [stats, setStats] = useState({
    totalLibros: 0,
    totalUsuarios: 0,
    prestamosActivos: 0,
    totalCategorias: 0,
    librosDisponibles: 0,
    prestamosVencidos: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Obtener estadísticas en paralelo
        const [librosRes, usuariosRes, prestamosRes, categoriasRes] =
          await Promise.allSettled([
            axiosInstance.get(ENDPOINTS.LIBROS.BASE),
            axiosInstance.get(ENDPOINTS.USUARIOS.BASE),
            axiosInstance.get(ENDPOINTS.PRESTAMOS.NO_DEVUELTOS),
            axiosInstance.get(ENDPOINTS.CATEGORIAS.BASE),
          ]);

        // Procesar resultados
        const totalLibros =
          librosRes.status === "fulfilled"
            ? librosRes.value.data.length || 0
            : 0;

        const totalUsuarios =
          usuariosRes.status === "fulfilled"
            ? usuariosRes.value.data.content?.length ||
              usuariosRes.value.data.length ||
              0
            : 0;

        const prestamosActivos =
          prestamosRes.status === "fulfilled"
            ? prestamosRes.value.data.length || 0
            : 0;

        const totalCategorias =
          categoriasRes.status === "fulfilled"
            ? categoriasRes.value.data.length || 0
            : 0;

        setStats({
          totalLibros,
          totalUsuarios,
          prestamosActivos,
          totalCategorias,
          librosDisponibles: totalLibros - prestamosActivos,
          prestamosVencidos: 0, // Esto se puede calcular con endpoint específico
        });
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        toast.error("Error al cargar estadísticas del sistema");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Tarjeta de estadística reutilizable
  const StatCard = ({ icon: Icon, title, value, color, link }) => (
    <Col xs={12} sm={6} lg={4} xl={3} className="mb-4">
      <Card className="h-100 shadow-sm border-0 hover-shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="text-muted mb-1 small">{title}</p>
              <h2 className="mb-0 fw-bold">{isLoading ? "..." : value}</h2>
            </div>
            <div
              className={`bg-${color} bg-opacity-10 p-3 rounded-3`}
              style={{ minWidth: "60px", textAlign: "center" }}
            >
              <Icon className={`text-${color}`} size={28} />
            </div>
          </div>
          {link && !isLoading && (
            <Link
              to={link}
              className="btn btn-link p-0 mt-2 text-decoration-none small"
            >
              Ver detalles →
            </Link>
          )}
        </Card.Body>
      </Card>
    </Col>
  );

  // Tarjeta de acceso rápido
  const QuickActionCard = ({ icon: Icon, title, description, color, link }) => (
    <Col xs={12} sm={6} lg={4} className="mb-4">
      <Link to={link} className="text-decoration-none">
        <Card className="h-100 shadow-sm border-0 hover-shadow-lg">
          <Card.Body className="text-center p-4">
            <div
              className={`bg-${color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
              style={{ width: "70px", height: "70px" }}
            >
              <Icon className={`text-${color}`} size={32} />
            </div>
            <h5 className="mb-2 fw-bold">{title}</h5>
            <p className="text-muted small mb-0">{description}</p>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );

  return (
    <Container fluid className="py-4 px-3 px-md-4">
      {/* Encabezado del Dashboard */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 fw-bold">Dashboard</h1>
              <p className="text-muted mb-0">
                Bienvenido/a, <strong>{user?.email}</strong> ({user?.role})
              </p>
            </div>
            {isAdmin() && (
              <div className="d-flex gap-2">
                <Button
                  as={Link}
                  to="/reportes"
                  variant="outline-primary"
                  size="sm"
                >
                  <FaChartLine className="me-2" />
                  Reportes
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Alert de Vencimientos Próximos - Solo ADMIN */}
      {isAdmin() && count > 0 && (
        <Alert variant="warning" className="d-flex align-items-center shadow-sm">
          <FaBell className="me-3" size={24} />
          <div className="flex-grow-1">
            <Alert.Heading className="h6 mb-1">
              Atención: Préstamos próximos a vencer
            </Alert.Heading>
            <p className="mb-0">
              Hay <strong>{count}</strong> {count === 1 ? "préstamo" : "préstamos"} que {count === 1 ? "vence" : "vencen"} en los próximos 3 días.{" "}
              Revisa las notificaciones para más detalles.
            </p>
          </div>
          <Button
            as={Link}
            to="/prestamos"
            variant="warning"
            size="sm"
            className="ms-3"
          >
            Ver Préstamos
          </Button>
        </Alert>
      )}

      {/* Estadísticas Generales */}
      <Row className="mb-4">
        <Col>
          <h5 className="mb-3 fw-semibold">Estadísticas Generales</h5>
        </Col>
      </Row>

      <Row>
        <StatCard
          icon={FaBook}
          title="Total Libros"
          value={stats.totalLibros}
          color="primary"
          link="/libros"
        />
        <StatCard
          icon={FaBookReader}
          title="Préstamos Activos"
          value={stats.prestamosActivos}
          color="success"
          link="/prestamos"
        />
        <StatCard
          icon={FaBook}
          title="Libros Disponibles"
          value={stats.librosDisponibles}
          color="info"
          link="/libros"
        />
        {isAdmin() && (
          <StatCard
            icon={FaUsers}
            title="Total Usuarios"
            value={stats.totalUsuarios}
            color="warning"
            link="/usuarios"
          />
        )}
        {isAdmin() && (
          <StatCard
            icon={FaTags}
            title="Categorías"
            value={stats.totalCategorias}
            color="secondary"
            link="/categorias"
          />
        )}
        {stats.prestamosVencidos > 0 && (
          <StatCard
            icon={FaExclamationTriangle}
            title="Préstamos Vencidos"
            value={stats.prestamosVencidos}
            color="danger"
            link="/prestamos?vencidos=true"
          />
        )}
      </Row>

      {/* Accesos Rápidos */}
      <Row className="mt-5 mb-4">
        <Col>
          <h5 className="mb-3 fw-semibold">Accesos Rápidos</h5>
        </Col>
      </Row>

      <Row>
        <QuickActionCard
          icon={FaBook}
          title="Explorar Libros"
          description="Ver catálogo completo de libros disponibles"
          color="primary"
          link="/libros"
        />

        {isAdmin() && (
          <>
            <QuickActionCard
              icon={FaPlus}
              title="Registrar Préstamo"
              description="Registrar un nuevo préstamo de libro"
              color="success"
              link="/prestamos/nuevo"
            />
            <QuickActionCard
              icon={FaUsers}
              title="Gestionar Usuarios"
              description="Administrar usuarios del sistema"
              color="warning"
              link="/usuarios"
            />
            <QuickActionCard
              icon={FaPlus}
              title="Agregar Libro"
              description="Añadir un nuevo libro al catálogo"
              color="info"
              link="/libros/nuevo"
            />
          </>
        )}

        <QuickActionCard
          icon={FaBookReader}
          title="Mis Préstamos"
          description="Ver historial de préstamos"
          color="secondary"
          link="/mis-prestamos"
        />

        {isAdmin() && (
          <QuickActionCard
            icon={FaTags}
            title="Categorías"
            description="Explorar libros por categoría"
            color="dark"
            link="/categorias"
          />
        )}

        {isAdmin() && (
          <QuickActionCard
            icon={FaDatabase}
            title="Backups"
            description="Gestionar copias de seguridad de la BD"
            color="danger"
            link="/backup"
          />
        )}
      </Row>

      {/* Mensaje de carga */}
      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Cargando estadísticas...</p>
        </div>
      )}

      {/* Estilos adicionales para hover effects */}
      <style>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .hover-shadow-lg:hover {
          transform: translateY(-8px);
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2) !important;
        }
        @media (max-width: 576px) {
          .hover-shadow:hover,
          .hover-shadow-lg:hover {
            transform: none;
          }
        }
      `}</style>
    </Container>
  );
};

export default Dashboard;
