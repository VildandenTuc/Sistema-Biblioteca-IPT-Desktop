import { Spinner, Container } from "react-bootstrap";

const LoadingFallback = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-3 text-muted">Cargando módulo...</p>
      </div>
    </Container>
  );
};

export default LoadingFallback;
