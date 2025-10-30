@echo off
chcp 65001 >nul
REM ========================================
REM Ver Logs - Sistema Biblioteca IPT
REM ========================================
REM Este script muestra los logs de todos los contenedores

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
echo %BLUE%   Logs del Sistema%RESET%
echo %BLUE%========================================%RESET%
echo.

REM Verificar si Docker Desktop está corriendo
docker info >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ ERROR: Docker Desktop no está corriendo%RESET%
    echo.
    pause
    exit /b 1
)

echo %YELLOW%📋 Mostrando logs en tiempo real...%RESET%
echo %YELLOW%   Presiona Ctrl+C para salir%RESET%
echo.
echo %BLUE%Leyenda de contenedores:%RESET%
echo   • %GREEN%biblioteca-mysql%RESET% = Base de datos
echo   • %GREEN%biblioteca-backend%RESET% = API (Spring Boot)
echo   • %GREEN%biblioteca-frontend%RESET% = Interfaz web (React)
echo.
timeout /t 3 /nobreak >nul

REM Mostrar logs en tiempo real
docker-compose logs -f --tail=100

echo.
echo Presiona cualquier tecla para salir...
pause >nul
