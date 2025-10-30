@echo off
REM Script para eliminar archivos Docker del repo original
echo Eliminando archivos de Docker...

del .dockerignore
del CLAUDE.md
del DOCKER-RESUMEN.md
del DOCKER-SETUP.md
del INSTALACION-USUARIO-FINAL.md
del README-DOCKER.md
del detener.bat
del docker-compose.yml
del .env.docker
del estado.bat
del iniciar.bat
del instalar.bat
del limpiar.bat
del ver-logs.bat

del frontend\.dockerignore
del frontend\Dockerfile
del frontend\nginx.conf

echo.
echo Archivos Docker eliminados.
echo Ahora ejecuta: git status
pause
