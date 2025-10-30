// src/api/endpoints.js

/**
 * Centralización de todos los endpoints de la API
 * Base URL definida en axiosConfig.js
 */

export const ENDPOINTS = {
  // ========== AUTENTICACIÓN ==========
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  // ========== USUARIOS ==========
  USUARIOS: {
    BASE: "/api/usuarios", // GET (paginado) - listar todos | POST - crear usuario
    BY_ID: (id) => `/api/usuarios/${id}`, // GET - obtener por ID | PUT - actualizar | DELETE - desactivar
    ACTIVOS: "/api/usuarios/activos", // GET (paginado) - solo usuarios activos
    INACTIVOS: "/api/usuarios/inactivos", // GET (paginado) - solo usuarios inactivos
    ACTIVAR: (id) => `/api/usuarios/${id}/activar`, // PUT - reactivar usuario
    CAMBIAR_PASSWORD: (id) => `/api/usuarios/${id}/cambiar-password`, // PUT - cambiar contraseña
    BUSCAR_DNI: "/api/usuarios/buscar/dni", // GET - buscar por DNI (?dni=12345678)
    BUSCAR_NOMBRE_APELLIDO: "/api/usuarios/buscar/nombre-apellido", // GET - buscar por nombre/apellido (?texto=Juan)
    BUSCAR_ACTIVOS_TIPO: "/api/usuarios/buscar/activos/tipo", // GET (paginado) - por tipo (?tipo=ALUMNO&page=0&size=10)
    BUSCAR_ACTIVOS_NOMBRE_TIPO: "/api/usuarios/buscar/activos/nombre-apellido-tipo", // GET - por nombre/apellido y tipo (?texto=Juan&tipo=ALUMNO)
  },

  // ========== LIBROS ==========
  LIBROS: {
    BASE: "/api/libros",
    BY_ID: (id) => `/api/libros/${id}`,
    DISPONIBLES: "/api/libros/disponibles",
    TODOS: "/api/libros/todos",
    NO_DISPONIBLES: "/api/libros/no-disponibles",
    POR_CATEGORIA: (idCategoria) => `/api/libros/categoria/${idCategoria}`,
    POR_AUTOR: "/api/libros/autor",
    POR_TITULO: "/api/libros/titulo",
    ELIMINAR_LOGICA: (id) => `/api/libros/logica/${id}`,
    ACTIVAR: (id) => `/api/libros/activar/${id}`,
  },

  // ========== PRÉSTAMOS ==========
  PRESTAMOS: {
    BASE: "/api/prestamos",
    TODOS: "/api/prestamos/todos", // Listado paginado de todos los préstamos
    DEVOLVER: "/api/prestamos/devolver",
    POR_USUARIO: (id) => `/api/prestamos/usuarios/${id}`,
    POR_LIBRO: (id) => `/api/prestamos/libros/${id}`,
    NO_DEVUELTOS: "/api/prestamos/nodevueltos",
    BUSCAR_USUARIO: "/api/prestamos/buscar/usuario",
    BUSCAR_LIBRO: "/api/prestamos/buscar/libro",
    BUSCAR_DNI: "/api/prestamos/buscar/dni",
    BUSCAR_FECHA_PRESTAMO: "/api/prestamos/buscar/fecha-prestamo",
    BUSCAR_FECHA_DEVOLUCION: "/api/prestamos/buscar/fecha-devolucion-esperada",
    VENCIDOS_NO_DEVUELTOS: "/api/prestamos/buscar/vencidos-no-devueltos",
    CON_FALTA: "/api/prestamos/buscar/faltas",
    ACTIVOS_USUARIO: (id) => `/api/prestamos/activos/usuario/${id}`,
    CONTADOR_ACTIVOS_USUARIO: (id) => `/api/prestamos/contador/usuario/${id}`,
    HISTORIAL_USUARIO: (id) => `/api/prestamos/historial/usuario/${id}`,
    VENCIMIENTOS_PROXIMOS: "/api/prestamos/vencimientos-proximos",
    ESTADISTICAS_LIBROS: "/api/prestamos/estadisticas/libros-mas-prestados",
  },

  // ========== CATEGORÍAS ==========
  CATEGORIAS: {
    BASE: "/api/categorias",
    BY_ID: (id) => `/api/categorias/${id}`,
    PAGINAS: "/api/categorias/paginas",
    ACTIVAS: "/api/categorias/activas",
    BUSCAR_ACTIVAS: "/api/categorias/buscar/activas",
    ELIMINAR_LOGICA: (id) => `/api/categorias/eliminacion-logica/${id}`,
    ACTIVAR: (id) => `/api/categorias/activar/${id}`,
  },

  // ========== BACKUPS ==========
  BACKUP: {
    EXPORT: "/api/backup/export", // POST - Generar y descargar backup
    IMPORT: "/api/backup/import", // POST - Restaurar backup (multipart/form-data)
    LIST: "/api/backup/list", // GET - Listar backups disponibles
    DOWNLOAD: (filename) => `/api/backup/download/${filename}`, // GET - Descargar backup específico
    DELETE: (filename) => `/api/backup/${filename}`, // DELETE - Eliminar backup
  },
};

// Exportación por defecto también (opcional, para compatibilidad)
export default ENDPOINTS;
