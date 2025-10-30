@echo off
chcp 65001 >nul
REM ========================================
REM Detener - Sistema Biblioteca IPT
REM ========================================
REM Este script detiene todos los contenedores del sistema

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
echo %BLUE%   Detener Sistema%RESET%
echo %BLUE%========================================%RESET%
echo.

REM Verificar si Docker Desktop está corriendo
echo %YELLOW%⏳ Verificando Docker Desktop...%RESET%
docker info >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ ERROR: Docker Desktop no está corriendo%RESET%
    echo.
    echo %YELLOW%Nota:%RESET% Si los contenedores ya estaban detenidos, no hay problema.
    echo.
    pause
    exit /b 0
)
echo %GREEN%✓ Docker Desktop está corriendo%RESET%
echo.

REM Detener contenedores
echo %YELLOW%⏳ Deteniendo contenedores...%RESET%
docker-compose down
if errorlevel 1 (
    echo.
    echo %RED%❌ ERROR: Fallo al detener los contenedores%RESET%
    echo.
    pause
    exit /b 1
)
echo %GREEN%✓ Contenedores detenidos%RESET%
echo.

echo %GREEN%========================================%RESET%
echo %GREEN%   ✓ SISTEMA DETENIDO%RESET%
echo %GREEN%========================================%RESET%
echo.
echo %BLUE%📌 Información:%RESET%
echo.
echo   • Los datos de la base de datos están seguros
echo   • Para volver a iniciar: %GREEN%iniciar.bat%RESET%
echo   • Los backups están en la carpeta: %YELLOW%backups/%RESET%
echo.
echo %YELLOW%Nota:%RESET% Los contenedores están detenidos pero las imágenes
echo y volúmenes permanecen en tu sistema.
echo.

echo Presiona cualquier tecla para salir...
pause >nul
