// src/components/common/NotificationDropdown.jsx

import { useState } from "react";
import { Dropdown, Badge, Spinner, ListGroup } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { notificaciones, count, loading, refresh } = useNotifications(3, true, 300000); // 3 días, auto-refresh cada 5 min
  const [show, setShow] = useState(false);

  const handleToggle = (isOpen) => {
    setShow(isOpen);
    if (isOpen) {
      refresh(); // Refrescar al abrir
    }
  };

  const handleNotificationClick = (idPrestamo) => {
    setShow(false); // Cerrar dropdown
    navigate(`/prestamos/${idPrestamo}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-AR");
  };

  const getDaysRemaining = (fechaDevolucion) => {
    if (!fechaDevolucion) return null;
    // Normalizar fechas a medianoche para comparación correcta
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(fechaDevolucion + "T00:00:00");
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBadgeVariant = (daysRemaining) => {
    if (daysRemaining < 0) return "danger"; // Vencido
    if (daysRemaining === 0) return "warning"; // Vence hoy
    if (daysRemaining === 1) return "warning"; // Vence mañana
    return "info"; // Vence en más de 1 día
  };

  return (
    <Dropdown show={show} onToggle={handleToggle} align="end">
      <Dropdown.Toggle
        variant="link"
        id="notification-dropdown"
        className="position-relative text-decoration-none p-2"
        style={{ color: "inherit" }}
      >
        <FaBell size={20} />
        {count > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: "0.7rem" }}
          >
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: "350px", maxHeight: "400px", overflowY: "auto" }}>
        <Dropdown.Header className="d-flex justify-content-between align-items-center">
          <strong>Vencimientos Próximos</strong>
          {!loading && count > 0 && (
            <Badge bg="danger" pill>
              {count}
            </Badge>
          )}
        </Dropdown.Header>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" variant="primary" />
            <p className="mb-0 mt-2 text-muted">Cargando...</p>
          </div>
        ) : count === 0 ? (
          <div className="text-center py-4 text-muted">
            <FaBell size={30} className="mb-2 opacity-50" />
            <p className="mb-0">No hay préstamos próximos a vencer</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {notificaciones.map((prestamo) => {
              const daysRemaining = getDaysRemaining(prestamo.fechaDevolucionEsperada);
              const badgeVariant = getBadgeVariant(daysRemaining);

              return (
                <ListGroup.Item
                  key={prestamo.idPrestamo}
                  action
                  onClick={() => handleNotificationClick(prestamo.idPrestamo)}
                  className="py-2"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <strong className="d-block text-truncate" style={{ fontSize: "0.9rem" }}>
                        {prestamo.tituloLibro}
                      </strong>
                      <small className="text-muted d-block">
                        {prestamo.nombreUsuario} {prestamo.apellidoUsuario}
                      </small>
                      <small className="text-muted d-block">
                        Vence: {formatDate(prestamo.fechaDevolucionEsperada)}
                      </small>
                    </div>
                    <Badge
                      bg={badgeVariant}
                      className={`ms-2 ${badgeVariant === 'warning' ? 'text-dark' : ''}`}
                    >
                      {daysRemaining < 0
                        ? "Vencido"
                        : daysRemaining === 0
                        ? "Hoy"
                        : daysRemaining === 1
                        ? "Mañana"
                        : `${daysRemaining}d`}
                    </Badge>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}

        {count > 0 && (
          <>
            <Dropdown.Divider />
            <Dropdown.Item className="text-center text-primary" onClick={() => navigate("/prestamos")}>
              Ver todos los préstamos
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
