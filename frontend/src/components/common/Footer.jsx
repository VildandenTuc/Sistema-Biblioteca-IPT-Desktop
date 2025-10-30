import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaHeart } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto">
      {/* Sección principal del footer */}
      <Container fluid className="py-4 px-3 px-md-4">
        <Row className="g-4">
          {/* Columna 1: Información de la Biblioteca */}
          <Col xs={12} md={6} lg={4}>
            <h5 className="fw-bold mb-3">
              <FaBook className="me-2" />
              Biblioteca IPT
            </h5>
            <p className="text-muted small">
              Sistema de gestión de biblioteca para el Instituto Politécnico de Tucumán.
              Facilitando el acceso al conocimiento desde {currentYear}.
            </p>
          </Col>

          {/* Columna 2: Enlaces rápidos */}
          <Col xs={6} md={6} lg={4}>
            <h5 className="fw-bold mb-3">Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/dashboard" className="text-muted text-decoration-none small hover-link">
                  Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/libros" className="text-muted text-decoration-none small hover-link">
                  Catálogo de Libros
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/categorias" className="text-muted text-decoration-none small hover-link">
                  Categorías
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/mis-prestamos" className="text-muted text-decoration-none small hover-link">
                  Mis Préstamos
                </Link>
              </li>
            </ul>
          </Col>

          {/* Columna 3: Contacto */}
          <Col xs={6} md={12} lg={4}>
            <h5 className="fw-bold mb-3">Contacto</h5>
            <ul className="list-unstyled text-muted small">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                Tucumán, Argentina
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                <a href="mailto:biblioteca@ipt.edu.ar" className="text-muted text-decoration-none hover-link">
                  biblioteca@ipt.edu.ar
                </a>
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                <a href="tel:+543814000000" className="text-muted text-decoration-none hover-link">
                  (0381) 400-0000
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Barra inferior del footer */}
      <div className="border-top border-secondary">
        <Container fluid className="py-3 px-3 px-md-4">
          <Row className="align-items-center">
            <Col xs={12} md={6} className="text-center text-md-start mb-2 mb-md-0">
              <small className="text-muted">
                © {currentYear} Biblioteca IPT. Todos los derechos reservados.
              </small>
            </Col>
            <Col xs={12} md={6} className="text-center text-md-end">
              <small className="text-muted">
                Desarrollado con <FaHeart className="text-danger" /> usando React + Spring Boot
              </small>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Estilos personalizados */}
      <style>{`
        footer {
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }

        .hover-link {
          transition: all 0.2s ease;
        }

        .hover-link:hover {
          color: #fff !important;
          padding-left: 5px;
        }

        /* Asegurar que el footer esté siempre al fondo */
        html, body, #root {
          height: 100%;
        }

        #root {
          display: flex;
          flex-direction: column;
        }

        .App {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
