@echo off
cd /d %~dp0
node dist\index.js > debug.log 2>&1
