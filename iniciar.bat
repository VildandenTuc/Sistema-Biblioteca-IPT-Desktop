@echo off
chcp 65001 >nul
REM ========================================
REM Iniciar - Sistema Biblioteca IPT
REM ========================================
REM Este script inicia el sistema completo

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
echo %BLUE%   Iniciando Sistema%RESET%
echo %BLUE%========================================%RESET%
echo.

REM Verificar si Docker Desktop está corriendo
echo %YELLOW%⏳ Verificando Docker Desktop...%RESET%
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

REM Verificar si .env existe
if not exist .env (
    echo %RED%❌ ERROR: Archivo .env no encontrado%RESET%
    echo.
    echo Por favor ejecuta primero %YELLOW%instalar.bat%RESET%
    echo.
    pause
    exit /b 1
)

REM Iniciar contenedores
echo %YELLOW%⏳ Iniciando contenedores...%RESET%
docker-compose up -d
if errorlevel 1 (
    echo.
    echo %RED%❌ ERROR: Fallo al iniciar los contenedores%RESET%
    echo.
    echo Posibles soluciones:
    echo 1. Ejecuta %YELLOW%instalar.bat%RESET% si es la primera vez
    echo 2. Ejecuta %YELLOW%detener.bat%RESET% y luego intenta nuevamente
    echo 3. Ejecuta %YELLOW%ver-logs.bat%RESET% para ver detalles del error
    echo.
    pause
    exit /b 1
)
echo %GREEN%✓ Contenedores iniciados%RESET%
echo.

REM Esperar a que los servicios estén listos
echo %YELLOW%⏳ Esperando a que los servicios estén listos...%RESET%
echo %YELLOW%   Esto puede tardar 30-60 segundos...%RESET%
timeout /t 30 /nobreak >nul

REM Verificar estado
echo.
echo %YELLOW%Estado de los servicios:%RESET%
docker-compose ps
echo.

echo %GREEN%========================================%RESET%
echo %GREEN%   ✓ SISTEMA INICIADO%RESET%
echo %GREEN%========================================%RESET%
echo.
echo %BLUE%📌 Accede al sistema en:%RESET% %GREEN%http://localhost:3000%RESET%
echo.
echo %BLUE%📌 Credenciales de administrador:%RESET%
echo   - Email: %YELLOW%admin@biblioteca.com%RESET%
echo   - Password: %YELLOW%admin123%RESET%
echo.
echo %BLUE%📌 Comandos útiles:%RESET%
echo   • Detener sistema: %RED%detener.bat%RESET%
echo   • Ver logs: %BLUE%ver-logs.bat%RESET%
echo.

REM Abrir navegador automáticamente
echo %YELLOW%⏳ Abriendo navegador...%RESET%
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Presiona cualquier tecla para salir...
pause >nul
