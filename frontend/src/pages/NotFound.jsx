import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle, FaHome, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
    >
      <div className="text-center px-3">
        {/* Icono animado */}
        <div className="mb-4 error-icon">
          <FaExclamationCircle size={120} className="text-primary" />
        </div>

        {/* Código de error */}
        <h1 className="display-1 fw-bold text-primary mb-3" style={{ fontSize: "8rem" }}>
          404
        </h1>

        {/* Mensaje principal */}
        <h2 className="fw-bold mb-3">Página No Encontrada</h2>

        {/* Mensaje secundario */}
        <p className="text-muted mb-4 lead">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Mensaje adicional */}
        <p className="text-muted small mb-5">
          Verifica que la URL sea correcta o regresa a la página principal.
        </p>

        {/* Botones de acción */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="fw-semibold"
          >
            <FaHome className="me-2" />
            Ir al Dashboard
          </Button>
          <Button
            variant="outline-secondary"
            size="lg"
            onClick={() => navigate(-1)}
            className="fw-semibold"
          >
            <FaArrowLeft className="me-2" />
            Volver Atrás
          </Button>
        </div>

        {/* Ilustración decorativa */}
        <div className="mt-5 text-muted">
          <svg
            width="300"
            height="150"
            viewBox="0 0 300 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto d-none d-md-block"
          >
            <path
              d="M50 100 Q 75 50, 100 100 T 150 100"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M150 100 Q 175 50, 200 100 T 250 100"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style>{`
        .error-icon {
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        /* Animación de entrada */
        .text-center {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive font size */
        @media (max-width: 768px) {
          .display-1 {
            font-size: 5rem !important;
          }

          h2 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 576px) {
          .display-1 {
            font-size: 4rem !important;
          }

          h2 {
            font-size: 1.5rem;
          }

          .lead {
            font-size: 1rem;
          }
        }

        /* Hover effects */
        .btn {
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </Container>
  );
};

export default NotFound;
