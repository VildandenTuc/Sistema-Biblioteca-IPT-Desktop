import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <FaExclamationTriangle
          size={100}
          className="text-warning mb-4"
        />
        <h1 className="display-1 fw-bold text-warning">403</h1>
        <h2 className="mb-3">Acceso Denegado</h2>
        <p className="text-muted mb-4">
          No tiene permisos para acceder a esta página.
          <br />
          Contacte al administrador si cree que esto es un error.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            Ir al Dashboard
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Volver Atrás
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Unauthorized;
