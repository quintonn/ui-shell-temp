@echo off
setlocal DisableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "ENV_FILE=%SCRIPT_DIR%.env"
set "PUBLISH_ARGS="

if /i "%~1"=="--dry-run" (
    set "PUBLISH_ARGS=--dry-run"
)

if not exist "%ENV_FILE%" (
    echo [publish-package] Missing .env file at "%ENV_FILE%".
    exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in (`findstr /r /v /c:"^[ ]*#" /c:"^[ ]*$" "%ENV_FILE%"`) do (
    set "%%A=%%B"
)

if "%GH_TOKEN%"=="" (
    echo [publish-package] GH_TOKEN is not set in .env.
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [publish-package] npm was not found on PATH.
    exit /b 1
)

pushd "%SCRIPT_DIR%"

echo [publish-package] Building package...
call npm run build
if errorlevel 1 (
    popd
    exit /b 1
)

echo [publish-package] Verifying GitHub Packages authentication...
call npm whoami --registry=https://npm.pkg.github.com >nul
if errorlevel 1 (
    echo [publish-package] Authentication failed. Check GH_TOKEN scopes and value in .env.
    popd
    exit /b 1
)

echo [publish-package] Publishing package...
call npm publish %PUBLISH_ARGS%
set "EXIT_CODE=%ERRORLEVEL%"

popd
exit /b %EXIT_CODE%