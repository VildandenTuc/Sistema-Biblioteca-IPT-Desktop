# 🐳 Sistema Biblioteca IPT - Versión Docker (Standalone)

## 🎯 Inicio Rápido

### Primera Instalación

1. **Asegúrate de tener Docker Desktop instalado y corriendo**
2. **Ejecuta**: `instalar.bat` (doble clic)
3. **Espera** 5-10 minutos (primera vez)
4. **Accede** a http://localhost:3000
5. **Login** con `admin@biblioteca.com` / `admin123`

### Uso Diario

- **Iniciar**: `iniciar.bat` → Abre http://localhost:3000
- **Detener**: `detener.bat`
- **Ver logs**: `ver-logs.bat`
- **Ver estado**: `estado.bat`

---

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `instalar.bat` | 🟢 Primera instalación (ejecutar una sola vez) |
| `iniciar.bat` | 🟢 Iniciar sistema (uso diario) |
| `detener.bat` | 🔴 Detener sistema |
| `ver-logs.bat` | 📋 Ver logs en tiempo real |
| `estado.bat` | 📊 Ver estado del sistema |
| `limpiar.bat` | 🗑️ Limpieza completa (⚠️ borra datos) |
| `docker-compose.yml` | 🐳 Orquestación de contenedores |
| `.env` | ⚙️ Configuración (se crea automáticamente) |
| `DOCKER-SETUP.md` | 📖 Guía completa paso a paso |

---

## 🐳 Contenedores

El sistema usa 3 contenedores Docker:

1. **biblioteca-mysql** (Base de datos)
   - Puerto: 3306
   - Volumen persistente: `biblioteca-mysql-data`

2. **biblioteca-backend** (API Spring Boot)
   - Puerto: 8080
   - Depende de: MySQL

3. **biblioteca-frontend** (React + Nginx)
   - Puerto: 3000
   - Depende de: Backend

---

## 🔑 Credenciales por Defecto

### Administrador
- **Email**: `admin@biblioteca.com`
- **Password**: `admin123`
- ⚠️ **CAMBIA LA CONTRASEÑA DESPUÉS DEL PRIMER LOGIN**

### Base de Datos
- **Usuario root**: `root`
- **Password root**: `BibliotecaRoot2024!`
- **Usuario app**: `biblioteca_user`
- **Password app**: `BibliotecaPass2024!`
- **Base de datos**: `dbbiblioteca`

---

## 💾 Backups

### Desde la Aplicación
1. Login como ADMIN
2. Ir a "Backup de Base de Datos"
3. Click en "Generar Backup"
4. El archivo `.sql` se descarga automáticamente

### Manual (Carpeta Completa)
1. Ejecutar `detener.bat`
2. Copiar carpeta `Sistema-Biblioteca-IPT/`
3. Guardar en lugar seguro

### Restaurar
1. Login como ADMIN
2. Ir a "Backup de Base de Datos"
3. Click en "Restaurar Backup"
4. Seleccionar archivo `.sql`

---

## 🔧 Configuración Avanzada

### Cambiar Puertos

Edita el archivo `.env`:

```env
# Puerto del frontend (interfaz web)
FRONTEND_PORT=3000

# Puerto del backend (API)
BACKEND_PORT=8080

# Puerto de MySQL
MYSQL_PORT=3306
```

Después de cambiar, ejecuta:
```batch
detener.bat
iniciar.bat
```

### Cambiar Credenciales

⚠️ **Solo ANTES de la primera instalación**

Edita `.env.docker` antes de ejecutar `instalar.bat`:

```env
MYSQL_ROOT_PASSWORD=TuPasswordRootAqui
MYSQL_PASSWORD=TuPasswordAqui
JWT_SECRET=TuClaveSecretaMuyLargaMinimo32Caracteres
```

---

## 🐛 Problemas Comunes

### "Docker Desktop no está corriendo"
**Solución**: Abre Docker Desktop y espera a que esté listo.

### "No puedo acceder a localhost:3000"
**Solución**:
```batch
estado.bat  # Ver estado
ver-logs.bat  # Ver errores
```

### "Error al construir imágenes"
**Solución**:
- Verifica conexión a Internet
- Libera espacio en disco (mínimo 10 GB)
- Aumenta recursos de Docker Desktop

### "Olvidé la contraseña del admin"
**Solución**: Ver `DOCKER-SETUP.md` sección "Problema 5"

---

## 📊 Comandos Docker Útiles

```batch
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Reiniciar backend
docker-compose restart backend

# Reconstruir todo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Ver uso de recursos
docker stats

# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect biblioteca-mysql-data
```

---

## 🔄 Actualizar a Nueva Versión

1. Ejecutar `detener.bat`
2. Copiar carpeta `backups/`
3. Descomprimir nueva versión
4. Pegar carpeta `backups/` en nueva versión
5. Ejecutar `instalar.bat`

---

## 🗑️ Desinstalar

### Mantener datos
```batch
detener.bat
# Después elimina la carpeta manualmente
```

### Borrar todo (incluyendo datos)
```batch
limpiar.bat
# Después elimina la carpeta manualmente
```

---

## 📖 Documentación Completa

- **Guía de instalación**: `DOCKER-SETUP.md` (⭐ Recomendado)
- **Documentación principal**: `README.md`
- **Documentación backend**: `backend/README.md`
- **Documentación frontend**: `frontend/README.md`

---

## ✅ Requisitos del Sistema

- **SO**: Windows 10/11 (64-bit)
- **RAM**: Mínimo 4 GB (recomendado 8 GB)
- **Disco**: Mínimo 10 GB libres
- **Docker Desktop**: Última versión

---

## 🎯 URLs de Acceso

- **Interfaz Web**: http://localhost:3000
- **API Backend**: http://localhost:8080
- **Base de Datos**: localhost:3306

---

## 📞 Soporte

Para problemas o dudas:
1. Revisa `DOCKER-SETUP.md` (solución de problemas)
2. Ejecuta `ver-logs.bat` para ver errores
3. Ejecuta `estado.bat` para ver el estado

---

**¡Sistema listo para usar! 🚀**

*Desarrollado con ❤️ para IPT - Instituto Politécnico de Tucumán*
