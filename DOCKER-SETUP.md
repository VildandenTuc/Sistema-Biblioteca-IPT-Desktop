# 🐳 Guía de Instalación con Docker - Sistema Biblioteca IPT

Esta guía te ayudará a instalar y ejecutar el Sistema de Gestión de Biblioteca IPT como una **aplicación standalone** usando Docker Desktop. No necesitas instalar Java, Node.js, MySQL ni ninguna otra dependencia manualmente.

---

## 📋 Requisitos Previos

### 1. Docker Desktop

**Descargar e instalar Docker Desktop:**
- 🔗 **Windows**: https://www.docker.com/products/docker-desktop
- 📦 **Tamaño**: ~500 MB
- 💾 **Espacio en disco**: Mínimo 10 GB libres

**Requisitos del sistema:**
- Windows 10/11 (64-bit)
- WSL 2 habilitado (Docker Desktop lo configura automáticamente)
- Virtualización habilitada en BIOS
- Mínimo 4 GB de RAM (recomendado 8 GB)

**Verificar instalación:**
1. Inicia Docker Desktop desde el menú de Windows
2. Espera a que muestre "Docker Desktop is running" (esquina inferior izquierda)
3. Verás el ícono de Docker en la bandeja del sistema

---

## 🚀 Instalación del Sistema

### Paso 1: Descomprimir la Aplicación

