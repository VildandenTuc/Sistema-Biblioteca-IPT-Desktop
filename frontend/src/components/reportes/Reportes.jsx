// src/components/reportes/Reportes.jsx

import { useState } from "react";
import { Container, Tabs, Tab, Card } from "react-bootstrap";
import { FaChartBar, FaBook, FaUsers, FaClock, FaExclamationTriangle } from "react-icons/fa";
import ReportePrestamos from "./ReportePrestamos";
import ReporteLibrosMasPrestados from "./ReporteLibrosMasPrestados";
import ReporteUsuariosActivos from "./ReporteUsuariosActivos";
import ReportePrestamosVencidos from "./ReportePrestamosVencidos";
import ReportePrestamosConFalta from "./ReportePrestamosConFalta";

const Reportes = () => {
  const [activeTab, setActiveTab] = useState("prestamos");

  // Renderizar solo el componente del tab activo para evitar múltiples toasts
  const renderActiveReport = () => {
    switch (activeTab) {
      case "prestamos":
        return <ReportePrestamos />;
      case "libros":
        return <ReporteLibrosMasPrestados />;
      case "usuarios":
        return <ReporteUsuariosActivos />;
      case "vencidos":
        return <ReportePrestamosVencidos />;
      case "faltas":
        return <ReportePrestamosConFalta />;
      default:
        return <ReportePrestamos />;
    }
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2>
          <FaChartBar className="me-2" />
          Reportes del Sistema
        </h2>
        <p className="text-muted">
          Visualiza y analiza estadísticas de la biblioteca
        </p>
      </div>

      <Card>
        <Card.Body>
          <Tabs
            id="reportes-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab
              eventKey="prestamos"
              title={
                <>
                  <FaChartBar className="me-2" />
                  Préstamos por Periodo
                </>
              }
            />

            <Tab
              eventKey="libros"
              title={
                <>
                  <FaBook className="me-2" />
                  Libros Más Prestados
                </>
              }
            />

            <Tab
              eventKey="usuarios"
              title={
                <>
                  <FaUsers className="me-2" />
                  Usuarios con Préstamos
                </>
              }
            />

            <Tab
              eventKey="vencidos"
              title={
                <>
                  <FaClock className="me-2" />
                  Préstamos Vencidos
                </>
              }
            />

            <Tab
              eventKey="faltas"
              title={
                <>
                  <FaExclamationTriangle className="me-2" />
                  Devoluciones Tardías
                </>
              }
            />
          </Tabs>

          {/* Renderizar solo el reporte activo */}
          <div className="mt-3">{renderActiveReport()}</div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reportes;
