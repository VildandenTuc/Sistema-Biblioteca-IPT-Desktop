// src/components/common/EmptyState.jsx

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import {
  FaBook,
  FaUser,
  FaTags,
  FaFileAlt,
  FaSearch,
  FaExclamationCircle,
  FaInfoCircle,
  FaClipboardList,
} from 'react-icons/fa';

/**
 * Componente reutilizable para mostrar estados vacíos
 *
 * @param {string} icon - Tipo de ícono a mostrar: 'book', 'user', 'tag', 'file', 'search', 'exclamation', 'info', 'clipboard'
 * @param {string} title - Título principal del mensaje
 * @param {string} message - Mensaje descriptivo (opcional)
 * @param {string} actionText - Texto del botón de acción (opcional)
 * @param {function} onAction - Función a ejecutar al hacer click en el botón (opcional)
 * @param {string} actionVariant - Variante del botón: 'primary', 'secondary', 'link' (default: 'link')
 * @param {string} size - Tamaño del ícono: 'sm', 'md', 'lg' (default: 'md')
 */
const EmptyState = ({
  icon = 'info',
  title = 'No hay datos',
  message = '',
  actionText = '',
  onAction = null,
  actionVariant = 'link',
  size = 'md',
}) => {
  // Mapeo de íconos
  const iconMap = {
    book: FaBook,
    user: FaUser,
    tag: FaTags,
    file: FaFileAlt,
    search: FaSearch,
    exclamation: FaExclamationCircle,
    info: FaInfoCircle,
    clipboard: FaClipboardList,
  };

  // Obtener componente de ícono
  const IconComponent = iconMap[icon] || FaInfoCircle;

  // Tamaños de ícono
  const iconSizes = {
    sm: 40,
    md: 50,
    lg: 60,
  };

  const iconSize = iconSizes[size] || iconSizes.md;

  return (
    <div className="text-center py-5">
      {/* Ícono */}
      <div className="mb-3">
        <IconComponent size={iconSize} className="text-muted" />
      </div>

      {/* Título */}
      <h5 className="text-muted mb-2">{title}</h5>

      {/* Mensaje adicional */}
      {message && (
        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
          {message}
        </p>
      )}

      {/* Botón de acción opcional */}
      {actionText && onAction && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.oneOf([
    'book',
    'user',
    'tag',
    'file',
    'search',
    'exclamation',
    'info',
    'clipboard',
  ]),
  title: PropTypes.string,
  message: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  actionVariant: PropTypes.oneOf(['primary', 'secondary', 'link', 'outline-primary', 'outline-secondary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default EmptyState;
