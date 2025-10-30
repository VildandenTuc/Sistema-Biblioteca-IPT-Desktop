# 🚀 Instalación para Usuario Final - Sistema Biblioteca IPT

## 📦 ¿Qué es esta aplicación?

Sistema completo de gestión de biblioteca que funciona en tu computadora sin necesidad de instalaciones complejas. Todo viene incluido: base de datos, servidor y aplicación web.

---

## ✅ Requisitos Mínimos

- **Sistema Operativo**: Windows 10 o Windows 11 (64 bits)
- **RAM**: 4 GB (recomendado 8 GB)
- **Espacio en disco**: 10 GB libres
- **Procesador**: Dual Core o superior
- **Conexión a Internet**: Solo para la instalación inicial

---

## 📥 Paso 1: Instalar Docker Desktop

### ¿Qué es Docker Desktop?

Docker Desktop es un programa que permite ejecutar aplicaciones en "contenedores" (como máquinas virtuales ligeras). Es **necesario** para que el Sistema Biblioteca funcione.

### Descarga e Instalación

1. **Descarga Docker Desktop**:
   - Ve a: https://www.docker.com/products/docker-desktop
   - Click en "Download for Windows"
   - Espera a que descargue (~500 MB)

2. **Instala Docker Desktop**:
   - Ejecuta el archivo descargado `Docker Desktop Installer.exe`
   - Acepta los términos y condiciones
   - Marca "Use WSL 2 instead of Hyper-V" (recomendado)
   - Click en "Ok" y espera a que instale (5-10 minutos)
   - Reinicia tu computadora cuando te lo pida

3. **Primera ejecución de Docker Desktop**:
   - Abre Docker Desktop desde el menú de Windows
   - Acepta el acuerdo de servicio
   - Puedes saltarte el tutorial (Skip tutorial)
   - Espera a que diga "Docker Desktop is running" (esquina inferior izquierda)
   - Verás el ícono de Docker en la bandeja del sistema (cerca del reloj)

### Verificar que Docker funciona

1. Abre el símbolo del sistema (CMD):
   - Presiona `Windows + R`
   - Escribe `cmd` y presiona Enter

2. Ejecuta este comando:
   ```
   docker --version
   ```

3. Si ves algo como `Docker version 24.0.6`, ¡Docker está instalado correctamente!

---

## 📥 Paso 2: Instalar el Sistema Biblioteca

### Descomprimir la Aplicación

1. **Descarga el archivo** `Sistema-Biblioteca-IPT.zip`
2. **Click derecho** sobre el archivo → **Extraer todo...**
3. Elige una ubicación fácil de encontrar, por ejemplo:
   - `C:\Biblioteca\`
   - O en tu Escritorio
4. **Importante**: Recuerda dónde la guardaste

### Ejecutar la Instalación

1. **Abre la carpeta** donde descomprimiste el sistema
2. **Busca el archivo** `instalar.bat` (tiene un ícono de engranaje)
3. **Doble click** en `instalar.bat`
4. Se abrirá una ventana negra (consola)

### Proceso de Instalación

La instalación tardará **5-10 minutos** la primera vez. Verás lo siguiente:

```
========================================
   SISTEMA DE BIBLIOTECA IPT
   Instalación Inicial
========================================

[1/7] ✓ Docker Desktop encontrado
[2/7] ✓ Docker Desktop está corriendo
[3/7] ✓ Archivo .env creado
[4/7] ✓ Carpeta backups creada
[5/7] ✓ Limpieza completada
[6/7] ⏳ Construyendo imágenes Docker...
       Este proceso puede tardar 5-10 minutos...
```

**IMPORTANTE**:
- NO cierres la ventana mientras dice "Construyendo imágenes"
- Es normal que tarde varios minutos
- Verás muchos mensajes en inglés (es normal)

### Instalación Exitosa

Cuando veas esto, ¡la instalación fue exitosa!:

```
========================================
   ✓ INSTALACIÓN COMPLETADA
========================================

📌 Información importante:

  • Accede al sistema en: http://localhost:3000
  • Credenciales de administrador:
    - Email: admin@biblioteca.com
    - Password: admin123

¿Quieres abrir el sistema en el navegador ahora?
Presiona S para abrir o cualquier otra tecla para salir:
```

Presiona **S** y Enter para abrir el sistema automáticamente.

---

## 🎮 Paso 3: Usar el Sistema

### Primer Acceso

1. **Abre tu navegador** (Chrome, Firefox, Edge)
2. **Ve a**: http://localhost:3000
3. **Ingresa tus credenciales**:
   - Email: `admin@biblioteca.com`
   - Password: `admin123`
4. **¡IMPORTANTE!** La primera vez, el sistema te pedirá cambiar la contraseña
5. **Elige una contraseña segura** y guárdala en un lugar seguro

### Explorar el Sistema

Una vez dentro, verás el **Dashboard** con:
- Estadísticas de libros, usuarios y préstamos
- Menú de navegación en la parte superior
- Módulos disponibles según tu rol

**Módulos principales (Administrador)**:
- 📚 **Libros**: Agregar, editar, buscar libros
- 👥 **Usuarios**: Gestionar usuarios del sistema
- 📖 **Préstamos**: Registrar préstamos y devoluciones
- 📊 **Reportes**: Generar reportes y estadísticas
- 💾 **Backup**: Respaldar la base de datos

---

## 🔄 Uso Diario

### Iniciar el Sistema

**Cada vez que quieras usar el sistema:**

1. **Asegúrate de que Docker Desktop esté abierto**
   - Busca el ícono de Docker en la bandeja del sistema
   - Si no está, abre Docker Desktop desde el menú de Windows

2. **Ve a la carpeta** del Sistema Biblioteca

3. **Doble click** en `iniciar.bat`

4. Espera 30-60 segundos

5. El navegador se abrirá automáticamente en http://localhost:3000

### Detener el Sistema

**Cuando termines de usar el sistema:**

1. **Cierra el navegador** (opcional)

2. **Ve a la carpeta** del Sistema Biblioteca

3. **Doble click** en `detener.bat`

4. Espera a que diga "Sistema detenido"

**IMPORTANTE**:
- Tus datos NO se borran al detener el sistema
- La próxima vez que inicies, todo estará como lo dejaste
- Es recomendable detener el sistema cuando no lo uses para liberar recursos

---

## 💾 Hacer Backups

### ¿Por qué hacer backups?

Los backups son copias de seguridad de tu base de datos. Te protegen contra:
- Pérdida accidental de datos
- Errores al editar información
- Problemas con la computadora

### Cómo hacer un backup

**Desde la aplicación** (Recomendado):

1. **Inicia el sistema** con `iniciar.bat`
2. **Ingresa como administrador**
3. **Ve al menú** "Backup de Base de Datos"
4. **Click en** "Generar Backup"
5. El archivo `.sql` se descargará automáticamente
6. **Guarda el archivo** en un lugar seguro (USB, Google Drive, etc.)

**Backup completo** (toda la aplicación):

1. **Detén el sistema** con `detener.bat`
2. **Copia toda la carpeta** `Sistema-Biblioteca-IPT`
3. **Pégala** en otro lugar (USB, disco externo, nube)
4. **Fecha el backup**: Ejemplo: `Biblioteca-IPT-Backup-2024-10-30`

### Restaurar un backup

1. **Inicia el sistema** con `iniciar.bat`
2. **Ingresa como administrador**
3. **Ve al menú** "Backup de Base de Datos"
4. **Click en** "Restaurar Backup"
5. **Selecciona** el archivo `.sql` que guardaste
6. **Confirma** la restauración
7. ⚠️ **CUIDADO**: Esto reemplazará todos los datos actuales

---

## ❓ Preguntas Frecuentes

### ¿Necesito Internet para usar el sistema?

**NO**. Solo necesitas Internet para:
- Instalar Docker Desktop (una sola vez)
- Instalar el Sistema Biblioteca (primera vez)

Después de instalado, el sistema funciona **completamente offline**.

### ¿Los datos se guardan en la nube?

**NO**. Todo se guarda en tu computadora. Tus datos son **100% privados**.

### ¿Puedo usar el sistema en varias computadoras?

**SÍ**, pero necesitas:
1. Instalar Docker Desktop en cada computadora
2. Copiar la carpeta completa del Sistema Biblioteca
3. Cada instalación tendrá su propia base de datos independiente

Para compartir datos entre computadoras, usa los backups.

### ¿Qué pasa si reinicio mi computadora?

**Nada grave**. Solo necesitas:
1. Abrir Docker Desktop
2. Ejecutar `iniciar.bat` nuevamente
3. Tus datos estarán intactos

### ¿Cuánto espacio ocupa?

- **Instalación inicial**: ~1 GB (imágenes Docker)
- **Base de datos**: Crece según cuántos datos guardes
- **Backups**: Cada backup ocupa ~5-50 MB

### ¿Puedo desinstalar el sistema?

**SÍ**. Para desinstalar:

1. Ejecuta `limpiar.bat` (⚠️ esto borra los datos)
2. Elimina la carpeta `Sistema-Biblioteca-IPT`
3. (Opcional) Desinstala Docker Desktop desde Panel de Control

**IMPORTANTE**: Antes de desinstalar, haz un backup si quieres conservar los datos.

### Olvidé mi contraseña de administrador

Ver la guía completa en `DOCKER-SETUP.md` sección "Problema 5: Olvidé la contraseña del administrador".

### El sistema no inicia / da error

1. **Verifica que Docker Desktop esté corriendo**
2. **Ejecuta** `ver-logs.bat` para ver el error
3. **Ejecuta** `estado.bat` para ver el estado del sistema
4. Consulta la guía completa en `DOCKER-SETUP.md`

---

## 📞 Soporte Técnico

### Guías Disponibles

- **INSTALACION-USUARIO-FINAL.md** (este archivo) - Guía básica
- **DOCKER-SETUP.md** - Guía completa técnica
- **README-DOCKER.md** - Referencia rápida

### Herramientas de Diagnóstico

| Archivo | Para qué sirve |
|---------|----------------|
| `estado.bat` | Ver si el sistema está corriendo |
| `ver-logs.bat` | Ver errores detallados |
| `iniciar.bat` | Iniciar el sistema |
| `detener.bat` | Detener el sistema |
| `limpiar.bat` | Borrar todo y empezar de cero (⚠️ borra datos) |

---

## ✅ Checklist de Instalación

- [ ] Instalé Docker Desktop
- [ ] Docker Desktop está corriendo (ícono en bandeja)
- [ ] Descomprimí `Sistema-Biblioteca-IPT.zip`
- [ ] Ejecuté `instalar.bat`
- [ ] Esperé 5-10 minutos a que termine
- [ ] Vi el mensaje "INSTALACIÓN COMPLETADA"
- [ ] Abrí http://localhost:3000 en el navegador
- [ ] Hice login con admin@biblioteca.com / admin123
- [ ] Cambié la contraseña del administrador
- [ ] Probé crear un libro de prueba
- [ ] Hice un backup de prueba

**Si completaste todos los pasos, ¡felicitaciones! 🎉**

---

## 🎯 Resumen de Archivos

📁 **Carpeta del Sistema**:
```
Sistema-Biblioteca-IPT/
├── 🟢 instalar.bat          ← Ejecuta esto PRIMERO (una sola vez)
├── 🟢 iniciar.bat           ← Ejecuta esto para USAR el sistema
├── 🔴 detener.bat           ← Ejecuta esto para CERRAR el sistema
├── 📋 ver-logs.bat          ← Ver errores
├── 📊 estado.bat            ← Ver estado del sistema
├── 🗑️ limpiar.bat          ← Borrar todo (⚠️ precaución)
├── 📖 INSTALACION-USUARIO-FINAL.md  ← Esta guía
├── 📖 DOCKER-SETUP.md       ← Guía técnica completa
├── 📖 README-DOCKER.md      ← Referencia rápida
└── 📁 backups/              ← Aquí se guardan los backups
```

---

**¡Que disfrutes del Sistema de Gestión de Biblioteca IPT! 📚**

*Desarrollado para Instituto Politécnico de Tucumán*
