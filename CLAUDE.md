# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **monorepo** containing a complete library management system (Sistema de Gestión de Biblioteca) for Instituto Politécnico de Tucumán (IPT). It consists of two main applications:

- **Backend**: Spring Boot 3.5.3 REST API with JWT authentication (Java 17 + Maven)
- **Frontend**: React 18 + Vite 5 SPA with Bootstrap 5

The system manages books, users, categories, and loans with role-based access control (ADMIN/USER), reporting, and database backup capabilities.

## Repository Structure

```
Sistema-Biblioteca-IPT/
├── backend/          # Spring Boot REST API
├── frontend/         # React + Vite SPA
├── docs/             # Documentation
└── README.md         # Main documentation
```

## Development Commands

### Backend (Spring Boot)

Navigate to `backend/` directory first:

```bash
cd backend
```

**Build and Run:**
- `./mvnw spring-boot:run` - Start backend server (http://localhost:8080)
- `./mvnw clean compile` - Compile the project
- `./mvnw clean package` - Build JAR file for production
- `./mvnw clean install` - Full build with tests

**Testing:**
- `./mvnw test` - Run all tests
- `./mvnw test -Dtest=ClassName` - Run specific test class

**Environment Setup:**
- Backend requires `.env` file with database credentials and JWT secret
- Copy `.env.example` to `.env` and configure before running
- Never commit `.env` file (it's gitignored)

### Frontend (React + Vite)

Navigate to `frontend/` directory first:

```bash
cd frontend
```

**Development:**
- `npm install` - Install dependencies (first time only)
- `npm run dev` - Start dev server (http://localhost:5173)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

**Environment Setup:**
- Frontend uses `.env` file for API URL configuration
- Default API URL: `VITE_API_URL=http://localhost:8080`

### Running Both Applications

1. **Start backend first**: `cd backend && ./mvnw spring-boot:run`
2. **Start frontend**: `cd frontend && npm run dev`
3. Access frontend at http://localhost:5173
4. Backend API at http://localhost:8080

## Architecture Overview

### Backend Architecture (Spring Boot)

**Layered Architecture Pattern:**
```
Controller Layer (REST API) → Service Layer (Business Logic) → Repository Layer (Data Access) → Database (MySQL)
```

**Key Packages** (`backend/src/main/java/com/iptucuman/biblioteca/`):
- `controller/` - REST API endpoints (`@RestController`, `/api/*` prefix)
- `service/` - Business logic and transaction management
- `repository/` - Spring Data JPA repositories (data access)
- `modelo/` - JPA entities (Usuario, Libro, Categoria, Prestamo)
- `dto/` - Data Transfer Objects for API requests/responses
- `security/` - JWT authentication configuration and filters
- `config/` - Spring configuration classes (PasswordConfig)
- `exception/` - Custom exceptions and global exception handler
- `validation/` - Custom validators (e.g., password security)

**Database Management:**
- Uses **Flyway** for database migrations (automatic on startup)
- Migration files: `backend/src/main/resources/db/migration/V{version}__{description}.sql`
- **Never modify database schema manually** - always create new migration files
- Database: MySQL 8.0+ (`dbbiblioteca`)

**Security Implementation:**
- JWT-based authentication with configurable secret and expiration
- Spring Security with custom filters (`JwtAuthenticationFilter`)
- Password encoding using BCrypt (`PasswordConfig`)
- Role-based access: ADMIN (full access) vs USER (limited)
- Auth endpoints in `AuthController` (login/register)

### Frontend Architecture (React + Vite)

**Component-Based Architecture with Context API:**

**Key Directories** (`frontend/src/`):
- `components/` - React components organized by feature:
  - `auth/` - Login, Register, password change
  - `libros/` - Book management (CRUD)
  - `usuarios/` - User management (CRUD, ADMIN only)
  - `categorias/` - Category management (CRUD)
  - `prestamos/` - Loan management (CRUD, returns, searches)
  - `reportes/` - Reporting module (5 report types, Excel/PDF export, ADMIN only)
  - `admin/` - Backup management (ADMIN only)
  - `common/` - Reusable components (Navbar, Footer, ProtectedRoute, ConfirmModal, etc.)
- `context/` - React Context providers (AuthContext, ThemeContext)
- `hooks/` - Custom React hooks (useAuth, useTheme, useAutoRefresh, useNotifications)
- `pages/` - Page-level components (Home, Dashboard, MiPerfil, NotFound, etc.)
- `api/` - Axios configuration and API endpoint definitions
- `utils/` - Utility functions (token management, validation, export utilities)
- `styles/` - CSS files (theme.css for dark mode variables)

**State Management:**
- Context API for global state (auth, theme)
- Local component state with useState/useReducer
- No Redux or external state libraries

**Routing:**
- React Router DOM v6 with protected routes
- Role-based route protection via `ProtectedRoute` HOC
- Automatic redirect to login if unauthenticated

**Performance Optimizations:**
- Code-splitting with React.lazy() for 20+ components
- Manual chunk splitting in Vite config (react-vendor, ui-vendor, reports-vendor, utils-vendor)
- Auto-refresh functionality with configurable intervals

**Styling:**
- Bootstrap 5.3 with `data-bs-theme` attribute
- React Bootstrap components
- Custom CSS variables for dark mode support
- Fully responsive design (mobile, tablet, desktop)

## Key Technologies

### Backend Stack
- **Java 17** - Language
- **Spring Boot 3.5.3** - Framework
- **Spring Security 6.x** - Authentication/Authorization
- **Spring Data JPA** - ORM
- **MySQL 8.0+** - Database
- **Flyway 10.x** - Database migrations
- **JWT (JJWT 0.11.5)** - Token authentication
- **Lombok** - Boilerplate reduction
- **Jakarta Validation** - Input validation
- **dotenv-java** - Environment variable management
- **Maven** - Build tool

### Frontend Stack
- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **React Router DOM 6** - Client-side routing
- **Bootstrap 5.3** - CSS framework
- **React Bootstrap 2** - React components
- **Axios 1.6** - HTTP client
- **jwt-decode 4** - Token decoding
- **React Toastify 10** - Toast notifications
- **React Icons 5** - Icon library
- **xlsx** - Excel export
- **jspdf + jspdf-autotable** - PDF export

## Important Conventions and Patterns

### Backend Conventions

**DTOs Pattern:**
- Separate DTOs for different operations: `RegistroDTO`, `DetalleDTO`, `RespuestaDTO`, `ActualizarDTO`
- Never expose entity models directly in API responses
- Use constructor-based DTO creation in service layer

**Repository Queries:**
- Use Spring Data JPA query methods when possible
- Custom queries use `@Query` annotation with JPQL
- Pagination support with `Pageable` parameter

**Exception Handling:**
- Custom exceptions: `ResourceNotFoundException`, `DuplicateResourceException`
- Global exception handler: `GlobalExceptionHandler` with `@ControllerAdvice`
- Return structured error responses with HTTP status codes

**Service Layer:**
- Use constructor-based dependency injection (not `@Autowired`)
- All business logic in service layer, not controllers
- Transaction management with `@Transactional`

**Security:**
- All endpoints except `/auth/**` require JWT token
- Token passed in `Authorization: Bearer {token}` header
- Role validation in controllers with `@PreAuthorize` (if needed)

### Frontend Conventions

**Component Naming:**
- PascalCase for components: `LibrosList.jsx`, `UsuarioForm.jsx`
- Group related components in feature folders

**Hooks:**
- Custom hooks start with `use`: `useAuth.js`, `useTheme.js`
- Always use hooks at component top level

**API Calls:**
- Centralized Axios instance in `api/axiosConfig.js`
- Automatic JWT token injection via interceptors
- Automatic token refresh and error handling

**State and Props:**
- Always destructure props
- Use meaningful state variable names
- Lift state up when needed, keep local when possible

**Routing:**
- Wrap protected routes with `<ProtectedRoute allowedRoles={['ADMIN', 'USER']}>`
- Use `Navigate` for redirects

**Styling:**
- Bootstrap utility classes preferred over custom CSS
- Dark mode support via CSS variables in `theme.css`
- Responsive breakpoints: mobile (<576px), tablet (576-768px), desktop (768-992px), large (>992px)

## Authentication and Authorization

### User Roles
- **ADMIN**: Full system access (user management, loan management, reports, backups)
- **USER**: Limited access (view books, view own loans, edit own profile)

### Authentication Flow
1. User logs in via `/auth/login` with email/password
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Token included in all subsequent API requests via Axios interceptor
5. Backend validates token on each request via `JwtAuthenticationFilter`
6. Token expiration triggers automatic logout

### First Login (Temporary Password)
- New users have temporary password = their DNI
- System forces password change on first login
- Implemented in `CambiarPasswordObligatorio.jsx` component

## Database Schema

**Main Tables:**
- `usuarios` - Users with authentication (email, password, rol, tipo_usuario)
- `libros` - Books catalog (titulo, autor, isbn, ejemplares, disponible)
- `categorias` - Book categories (nombre, descripcion, activo)
- `prestamos` - Loan transactions (id_usuario, id_libro, fecha_prestamo, fecha_devolucion_prevista, fecha_devolucion_real, falta)

**Key Relationships:**
- Usuario → Prestamos (one-to-many)
- Libro → Prestamos (one-to-many)
- Categoria → Libros (one-to-many)

**Soft Deletes:**
- Users and categories use logical deletion (`activo` field)
- Books use logical deletion (`disponible` field)
- Loans are never deleted (audit trail)

## Common Development Tasks

### Adding New Backend Endpoint

1. Create/update DTO in `dto/` package
2. Add repository method in `repository/` interface (if needed)
3. Add business logic in `service/` class
4. Add controller endpoint in `controller/` class with proper HTTP method and path
5. Test manually with Postman/Insomnia or write integration test

### Adding New Frontend Component

1. Create component file in appropriate `components/` subfolder
2. Add API call functions (use existing Axios instance from `api/axiosConfig.js`)
3. Import component in parent/page component
4. Add route in `App.jsx` if needed (wrap with `ProtectedRoute` for auth)
5. Update Navbar links if needed (check role-based visibility)

### Database Schema Changes

1. Create new migration file: `backend/src/main/resources/db/migration/V{next_version}__{description}.sql`
2. Use sequential version numbers (e.g., V12, V13, V14)
3. Write SQL DDL statements (CREATE, ALTER, INSERT, etc.)
4. Restart application to apply migration automatically via Flyway
5. Never rollback migrations - create new forward migration to fix issues

### Adding New Report

1. Create report component in `frontend/src/components/reportes/`
2. Add API endpoint in `backend/src/main/java/com/iptucuman/biblioteca/controller/`
3. Add service method with query logic in corresponding service class
4. Add tab in `Reportes.jsx` component
5. Implement Excel/PDF export using existing utilities in `frontend/src/utils/exportUtils.js`

## Environment Variables

### Backend (.env file required)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dbbiblioteca
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=YourVeryLongSecretKeyAtLeast32CharactersLong
JWT_EXPIRATION=86400000

# Backup paths
BACKUP_DIRECTORY=D:/backups/biblioteca
MYSQLDUMP_PATH=C:/Program Files/MySQL/MySQL Server 9.1/bin/mysqldump.exe
MYSQL_PATH=C:/Program Files/MySQL/MySQL Server 9.1/bin/mysql.exe

# Development
SHOW_SQL=true
FORMAT_SQL=true
```

### Frontend (.env file)

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Biblioteca IPT
VITE_TOKEN_KEY=biblioteca_token
```

## Testing Strategy

### Backend Testing
- Integration tests in `src/test/java/com/iptucuman/biblioteca/controller/`
- Test authentication, CRUD operations, validations
- Run with `./mvnw test`

### Frontend Testing
- Currently manual testing (200+ test cases documented)
- No automated tests yet (future: Jest + React Testing Library)

## Default Credentials

**Admin User:**
- Email: `admin@biblioteca.com`
- Password: `admin123` (change in production)
- Role: ADMIN

**Test User:**
- Email: `usuario@biblioteca.com`
- Password: `usuario123`
- Role: USER

## Production Deployment Notes

### Backend
- Build JAR: `./mvnw clean package -DskipTests`
- Output: `target/biblioteca-0.0.1-SNAPSHOT.jar`
- Run: `java -jar target/biblioteca-0.0.1-SNAPSHOT.jar`
- Configure production `.env` with secure credentials
- Use production database with proper backups
- Set `SHOW_SQL=false` in production

### Frontend
- Build: `npm run build`
- Output: `dist/` directory
- Serve with nginx/Apache with SPA routing support
- Update `VITE_API_URL` to production backend URL
- Enable HTTPS in production

## Security Best Practices

- Never commit `.env` files (already in `.gitignore`)
- Use strong JWT secrets (minimum 32 characters)
- Change default admin credentials immediately
- Use HTTPS in production
- Validate all inputs on both frontend and backend
- Use parameterized queries (JPA prevents SQL injection)
- Implement CORS restrictions in backend for production
- Regular database backups (system includes backup module)

## Known Issues and Notes

- Backend DevTools disabled due to JWT secret cache issue (commented in pom.xml)
- Frontend uses manual chunk splitting to reduce bundle size
- Dark mode persistence uses localStorage
- Auto-refresh in some components (configurable, default 30s)
- Backend validation requires strong passwords (8+ chars, uppercase, lowercase, number, special char)

## Additional Documentation

- **Main README**: `README.md` - Project overview and installation
- **Backend README**: `backend/README.md` - Backend API documentation
- **Frontend README**: `frontend/README.md` - Frontend component documentation
- **Backend CLAUDE.md**: `backend/CLAUDE.md` - Backend-specific guidance (now superseded by this file)
- **Development Plan**: `frontend/FRONTEND-PLAN.md` - Complete development history

## Quick Reference: Common File Locations

**Backend:**
- Main application: `backend/src/main/java/com/iptucuman/biblioteca/BibliotecaApplication.java`
- Security config: `backend/src/main/java/com/iptucuman/biblioteca/security/SecurityConfig.java`
- JWT utilities: `backend/src/main/java/com/iptucuman/biblioteca/security/JwtUtil.java`
- Database migrations: `backend/src/main/resources/db/migration/`
- Application properties: `backend/src/main/resources/application.properties`

**Frontend:**
- Main entry: `frontend/src/main.jsx`
- App routing: `frontend/src/App.jsx`
- Axios config: `frontend/src/api/axiosConfig.js`
- API endpoints: `frontend/src/api/endpoints.js`
- Auth context: `frontend/src/context/AuthContext.jsx`
- Theme config: `frontend/src/styles/theme.css`
- Vite config: `frontend/vite.config.js`
