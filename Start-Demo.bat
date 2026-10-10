@echo off
title SthreeCreatives Demo Server
cd /d "%~dp0"
echo Starting SthreeCreatives demo on http://localhost:8090 ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
