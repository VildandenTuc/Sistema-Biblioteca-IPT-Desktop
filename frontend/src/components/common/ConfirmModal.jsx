// src/components/common/ConfirmModal.jsx

import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaQuestionCircle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * Modal de confirmación reutilizable
 *
 * @param {boolean} show - Muestra u oculta el modal
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje de confirmación
 * @param {function} onConfirm - Función a ejecutar al confirmar
 * @param {function} onCancel - Función a ejecutar al cancelar
 * @param {string} variant - Tipo de modal: 'danger', 'warning', 'info', 'success' (default: 'danger')
 * @param {string} confirmText - Texto del botón confirmar (default: 'Confirmar')
 * @param {string} cancelText - Texto del botón cancelar (default: 'Cancelar')
 * @param {boolean} loading - Estado de carga durante confirmación (default: false)
 */
const ConfirmModal = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  variant = 'danger',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}) => {
  // Determinar ícono y colores según el variant
  const getIconByVariant = () => {
    switch (variant) {
      case 'danger':
        return <FaExclamationTriangle size={50} className="text-danger" />;
      case 'warning':
        return <FaExclamationTriangle size={50} className="text-warning" />;
      case 'info':
        return <FaInfoCircle size={50} className="text-info" />;
      case 'success':
        return <FaCheckCircle size={50} className="text-success" />;
      default:
        return <FaQuestionCircle size={50} className="text-secondary" />;
    }
  };

  // Determinar color del botón según el variant
  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop="static"
      keyboard={!loading}
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center py-3">
          {/* Ícono */}
          <div className="mb-3">
            {getIconByVariant()}
          </div>

          {/* Mensaje */}
          <p className="mb-0 fs-6">
            {message}
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={getButtonVariant()}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Procesando...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['danger', 'warning', 'info', 'success']),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  loading: PropTypes.bool,
};

export default ConfirmModal;
