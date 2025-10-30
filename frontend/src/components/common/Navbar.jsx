import { useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  NavDropdown,
  Button,
  Offcanvas,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUser,
  FaBook,
  FaBookReader,
  FaUsers,
  FaTags,
  FaHome,
  FaChartLine,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { toast } from "react-toastify";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada correctamente");
    navigate("/login");
    setShowOffcanvas(false);
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  // Función para verificar si la ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <BootstrapNavbar
      variant="dark"
      expand="lg"
      className="shadow-sm mb-0 navbar-custom"
      sticky="top"
    >
      <Container fluid className="px-3 px-md-4">
        {/* Logo y Título */}
        <BootstrapNavbar.Brand as={Link} to="/dashboard" className="fw-bold">
          <FaBook className="me-2" />
          <span className="d-none d-sm-inline">Biblioteca IPT</span>
          <span className="d-inline d-sm-none">BiblioIPT</span>
        </BootstrapNavbar.Brand>

        {/* Toggle para mobile */}
        <BootstrapNavbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={() => setShowOffcanvas(true)}
        />

        {/* Offcanvas para mobile / Navbar para desktop */}
        <BootstrapNavbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          show={showOffcanvas}
          onHide={handleCloseOffcanvas}
          className="bg-primary text-white"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id="offcanvasNavbarLabel">
              <FaBook className="me-2" />
              Biblioteca IPT
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="me-auto">
              {isAuthenticated && (
                <>
                  {/* Dashboard */}
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    onClick={handleCloseOffcanvas}
                    className={isActive("/dashboard") ? "active" : ""}
                  >
                    <FaHome className="me-2" />
                    Dashboard
                  </Nav.Link>

                  {/* Libros */}
                  <Nav.Link
                    as={Link}
                    to="/libros"
                    onClick={handleCloseOffcanvas}
                    className={isActive("/libros") ? "active" : ""}
                  >
                    <FaBook className="me-2" />
                    Libros
                  </Nav.Link>

                  {/* Préstamos */}
                  <NavDropdown
                    title={
                      <>
                        <FaBookReader className="me-2" />
                        Préstamos
                      </>
                    }
                    id="prestamos-dropdown"
                    className="nav-dropdown-white"
                  >
                    {/* Ver Préstamos - Solo ADMIN */}
                    {isAdmin() && (
                      <NavDropdown.Item
                        as={Link}
                        to="/prestamos"
                        onClick={handleCloseOffcanvas}
                      >
                        Ver Préstamos
                      </NavDropdown.Item>
                    )}

                    {/* Mis Préstamos - Todos los usuarios */}
                    <NavDropdown.Item
                      as={Link}
                      to="/mis-prestamos"
                      onClick={handleCloseOffcanvas}
                    >
                      Mis Préstamos
                    </NavDropdown.Item>

                    {/* Registrar Préstamo - Solo ADMIN */}
                    {isAdmin() && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          as={Link}
                          to="/prestamos/nuevo"
                          onClick={handleCloseOffcanvas}
                        >
                          Registrar Préstamo
                        </NavDropdown.Item>
                      </>
                    )}
                  </NavDropdown>

                  {/* Categorías - Solo ADMIN */}
                  {isAdmin() && (
                    <Nav.Link
                      as={Link}
                      to="/categorias"
                      onClick={handleCloseOffcanvas}
                      className={isActive("/categorias") ? "active" : ""}
                    >
                      <FaTags className="me-2" />
                      Categorías
                    </Nav.Link>
                  )}

                  {/* Usuarios - Solo ADMIN */}
                  {isAdmin() && (
                    <Nav.Link
                      as={Link}
                      to="/usuarios"
                      onClick={handleCloseOffcanvas}
                      className={isActive("/usuarios") ? "active" : ""}
                    >
                      <FaUsers className="me-2" />
                      Usuarios
                    </Nav.Link>
                  )}

                  {/* Reportes - Solo ADMIN */}
                  {isAdmin() && (
                    <Nav.Link
                      as={Link}
                      to="/reportes"
                      onClick={handleCloseOffcanvas}
                      className={isActive("/reportes") ? "active" : ""}
                    >
                      <FaChartLine className="me-2" />
                      Reportes
                    </Nav.Link>
                  )}
                </>
              )}
            </Nav>

            {/* Usuario y Logout */}
            {isAuthenticated && user && (
              <Nav className="ms-auto d-flex align-items-center gap-2">
                {/* Notificaciones - Solo ADMIN */}
                {isAdmin() && <NotificationDropdown />}

                {/* Theme Toggle Button */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip>
                      {isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                    </Tooltip>
                  }
                >
                  <Button
                    variant={isDark ? "warning" : "outline-light"}
                    size="sm"
                    onClick={toggleTheme}
                    className="d-flex align-items-center px-3"
                    aria-label="Toggle theme"
                    style={{
                      borderRadius: '20px',
                      fontWeight: '500'
                    }}
                  >
                    {isDark ? (
                      <>
                        <FaSun size={16} className="me-2" />
                        <span className="d-none d-md-inline">Claro</span>
                      </>
                    ) : (
                      <>
                        <FaMoon size={16} className="me-2" />
                        <span className="d-none d-md-inline">Oscuro</span>
                      </>
                    )}
                  </Button>
                </OverlayTrigger>

                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <FaUserCircle className="me-2" size={20} />
                      <span className="d-none d-lg-inline">
                        {user.email.split("@")[0]}
                      </span>
                      <span className="d-inline d-lg-none">{user.email}</span>
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                  className="nav-dropdown-white"
                >
                  <NavDropdown.ItemText>
                    <div className="px-2 py-1">
                      <small className="text-muted d-block">
                        Conectado como:
                      </small>
                      <strong className="d-block">{user.email}</strong>
                      <span className="badge bg-primary mt-1">
                        {user.role}
                      </span>
                    </div>
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={Link}
                    to="/mi-perfil"
                    onClick={handleCloseOffcanvas}
                  >
                    <FaUser className="me-2" />
                    Mi Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Offcanvas.Body>
        </BootstrapNavbar.Offcanvas>
      </Container>

      {/* Estilos personalizados */}
      <style>{`
        /* Mejorar dropdown en navbar oscura */
        .nav-dropdown-white .dropdown-toggle {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        .nav-dropdown-white .dropdown-toggle:hover {
          color: white !important;
        }

        /* Active state para nav links */
        .navbar-dark .nav-link.active {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-weight: 600;
        }

        /* Offcanvas mobile styling */
        .offcanvas.bg-primary .nav-link {
          color: rgba(255, 255, 255, 0.9) !important;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          margin-bottom: 0.25rem;
        }

        .offcanvas.bg-primary .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white !important;
        }

        .offcanvas.bg-primary .dropdown-menu {
          background-color: rgba(255, 255, 255, 0.95);
        }

        /* Responsive font sizes */
        @media (max-width: 768px) {
          .navbar-brand {
            font-size: 1rem;
          }
        }

        /* Smooth transitions */
        .nav-link, .dropdown-toggle {
          transition: all 0.2s ease;
        }
      `}</style>
    </BootstrapNavbar>
  );
};

export default Navbar;
