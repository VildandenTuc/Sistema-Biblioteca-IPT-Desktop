@echo off
chcp 65001 >nul
REM ========================================
REM Instalador - Sistema Biblioteca IPT
REM ========================================
REM Este script realiza la instalación inicial del sistema

setlocal enabledelayedexpansion

REM Colores para consola
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

cls
echo.
echo %BLUE%========================================%RESET%
echo %BLUE%   SISTEMA DE BIBLIOTECA IPT%RESET%
echo %BLUE%   Instalación Inicial%RESET%
echo %BLUE%========================================%RESET%
echo.

REM Verificar si Docker Desktop está instalado
echo %YELLOW%[1/7] Verificando Docker Desktop...%RESET%
docker --version >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ ERROR: Docker Desktop no está instalado%RESET%
    echo.
    echo Por favor instala Docker Desktop desde:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)
echo %GREEN%✓ Docker Desktop encontrado%RESET%
echo.

REM Verificar si Docker Desktop está corriendo
echo %YELLOW%[2/7] Verificando que Docker Desktop esté corriendo...%RESET%
docker info >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ ERROR: Docker Desktop no está corriendo%RESET%
    echo.
    echo Por favor inicia Docker Desktop y espera a que esté listo.
    echo Luego ejecuta este script nuevamente.
    echo.
    pause
    exit /b 1
)
echo %GREEN%✓ Docker Desktop está corriendo%RESET%
echo.

REM Copiar archivo de configuración
echo %YELLOW%[3/7] Configurando variables de entorno...%RESET%
if not exist .env (
    copy .env.docker .env >nul
    echo %GREEN%✓ Archivo .env creado%RESET%
) else (
    echo %YELLOW%⚠ Archivo .env ya existe, no se sobrescribe%RESET%
)
echo.

REM Crear carpeta de backups
echo %YELLOW%[4/7] Creando carpeta de backups...%RESET%
if not exist backups (
    mkdir backups
    echo %GREEN%✓ Carpeta backups creada%RESET%
) else (
    echo %YELLOW%⚠ Carpeta backups ya existe%RESET%
)
echo.

REM Detener contenedores existentes si los hay
echo %YELLOW%[5/7] Limpiando instalación anterior (si existe)...%RESET%
docker-compose down >nul 2>&1
echo %GREEN%✓ Limpieza completada%RESET%
echo.

REM Construir imágenes Docker
echo %YELLOW%[6/7] Construyendo imágenes Docker...%RESET%
echo %YELLOW%⏳ Este proceso puede tardar 5-10 minutos...%RESET%
echo.
docker-compose build
if errorlevel 1 (
    echo.
    echo %RED%❌ ERROR: Fallo al construir las imágenes%RESET%
    echo.
    echo Revisa los errores arriba y ejecuta nuevamente.
    echo.
    pause
    exit /b 1
)
echo.
echo %GREEN%✓ Imágenes construidas exitosamente%RESET%
echo.

REM Iniciar contenedores
echo %YELLOW%[7/7] Iniciando contenedores...%RESET%
echo %YELLOW%⏳ Espera mientras se inicia el sistema...%RESET%
echo.
docker-compose up -d
if errorlevel 1 (
    echo.
    echo %RED%❌ ERROR: Fallo al iniciar los contenedores%RESET%
    echo.
    pause
    exit /b 1
)
echo.
echo %GREEN%✓ Contenedores iniciados%RESET%
echo.

REM Esperar a que los servicios estén listos
echo %YELLOW%⏳ Esperando a que los servicios estén listos...%RESET%
echo %YELLOW%   Esto puede tardar hasta 2 minutos...%RESET%
timeout /t 60 /nobreak >nul

REM Verificar estado de los contenedores
echo.
echo %YELLOW%Verificando estado de los servicios...%RESET%
docker-compose ps

echo.
echo %GREEN%========================================%RESET%
echo %GREEN%   ✓ INSTALACIÓN COMPLETADA%RESET%
echo %GREEN%========================================%RESET%
echo.
echo %BLUE%📌 Información importante:%RESET%
echo.
echo   • Accede al sistema en: %GREEN%http://localhost:3000%RESET%
echo   • Credenciales de administrador:
echo     - Email: %YELLOW%admin@biblioteca.com%RESET%
echo     - Password: %YELLOW%admin123%RESET%
echo.
echo   • Para iniciar el sistema: %GREEN%iniciar.bat%RESET%
echo   • Para detener el sistema: %RED%detener.bat%RESET%
echo   • Para ver logs: %BLUE%ver-logs.bat%RESET%
echo.
echo %YELLOW%⚠ IMPORTANTE:%RESET% Cambia la contraseña del admin después del primer login
echo.
echo %BLUE%¿Quieres abrir el sistema en el navegador ahora?%RESET%
echo.
set /p "respuesta=Presiona S para abrir o cualquier otra tecla para salir: "
if /i "%respuesta%"=="s" (
    start http://localhost:3000
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul
