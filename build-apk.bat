@echo off
echo.
echo =================================================
echo   Bubblewrap init for ScootyKik
echo =================================================
echo.

set ANSWERS=https://scootykik.vercel.app/manifest.json

echo Running bubblewrap init in non-interactive mode...
npx -y @bubblewrap/cli init ^
  --manifest=https://scootykik.vercel.app/manifest.json ^
  --directory="%~dp0\ScootyKik-apk"

echo.
echo Done! Now building APK...
cd /d "%~dp0\ScootyKik-apk"
npx @bubblewrap/cli build
