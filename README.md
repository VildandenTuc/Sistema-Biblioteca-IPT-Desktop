# Sistema de Gestión de Biblioteca - IPT

<div align="center">

![Java](https://img.shields.io/badge/Java-17-red?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-brightgreen?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?style=for-the-badge&logo=mysql)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=for-the-badge&logo=bootstrap)

**Sistema completo de gestión de biblioteca con autenticación JWT, gestión de préstamos, reportes y backup de base de datos**

[Características](#-características) • [Tecnologías](#-stack-tecnológico) • [Instalación](#-instalación) • [Uso](#-uso) • [Documentación](#-documentación)

</div>

---

## 📋 Descripción

Sistema web completo de gestión de biblioteca desarrollado para el Instituto Politécnico de Tucumán (IPT). Permite administrar libros, usuarios, préstamos, generar reportes y realizar backups de la base de datos.

### 🎯 Características Principales

#### 🔐 Autenticación y Seguridad
- Sistema de login/registro con JWT
- Roles de usuario (ADMIN, USER)
- Protección de rutas y endpoints
- Cambio de contraseña seguro
- Variables de entorno para configuración sensible

#### 📚 Gestión de Libros
- CRUD completo de libros
- Búsqueda por título, autor, ISBN
- Filtros por categoría y disponibilidad
- Paginación y ordenamiento
- Activación/desactivación lógica
- Disponibilidad en tiempo real

#### 👥 Gestión de Usuarios
- CRUD de usuarios (solo ADMIN)
- Búsqueda por DNI, nombre, apellido
- Filtros por tipo de usuario y estado
- Historial de préstamos por usuario
- Perfil de usuario editable

#### 📖 Gestión de Préstamos
- Registro de préstamos (ADMIN)
- Devolución de libros con cálculo de faltas
- Búsquedas avanzadas (vencidos, con falta, por usuario)
- Notificaciones de vencimientos próximos
- Vista "Mis Préstamos" para usuarios

#### 📊 Reportes y Estadísticas
- Dashboard con estadísticas en tiempo real
- 5 tipos de reportes (préstamos, libros más prestados, usuarios activos, etc.)
- Exportación a Excel y PDF
- Solo accesible para ADMIN

#### 💾 Sistema de Backup
- Generación de backups completos de MySQL
- Restauración de base de datos
- Gestión de backups (listar, descargar, eliminar)
- Solo accesible para ADMIN

#### 🎨 Interfaz de Usuario
- Diseño responsive con Bootstrap 5
- Modo oscuro/claro (Dark Mode)
- Notificaciones toast
- Auto-refresh configurable
- Componentes reutilizables

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR WEB                           │
│                    (React 18 + Vite 5)                          │
│                     http://localhost:5173                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST + JWT
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    BACKEND API REST                             │
│               (Spring Boot 3.4.0 + JWT)                         │
│                   http://localhost:8080                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ JDBC
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    BASE DE DATOS                                │
│                     MySQL 8.0                                   │
│                   localhost:3306/biblioteca                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.4.0** - Framework principal
- **Spring Security** - Autenticación y autorización
- **JWT (JSON Web Tokens)** - Gestión de sesiones
- **Spring Data JPA** - ORM para base de datos
- **MySQL 8** - Base de datos relacional
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de código boilerplate
- **dotenv-java** - Gestión de variables de entorno

### Frontend
- **React 18** - Biblioteca de UI
- **Vite 5** - Build tool y dev server
- **React Router DOM 6** - Enrutamiento
- **Bootstrap 5.3** - Framework CSS
- **React Bootstrap** - Componentes React de Bootstrap
- **Axios** - Cliente HTTP
- **JWT Decode** - Decodificación de tokens
- **React Toastify** - Notificaciones
- **React Icons** - Iconografía
- **xlsx** - Exportación a Excel
- **jsPDF** - Exportación a PDF

---

## 📁 Estructura del Proyecto

```
Sistema-Biblioteca-IPT/
├── backend/                    # API REST con Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/ipt/biblioteca/
│   │   │   │       ├── controller/     # Controladores REST
│   │   │   │       ├── service/        # Lógica de negocio
│   │   │   │       ├── repository/     # Acceso a datos
│   │   │   │       ├── model/          # Entidades JPA
│   │   │   │       ├── dto/            # Data Transfer Objects
│   │   │   │       ├── security/       # Configuración JWT
│   │   │   │       └── exception/      # Manejo de errores
│   │   │   └── resources/
│   │   │       ├── application.properties     # Configuración
│   │   │       ├── application.properties.example
│   │   │       └── .env.example
│   │   └── test/               # Tests unitarios
│   ├── pom.xml                 # Dependencias Maven
│   └── README.md               # Documentación backend
│
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── api/                # Configuración Axios
│   │   ├── components/         # Componentes React
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── libros/         # CRUD de libros
│   │   │   ├── usuarios/       # CRUD de usuarios
│   │   │   ├── categorias/     # CRUD de categorías
│   │   │   ├── prestamos/      # Gestión de préstamos
│   │   │   ├── reportes/       # Módulo de reportes
│   │   │   ├── admin/          # BackupManager
│   │   │   └── common/         # Componentes reutilizables
│   │   ├── context/            # Context API (Auth, Theme)
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Páginas principales
│   │   ├── styles/             # CSS y temas
│   │   └── App.jsx             # Componente raíz
│   ├── package.json            # Dependencias npm
│   └── README.md               # Documentación frontend
│
├── docs/                       # Documentación adicional
│   ├── screenshots/            # Capturas de pantalla
│   └── api/                    # Documentación de API
│
└── README.md                   # Este archivo
```

---

## 🚀 Instalación

### Prerrequisitos

- **Java 17** o superior ([Descargar](https://www.oracle.com/java/technologies/downloads/))
- **Node.js 18+** y npm ([Descargar](https://nodejs.org/))
- **MySQL 8.0+** ([Descargar](https://dev.mysql.com/downloads/))
- **Maven 3.8+** (incluido en el proyecto con wrapper)
- **Git** ([Descargar](https://git-scm.com/))

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/Sistema-Biblioteca-IPT.git
cd Sistema-Biblioteca-IPT
```

### 2. Configurar Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE biblioteca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional)
CREATE USER 'biblioteca_user'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON biblioteca.* TO 'biblioteca_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar Backend

```bash
cd backend

# Copiar archivo de configuración de ejemplo
cp src/main/resources/.env.example .env

# Editar .env con tus credenciales
# DB_URL=jdbc:mysql://localhost:3306/biblioteca
# DB_USERNAME=root
# DB_PASSWORD=tu_password
# JWT_SECRET=tu_clave_secreta_larga_y_segura
# etc.

# Compilar y ejecutar
./mvnw clean install
./mvnw spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 4. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Copiar archivo de configuración de ejemplo (si aplica)
cp .env.example .env

# Editar .env con la URL del backend
# VITE_API_URL=http://localhost:8080

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 📖 Uso

### Credenciales por Defecto

Al iniciar la aplicación por primera vez, se crean dos usuarios de prueba:

**Administrador:**
- Email: `admin@biblioteca.com`
- Password: `admin123`

**Usuario Regular:**
- Email: `user@biblioteca.com`
- Password: `user123`

### Flujo de Trabajo

1. **Login**: Ingresar con credenciales de administrador o usuario
2. **Dashboard**: Visualizar estadísticas del sistema
3. **Gestión de Libros**: Crear, editar, eliminar y buscar libros
4. **Gestión de Usuarios**: Administrar usuarios del sistema (solo ADMIN)
5. **Préstamos**: Registrar préstamos y devoluciones (solo ADMIN)
6. **Mis Préstamos**: Ver historial personal de préstamos (USER)
7. **Reportes**: Generar y exportar reportes (solo ADMIN)
8. **Backups**: Realizar backups y restauraciones de BD (solo ADMIN)
9. **Mi Perfil**: Editar datos personales y cambiar contraseña

---

## 📚 Documentación

### Documentación Detallada

- [Documentación del Backend](./backend/README.md) - Endpoints, configuración, seguridad
- [Documentación del Frontend](./frontend/README.md) - Componentes, hooks, contextos
- [Plan de Desarrollo](./frontend/FRONTEND-PLAN.md) - Historial completo del proyecto

### API Endpoints

#### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar nuevo usuario

#### Libros
- `GET /api/libros/todos` - Listar todos los libros (paginado)
- `GET /api/libros/disponibles` - Libros disponibles
- `GET /api/libros/{id}` - Detalle de libro
- `POST /api/libros` - Crear libro (ADMIN)
- `PUT /api/libros/{id}` - Actualizar libro (ADMIN)
- `DELETE /api/libros/logica/{id}` - Eliminar libro (ADMIN)

#### Usuarios
- `GET /api/usuarios` - Listar usuarios (ADMIN)
- `GET /api/usuarios/{id}` - Detalle de usuario
- `POST /api/usuarios` - Crear usuario (ADMIN)
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `PUT /api/usuarios/{id}/cambiar-password` - Cambiar contraseña

#### Préstamos
- `GET /api/prestamos/todos` - Listar préstamos (ADMIN)
- `GET /api/prestamos/usuarios/{id}` - Préstamos por usuario
- `POST /api/prestamos` - Registrar préstamo (ADMIN)
- `PUT /api/prestamos/devolver` - Registrar devolución (ADMIN)

#### Backups
- `POST /api/backup/export` - Generar backup (ADMIN)
- `POST /api/backup/import` - Restaurar backup (ADMIN)
- `GET /api/backup/list` - Listar backups (ADMIN)
- `DELETE /api/backup/{filename}` - Eliminar backup (ADMIN)

---

## 🧪 Testing

### Backend
```bash
cd backend
./mvnw test
```

### Frontend
El proyecto ha sido testeado manualmente con **200+ pruebas** cubriendo:
- Autenticación y autorización
- CRUD de todas las entidades
- Búsquedas y filtros
- Generación de reportes
- Sistema de backup
- Validaciones de formularios
- Manejo de errores
- Responsividad

---

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación JWT**: Tokens seguros con expiración
2. **Roles y permisos**: ADMIN y USER con accesos diferenciados
3. **Variables de entorno**: Credenciales fuera del código
4. **Eliminación lógica**: Los datos no se borran físicamente
5. **Validaciones**: Backend y frontend
6. **CORS configurado**: Solo orígenes permitidos
7. **Encriptación de contraseñas**: BCrypt
8. **Protección de rutas**: Frontend y backend
9. **Prevención de inyección SQL**: JPA con parámetros
10. **Validación de archivos**: Solo .sql en backups
11. **Path traversal protection**: Validación de nombres de archivo
12. **Logs de auditoría**: Registro de operaciones críticas

---

## 🚢 Deployment

### Build de Producción

#### Backend
```bash
cd backend
./mvnw clean package -DskipTests
# El JAR estará en target/biblioteca-api-1.0.0.jar

# Ejecutar
java -jar target/biblioteca-api-1.0.0.jar
```

#### Frontend
```bash
cd frontend
npm run build
# Los archivos estarán en dist/

# Servir con servidor HTTP
npx serve -s dist -l 3000
```

### Configuración de Servidor

Ver documentación específica en:
- [Backend - Deployment](./backend/README.md#deployment)
- [Frontend - Deployment](./frontend/README.md#deployment)

---

## 📊 Estadísticas del Proyecto

- **Líneas de código Backend**: ~8,000
- **Líneas de código Frontend**: ~12,000
- **Componentes React**: 40+
- **Endpoints REST**: 50+
- **Testing manual**: 200+ pruebas
- **Bugs corregidos**: 30+
- **Tiempo de desarrollo**: 3 meses
- **Build size (Frontend)**: 1.29 MB (gzip: 406 kB)

---

## 🎓 Funcionalidades Destacadas

1. **Code-splitting con React.lazy()** - Carga bajo demanda de componentes
2. **Auto-refresh configurable** - Actualización automática de disponibilidad
3. **Modo oscuro completo** - Dark mode persistente
4. **Notificaciones en tiempo real** - Sistema de alertas
5. **Exportación múltiple** - Excel y PDF
6. **Backup automático de MySQL** - Sistema completo de respaldo
7. **Búsquedas avanzadas** - Filtros múltiples combinados
8. **Responsive design** - Funciona en móviles y tablets

---

## 👨‍💻 Autor

**Guido Fariña**
- GitHub: [@GuidoFC](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

## 📝 Licencia

Este proyecto fue desarrollado como trabajo final para el Instituto Politécnico de Tucumán (IPT).

---

## 🙏 Agradecimientos

- Instituto Politécnico de Tucumán (IPT)
- Profesores y tutores del curso
- Comunidad de Spring Boot y React

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella ⭐**

</div>
