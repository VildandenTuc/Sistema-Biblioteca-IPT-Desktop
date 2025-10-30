import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingFallback from "./components/common/LoadingFallback";
import "./App.css";

// Lazy loading de componentes - Code splitting para optimización
// Auth
const Login = lazy(() => import("./components/auth/Login"));
// REGISTRO DESHABILITADO
// const Register = lazy(() => import("./components/auth/Register"));

// Pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MiPerfil = lazy(() => import("./pages/MiPerfil"));
const CambiarPasswordObligatorio = lazy(() => import("./pages/CambiarPasswordObligatorio"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Libros
const LibrosList = lazy(() => import("./components/libros/LibrosList"));
const LibroForm = lazy(() => import("./components/libros/LibroForm"));
const LibroDetail = lazy(() => import("./components/libros/LibroDetail"));

// Usuarios
const UsuariosList = lazy(() => import("./components/usuarios/UsuariosList"));
const UsuarioForm = lazy(() => import("./components/usuarios/UsuarioForm"));
const UsuarioDetail = lazy(() => import("./components/usuarios/UsuarioDetail"));

// Categorías
const CategoriasList = lazy(() => import("./components/categorias/CategoriasList"));
const CategoriaForm = lazy(() => import("./components/categorias/CategoriaForm"));

// Préstamos
const PrestamosList = lazy(() => import("./components/prestamos/PrestamosList"));
const PrestamoForm = lazy(() => import("./components/prestamos/PrestamoForm"));
const PrestamoDetail = lazy(() => import("./components/prestamos/PrestamoDetail"));
const DevolucionForm = lazy(() => import("./components/prestamos/DevolucionForm"));
const MisPrestamos = lazy(() => import("./components/prestamos/MisPrestamos"));

// Reportes (módulo pesado: jspdf, xlsx)
const Reportes = lazy(() => import("./components/reportes/Reportes"));

// Backup
const BackupManager = lazy(() => import("./components/admin/BackupManager"));

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
          {/* Ruta Home - Página de bienvenida pública */}
          <Route path="/" element={<Home />} />

          {/* Rutas Públicas de Autenticación */}
          <Route path="/login" element={<Login />} />
          {/* REGISTRO PÚBLICO DESHABILITADO - Solo el ADMIN puede crear usuarios desde /usuarios/nuevo */}
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Ruta de Cambio de Contraseña Obligatorio (Primer Login) */}
          <Route
            path="/cambiar-password-obligatorio"
            element={
              <ProtectedRoute>
                <CambiarPasswordObligatorio />
              </ProtectedRoute>
            }
          />

          {/* Rutas Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Dashboard />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* ========== MÓDULO DE LIBROS ========== */}
          {/* Lista de libros - Accesible para todos los usuarios autenticados */}
          <Route
            path="/libros"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <LibrosList />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Nuevo libro - Solo ADMIN */}
          <Route
            path="/libros/nuevo"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <LibroForm />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Editar libro - Solo ADMIN */}
          <Route
            path="/libros/editar/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <LibroForm />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Detalle de libro - Accesible para todos */}
          <Route
            path="/libros/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <LibroDetail />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* ========== MÓDULO DE PRÉSTAMOS ========== */}
          {/* Lista de préstamos - Solo ADMIN */}
          <Route
            path="/prestamos"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <PrestamosList />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Registrar nuevo préstamo - Solo ADMIN */}
          <Route
            path="/prestamos/nuevo"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <PrestamoForm />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Registrar devolución - Solo ADMIN */}
          <Route
            path="/prestamos/devolucion/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <DevolucionForm />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Detalle de préstamo - Solo ADMIN */}
          <Route
            path="/prestamos/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <PrestamoDetail />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Mis Préstamos - Vista personal de préstamos del usuario */}
          <Route
            path="/mis-prestamos"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MisPrestamos />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* ========== MÓDULO DE CATEGORÍAS ========== */}
          {/* Lista de categorías - Solo ADMIN */}
          <Route
            path="/categorias"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <CategoriasList />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Nueva categoría - Solo ADMIN */}
          <Route
            path="/categorias/nuevo"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <CategoriaForm />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Editar categoría - Solo ADMIN */}
          <Route
            path="/categorias/editar/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <CategoriaForm />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* ========== MÓDULO DE USUARIOS ========== */}
          {/* Lista de usuarios - Solo ADMIN */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <UsuariosList />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Nuevo usuario - Solo ADMIN */}
          <Route
            path="/usuarios/nuevo"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <UsuarioForm />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Editar usuario - Solo ADMIN */}
          <Route
            path="/usuarios/editar/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <UsuarioForm />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Detalle de usuario - Solo ADMIN */}
          <Route
            path="/usuarios/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <UsuarioDetail />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* ========== MÓDULO DE REPORTES ========== */}
          {/* Reportes - Solo ADMIN */}
          <Route
            path="/reportes"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <Reportes />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* ========== GESTIÓN DE BACKUPS ========== */}
          {/* Backups - Solo ADMIN */}
          <Route
            path="/backup"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <>
                  <Navbar />
                  <BackupManager />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* ========== MI PERFIL ========== */}
          {/* Mi Perfil - Accesible para todos los usuarios autenticados */}
          <Route
            path="/mi-perfil"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MiPerfil />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 - Cualquier ruta no definida */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>

        {/* ToastContainer - Para notificaciones globales */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;
