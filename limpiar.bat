@echo off
chcp 65001 >nul
REM ========================================
REM Limpiar - Sistema Biblioteca IPT
REM ========================================
REM Este script limpia contenedores, imágenes y volúmenes
REM ⚠️ PRECAUCIÓN: ESTO BORRARÁ TODOS LOS DATOS

setlocal enabledelayedexpansion

REM Colores para consola
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

cls
echo.
echo %RED%========================================%RESET%
echo %RED%   ⚠️  ADVERTENCIA ⚠️%RESET%
echo %RED%========================================%RESET%
echo.
echo %YELLOW%Este script realizará una limpieza COMPLETA:%RESET%
echo.
echo   • Detendrá todos los contenedores
echo   • Eliminará los contenedores
echo   • Eliminará las imágenes Docker
echo   • %RED%ELIMINARÁ TODOS LOS DATOS DE LA BASE DE DATOS%RESET%
echo.
echo %RED%⚠️  ESTO NO SE PUEDE DESHACER ⚠️%RESET%
echo.
echo %YELLOW%Asegúrate de tener un backup antes de continuar.%RESET%
echo.
set /p "confirmar=¿Estás seguro? Escribe SI en mayúsculas para continuar: "

if not "%confirmar%"=="SI" (
    echo.
    echo %YELLOW%Operación cancelada.%RESET%
    echo.
    pause
    exit /b 0
)

echo.
echo %YELLOW%Segunda confirmación: ¿REALMENTE quieres borrar TODOS los datos?%RESET%
set /p "confirmar2=Escribe BORRAR en mayúsculas para continuar: "

if not "%confirmar2%"=="BORRAR" (
    echo.
    echo %YELLOW%Operación cancelada.%RESET%
    echo.
    pause
    exit /b 0
)

echo.
echo %RED%⏳ Iniciando limpieza completa...%RESET%
echo.

REM Detener y eliminar contenedores
echo %YELLOW%[1/3] Deteniendo y eliminando contenedores...%RESET%
docker-compose down -v
echo %GREEN%✓ Contenedores eliminados%RESET%
echo.

REM Eliminar imágenes
echo %YELLOW%[2/3] Eliminando imágenes Docker...%RESET%
docker rmi biblioteca-backend biblioteca-frontend 2>nul
echo %GREEN%✓ Imágenes eliminadas%RESET%
echo.

REM Eliminar volúmenes huérfanos
echo %YELLOW%[3/3] Limpiando volúmenes huérfanos...%RESET%
docker volume prune -f >nul
echo %GREEN%✓ Volúmenes limpiados%RESET%
echo.

echo %GREEN%========================================%RESET%
echo %GREEN%   ✓ LIMPIEZA COMPLETADA%RESET%
echo %GREEN%========================================%RESET%
echo.
echo %YELLOW%Próximos pasos:%RESET%
echo.
echo   1. Ejecuta %GREEN%instalar.bat%RESET% para reinstalar el sistema
echo   2. O elimina la carpeta completa si no vas a usar más el sistema
echo.

echo Presiona cualquier tecla para salir...
pause >nul
