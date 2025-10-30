import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FaBook, FaUserPlus, FaSignInAlt, FaBookReader, FaClock, FaShieldAlt } from "react-icons/fa";

const Home = () => {
  const heroStyle = {
    background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
    color: '#ffffff'
  };

  // Forzar tema oscuro en la landing page
  useEffect(() => {
    // Guardar el tema actual
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');

    // Forzar tema oscuro temporalmente
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.add('dark-theme');

    // Restaurar el tema original cuando se desmonte el componente
    return () => {
      if (currentTheme) {
        document.documentElement.setAttribute('data-bs-theme', currentTheme);
        document.documentElement.classList.remove('dark-theme');
        document.documentElement.classList.add(`${currentTheme}-theme`);
      }
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="py-5" style={heroStyle}>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col xs={12} lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4" style={{ color: '#ffffff' }}>
                Bienvenido a la Biblioteca IPT
              </h1>
              <p className="lead mb-4" style={{ color: '#ffffff' }}>
                Sistema moderno de gestión de biblioteca. Accede a miles de libros,
                gestiona tus préstamos y descubre nuevas lecturas.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button
                  as={Link}
                  to="/login"
                  variant="light"
                  size="lg"
                  className="fw-semibold"
                >
                  <FaSignInAlt className="me-2" />
                  Iniciar Sesión
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  size="lg"
                  className="fw-semibold"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    borderWidth: '2px',
                    borderStyle: 'solid'
                  }}
                >
                  <FaUserPlus className="me-2" />
                  Registrarse
                </Button>
              </div>
            </Col>
            <Col xs={12} lg={6} className="text-center">
              <div className="hero-illustration">
                <FaBook size={200} style={{ color: '#ffffff', opacity: 0.75 }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container className="py-4">
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold mb-3">¿Por qué usar nuestra biblioteca?</h2>
              <p className="text-muted">
                Un sistema completo para gestionar tus lecturas de forma eficiente
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {/* Feature 1 */}
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <div className="feature-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}>
                    <FaBookReader className="text-primary" size={36} />
                  </div>
                  <h5 className="fw-bold mb-3">Catálogo Completo</h5>
                  <p className="text-muted">
                    Accede a nuestro extenso catálogo de libros organizados por categorías
                    y autores.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 2 */}
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <div className="feature-icon bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}>
                    <FaClock className="text-success" size={36} />
                  </div>
                  <h5 className="fw-bold mb-3">Gestión de Préstamos</h5>
                  <p className="text-muted">
                    Solicita préstamos fácilmente y mantén un control de tus lecturas
                    en curso.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 3 */}
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <div className="feature-icon bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "80px", height: "80px" }}>
                    <FaShieldAlt className="text-warning" size={36} />
                  </div>
                  <h5 className="fw-bold mb-3">Seguro y Confiable</h5>
                  <p className="text-muted">
                    Tu información está protegida con los más altos estándares de
                    seguridad.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={heroStyle}>
        <Container className="py-4">
          <Row className="text-center">
            <Col>
              <h2 className="fw-bold mb-3" style={{ color: '#ffffff' }}>¿Listo para comenzar?</h2>
              <p className="lead mb-4" style={{ color: '#ffffff' }}>
                Únete a nuestra comunidad de lectores y accede a miles de libros hoy mismo
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button
                  as={Link}
                  to="/register"
                  variant="light"
                  size="lg"
                  className="fw-semibold"
                >
                  <FaUserPlus className="me-2" />
                  Crear Cuenta Gratis
                </Button>
                <Button
                  as={Link}
                  to="/login"
                  size="lg"
                  className="fw-semibold"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    borderWidth: '2px',
                    borderStyle: 'solid'
                  }}
                >
                  <FaSignInAlt className="me-2" />
                  Ya tengo cuenta
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer ligero para la landing */}
      <footer className="py-4 bg-dark text-light">
        <Container>
          <Row className="text-center">
            <Col>
              <p className="mb-0 text-muted small">
                © {new Date().getFullYear()} Biblioteca IPT. Todos los derechos reservados.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Estilos personalizados */}
      <style>{`
        .home-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .hero-illustration {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .feature-icon {
          transition: transform 0.3s ease;
        }

        .card:hover .feature-icon {
          transform: scale(1.1);
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15) !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .display-3 {
            font-size: 2.5rem;
          }

          .hero-illustration svg {
            width: 150px;
            height: 150px;
          }
        }

        @media (max-width: 576px) {
          .display-3 {
            font-size: 2rem;
          }

          .lead {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
