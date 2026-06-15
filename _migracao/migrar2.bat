@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   MIGRACAO COMPLETA: Blob "AnorDB" (112 arquivos)  -^>  R2
echo ============================================================
echo.
echo [1/2] Conferindo dependencias...
call npm install
echo.
echo [2/2] Migrando os 112 arquivos (tem um video de 73 MB,
echo        entao essa etapa pode demorar alguns minutos)...
echo.
node --env-file=.env migrar2.mjs
echo.
echo ============================================================
echo   TERMINOU. Tire um print desta janela e me mande no chat.
echo ============================================================
pause
