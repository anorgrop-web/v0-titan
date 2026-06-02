@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   MIGRACAO DAS MIDIAS: Vercel Blob  -^>  Cloudflare R2
echo ============================================================
echo.
echo [1/2] Instalando o necessario (pode demorar na primeira vez)...
call npm install
echo.
echo [2/2] Migrando os arquivos...
echo.
node --env-file=.env migrar.mjs
echo.
echo ============================================================
echo   TERMINOU. Tire um print desta janela e me mande no chat.
echo ============================================================
pause