1. Descarga el archivo `Sistema-Biblioteca-IPT.zip`
2. Descomprime en una ubicación de tu preferencia (ejemplo: `C:\Biblioteca\`)
3. La estructura debe verse así:

```
Sistema-Biblioteca-IPT/
├── 🟢 instalar.bat          ← EJECUTA ESTE PRIMERO
├── 🟢 iniciar.bat
├── 🔴 detener.bat
├── 📋 ver-logs.bat
├── 🐳 docker-compose.yml
├── 📄 .env.docker
├── backend/
├── frontend/
└── DOCKER-SETUP.md (este archivo)
```

### Paso 2: Ejecutar Instalación Inicial

1. **Asegúrate de que Docker Desktop esté corriendo**
   - Abre Docker Desktop
   - Espera a que diga "Docker Desktop is running"

2. **Ejecuta el instalador:**
   - Haz **doble clic** en `instalar.bat`
   - Se abrirá una ventana de comandos

3. **Espera el proceso de instalación:**
   - ⏱️ **Duración**: 5-10 minutos (primera vez)
   - El script hará lo siguiente:
     - ✅ Verificar Docker Desktop
     - ✅ Configurar variables de entorno
     - ✅ Crear carpeta de backups
     - ✅ Construir imágenes Docker (tarda más)
     - ✅ Iniciar contenedores
     - ✅ Esperar a que servicios estén listos

4. **Resultado exitoso:**
   ```
   ========================================
      ✓ INSTALACIÓN COMPLETADA
   ========================================

   📌 Información importante:

     • Accede al sistema en: http://localhost:3000
     • Credenciales de administrador:
       - Email: admin@biblioteca.com
       - Password: admin123
   ```

5. **Abrir el sistema:**
   - El instalador preguntará si quieres abrir el navegador
   - Presiona `S` para abrir automáticamente
   - O abre manualmente: http://localhost:3000

### Paso 3: Primer Login

1. Accede a http://localhost:3000
2. Ingresa credenciales de administrador:
   - **Email**: `admin@biblioteca.com`
   - **Password**: `admin123`
3. **⚠️ IMPORTANTE**: Cambia la contraseña del administrador inmediatamente
4. ¡Listo! Ya puedes usar el sistema

---

## 🎮 Uso Diario del Sistema

### ▶️ Iniciar el Sistema

**Cada vez que quieras usar el sistema:**

1. Asegúrate de que **Docker Desktop esté corriendo**
2. Haz **doble clic** en `iniciar.bat`
3. Espera 30-60 segundos
4. El navegador se abrirá automáticamente en http://localhost:3000
5. Ingresa con tus credenciales

**Nota**: Los datos se conservan entre sesiones. No pierdes nada al apagar y encender.

### ⏸️ Detener el Sistema

**Cuando termines de usar el sistema:**

1. Haz **doble clic** en `detener.bat`
2. Espera unos segundos
3. El sistema se detendrá completamente
4. Tus datos quedan guardados de forma segura

**Nota**: Esto libera recursos del sistema (RAM, CPU) pero conserva todos los datos.

### 📋 Ver Logs (Troubleshooting)

**Si algo no funciona correctamente:**

1. Haz **doble clic** en `ver-logs.bat`
2. Se mostrarán los logs en tiempo real
3. Busca mensajes de error en color rojo
4. Presiona `Ctrl+C` para salir

---

## 🗂️ Estructura de la Aplicación

### Contenedores Docker

El sistema usa 3 contenedores:

| Contenedor | Descripción | Puerto |
|------------|-------------|--------|
| **biblioteca-mysql** | Base de datos MySQL 8.0 | 3306 |
| **biblioteca-backend** | API REST (Spring Boot) | 8080 |
| **biblioteca-frontend** | Interfaz web (React + Nginx) | 3000 |

### Datos Persistentes

**Dónde se guardan los datos:**

1. **Base de datos**:
   - Volumen Docker: `biblioteca-mysql-data`
   - Los datos persisten aunque detengas el sistema
   - No se borran al ejecutar `detener.bat`

2. **Backups**:
   - Carpeta: `Sistema-Biblioteca-IPT/backups/`
   - Puedes copiar esta carpeta para respaldar
   - Los backups se crean desde el módulo "Backup" del sistema

### Accesos al Sistema

- **Interfaz Web**: http://localhost:3000
- **API Backend**: http://localhost:8080
- **Base de datos**: localhost:3306

---

## ⚙️ Configuración Avanzada

### Archivo .env (Variables de Entorno)

El archivo `.env` contiene la configuración del sistema. Puedes editarlo con Notepad.

**Ubicación**: `Sistema-Biblioteca-IPT/.env`

**Variables importantes:**

```env
# Puerto del frontend (interfaz web)
FRONTEND_PORT=3000

# Puerto del backend (API)
BACKEND_PORT=8080

# Puerto de MySQL
MYSQL_PORT=3306

# Credenciales de base de datos
MYSQL_USER=biblioteca_user
MYSQL_PASSWORD=BibliotecaPass2024!
MYSQL_DATABASE=dbbiblioteca

# Clave secreta JWT (cámbiala en producción)
JWT_SECRET=MiClaveSecretaSuperSeguraParaJWT2024BibliotecaIPTMinimo32Caracteres
```

**Para cambiar puertos (ejemplo):**

1. Abre `.env` con Notepad
2. Cambia `FRONTEND_PORT=3000` a `FRONTEND_PORT=8000`
3. Guarda el archivo
4. Ejecuta `detener.bat`
5. Ejecuta `iniciar.bat`
6. Ahora accede en http://localhost:8000

### Cambiar Credenciales de Base de Datos

**⚠️ IMPORTANTE**: Solo hazlo ANTES de la primera instalación.

1. Abre `.env` con Notepad
2. Cambia `MYSQL_PASSWORD=BibliotecaPass2024!` por tu contraseña
3. Cambia `JWT_SECRET` por una clave única y larga (mínimo 32 caracteres)
4. Guarda el archivo
5. Ejecuta `instalar.bat`

---

## 🔧 Comandos Docker Útiles

### Ver Estado de Contenedores

```batch
docker-compose ps
```

Muestra el estado de los 3 contenedores (Up/Down).

### Reiniciar un Contenedor Específico

```batch
# Reiniciar backend
docker-compose restart backend

# Reiniciar frontend
docker-compose restart frontend

# Reiniciar MySQL
docker-compose restart mysql
```

### Ver Logs de un Contenedor Específico

```batch
# Logs del backend
docker-compose logs backend

# Logs del frontend
docker-compose logs frontend

# Logs de MySQL
docker-compose logs mysql
```

### Reconstruir Imágenes

**Si actualizaste el código fuente:**

```batch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 💾 Backups y Restauración

### Crear Backup desde la Aplicación

1. Inicia sesión como **ADMIN**
2. Ve al módulo **"Backup de Base de Datos"**
3. Click en **"Generar Backup"**
4. El archivo `.sql` se descarga automáticamente
5. También se guarda en `backups/` de la aplicación

### Backup Manual (Carpeta Completa)

**Respaldar TODO el sistema:**

1. Ejecuta `detener.bat`
2. Copia la carpeta completa `Sistema-Biblioteca-IPT/`
3. Guárdala en un lugar seguro (USB, nube, etc.)
4. Para restaurar, solo reemplaza la carpeta y ejecuta `iniciar.bat`

### Restaurar Backup desde la Aplicación

1. Inicia sesión como **ADMIN**
2. Ve al módulo **"Backup de Base de Datos"**
3. Click en **"Restaurar Backup"**
4. Selecciona el archivo `.sql`
5. Confirma la restauración
6. ⚠️ **PRECAUCIÓN**: Esto sobrescribe TODOS los datos actuales

---

## 🐛 Solución de Problemas

### Problema 1: "Docker Desktop no está corriendo"

**Causa**: Docker Desktop no está iniciado.

**Solución**:
1. Abre Docker Desktop desde el menú de Windows
2. Espera a que diga "Docker Desktop is running"
3. Intenta ejecutar el script nuevamente

---

### Problema 2: "Error al construir las imágenes"

**Causas posibles**:
- Sin conexión a Internet
- Poco espacio en disco
- Docker Desktop sin recursos suficientes

**Solución**:
1. Verifica conexión a Internet
2. Libera espacio en disco (mínimo 10 GB)
3. Abre Docker Desktop → Settings → Resources
4. Aumenta RAM (mínimo 4 GB) y CPU (mínimo 2 cores)
5. Ejecuta `instalar.bat` nuevamente

---

### Problema 3: "No puedo acceder a http://localhost:3000"

**Causa 1**: Los contenedores no están corriendo.

**Solución**:
```batch
# Ver estado
docker-compose ps

# Si están detenidos, iniciar
iniciar.bat
```

**Causa 2**: Otro programa usa el puerto 3000.

**Solución**:
1. Abre `.env` con Notepad
2. Cambia `FRONTEND_PORT=3000` a `FRONTEND_PORT=8000`
3. Ejecuta `detener.bat`
4. Ejecuta `iniciar.bat`
5. Accede a http://localhost:8000

---

### Problema 4: "Error 500 en el backend"

**Causa**: La base de datos no está lista o hay error de conexión.

**Solución**:
```batch
# Ver logs del backend
docker-compose logs backend

# Reiniciar solo el backend
docker-compose restart backend

# Si persiste, reiniciar todo
detener.bat
iniciar.bat
```

---

### Problema 5: "Olvidé la contraseña del administrador"

**Solución**: Restaurar usuario admin por defecto.

1. Ejecuta `ver-logs.bat`
2. Busca en los logs del backend el mensaje de creación del admin
3. O ejecuta esto en una terminal:

```batch
# Conectar a MySQL
docker exec -it biblioteca-mysql mysql -u root -p

# Cuando pida password, usa: BibliotecaRoot2024!

# Ejecutar (dentro de MySQL):
USE dbbiblioteca;
UPDATE usuarios SET password='$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu' WHERE email='admin@biblioteca.com';
exit;
```

Ahora puedes ingresar con:
- Email: `admin@biblioteca.com`
- Password: `admin123`

---

### Problema 6: "Los datos se borraron"

**Causa**: Se eliminó el volumen Docker.

**Prevención**:
- Haz backups regularmente desde el módulo "Backup"
- NO ejecutes `docker-compose down -v` (la opción `-v` borra volúmenes)

**Recuperación**:
- Restaura un backup anterior desde el módulo "Backup de Base de Datos"

---

## 🗑️ Desinstalación Completa

### Eliminar Solo los Contenedores

```batch
detener.bat
```

Esto detiene los contenedores pero conserva:
- Imágenes Docker
- Volúmenes (datos)
- Archivos de la aplicación

### Eliminar Contenedores + Volúmenes (BORRA DATOS)

```batch
docker-compose down -v
```

⚠️ **PRECAUCIÓN**: Esto borra TODOS los datos de la base de datos.

### Desinstalación Total

1. Ejecuta en una terminal CMD:
```batch
cd Sistema-Biblioteca-IPT
docker-compose down -v
docker rmi biblioteca-backend biblioteca-frontend mysql:8.0
```

2. Elimina la carpeta `Sistema-Biblioteca-IPT/`

3. (Opcional) Desinstala Docker Desktop desde Panel de Control

---

## 📊 Monitoreo del Sistema

### Ver Uso de Recursos

1. Abre Docker Desktop
2. Ve a "Containers" en el menú izquierdo
3. Verás los 3 contenedores con:
   - CPU %
   - Memoria
   - Estado (Running/Stopped)

### Ver Volúmenes

1. Abre Docker Desktop
2. Ve a "Volumes" en el menú izquierdo
3. Verás `biblioteca-mysql-data` con su tamaño

---

## 🔄 Actualización del Sistema

### Actualizar a una Nueva Versión

1. Descarga la nueva versión `Sistema-Biblioteca-IPT-v2.0.zip`
2. Ejecuta `detener.bat` en la versión anterior
3. **IMPORTANTE**: Copia la carpeta `backups/` de la versión anterior
4. Descomprime la nueva versión
5. Pega la carpeta `backups/` en la nueva versión
6. Ejecuta `instalar.bat` en la nueva versión
7. Tus datos se migrarán automáticamente (gracias a Flyway)

---

## 📞 Soporte

### Logs Detallados

```batch
# Ver logs de todos los servicios
ver-logs.bat

# Ver logs del backend (API)
docker-compose logs backend

# Ver logs del frontend
docker-compose logs frontend

# Ver logs de MySQL
docker-compose logs mysql
```

### Información del Sistema

```batch
# Versión de Docker
docker --version

# Información de Docker
docker info

# Contenedores corriendo
docker ps

# Todas las imágenes
docker images
```

---

## ✅ Checklist de Verificación

### Después de la Instalación

- [ ] Docker Desktop está corriendo
- [ ] Los 3 contenedores están en estado "Up" (`docker-compose ps`)
- [ ] Puedo acceder a http://localhost:3000
- [ ] Puedo hacer login con admin@biblioteca.com / admin123
- [ ] Cambié la contraseña del administrador
- [ ] Probé crear un libro de prueba
- [ ] Probé crear un usuario de prueba
- [ ] Probé hacer un backup de prueba
- [ ] La carpeta `backups/` existe y tiene permisos de escritura

### Antes de Usar en Producción

- [ ] Cambié `JWT_SECRET` en `.env` por una clave única
- [ ] Cambié `MYSQL_ROOT_PASSWORD` en `.env`
- [ ] Cambié `MYSQL_PASSWORD` en `.env`
- [ ] Cambié la contraseña del administrador
- [ ] Configuré backups automáticos (manual por ahora)
- [ ] Probé restaurar un backup
- [ ] Documenté las credenciales en un lugar seguro

---

## 🎯 Resumen de Comandos

| Acción | Comando |
|--------|---------|
| **Instalar (primera vez)** | `instalar.bat` |
| **Iniciar sistema** | `iniciar.bat` |
| **Detener sistema** | `detener.bat` |
| **Ver logs** | `ver-logs.bat` |
| **Estado de contenedores** | `docker-compose ps` |
| **Reiniciar backend** | `docker-compose restart backend` |
| **Reconstruir todo** | `docker-compose down && docker-compose build && docker-compose up -d` |

---

## 📚 Recursos Adicionales

- **Documentación principal**: README.md
- **Documentación backend**: backend/README.md
- **Documentación frontend**: frontend/README.md
- **Guía para Claude Code**: CLAUDE.md
- **Docker Compose docs**: https://docs.docker.com/compose/

---

## 🏆 Ventajas de esta Solución

✅ **Portabilidad**: Funciona en cualquier PC con Docker
✅ **Sin instalaciones**: No necesitas Java, Node, MySQL
✅ **Aislamiento**: No contamina tu sistema
✅ **Fácil de usar**: 1 click para iniciar/detener
✅ **Datos persistentes**: No pierdes información
✅ **Backups incluidos**: Sistema de respaldo integrado
✅ **Actualizaciones simples**: Reemplaza carpeta y ejecuta instalar.bat
✅ **Reproducible**: Funciona igual en todos los sistemas

---

**¡Disfruta del Sistema de Gestión de Biblioteca IPT! 📚**

*Desarrollado con ❤️ para IPT - Instituto Politécnico de Tucumán*
