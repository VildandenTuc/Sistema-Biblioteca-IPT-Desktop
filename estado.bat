@echo off
chcp 65001 >nul
REM ========================================
REM Estado - Sistema Biblioteca IPT
REM ========================================
REM Este script muestra el estado del sistema

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
echo %BLUE%   Estado del Sistema%RESET%
echo %BLUE%========================================%RESET%
echo.

REM Verificar si Docker Desktop está corriendo
echo %YELLOW%📊 Verificando Docker Desktop...%RESET%
docker info >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Docker Desktop no está corriendo%RESET%
    echo.
    pause
    exit /b 1
)
echo %GREEN%✓ Docker Desktop está corriendo%RESET%
echo.

REM Estado de contenedores
echo %YELLOW%📦 Estado de Contenedores:%RESET%
echo.
docker-compose ps
echo.

REM Uso de recursos
echo %YELLOW%💻 Uso de Recursos:%RESET%
echo.
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" biblioteca-mysql biblioteca-backend biblioteca-frontend 2>nul
echo.

REM Volúmenes
echo %YELLOW%💾 Volúmenes de Datos:%RESET%
echo.
docker volume ls | findstr biblioteca
echo.

REM URLs de acceso
echo %BLUE%========================================%RESET%
echo %BLUE%   📌 URLs de Acceso%RESET%
echo %BLUE%========================================%RESET%
echo.
echo   • Interfaz Web: %GREEN%http://localhost:3000%RESET%
echo   • API Backend: %GREEN%http://localhost:8080%RESET%
echo   • Base de Datos: %GREEN%localhost:3306%RESET%
echo.

REM Verificar si los servicios responden
echo %YELLOW%🔍 Verificando servicios...%RESET%
echo.

REM Verificar frontend
curl -s -o nul -w "Frontend: %%{http_code}\n" http://localhost:3000 2>nul
if errorlevel 1 (
    echo   • Frontend: %RED%No responde%RESET%
) else (
    echo   • Frontend: %GREEN%OK%RESET%
)

REM Verificar backend
curl -s -o nul -w "Backend: %%{http_code}\n" http://localhost:8080/actuator/health 2>nul
if errorlevel 1 (
    echo   • Backend: %RED%No responde%RESET%
) else (
    echo   • Backend: %GREEN%OK%RESET%
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul
