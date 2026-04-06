@echo off
setlocal DisableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%..\"
set "ENV_FILE=%ROOT_DIR%.env"
set "PUBLISH_ARGS="

if /i "%~1"=="--dry-run" (
    set "PUBLISH_ARGS=--dry-run"
)

if not exist "%ENV_FILE%" (
    echo [publish-create-ui-app] Missing .env file at "%ENV_FILE%".
    exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in (`findstr /r /v "^[ ]*# ^[ ]*$" "%ENV_FILE%"`) do (
    set "%%A=%%B"
)

if "%GH_TOKEN%"=="" (
    echo [publish-create-ui-app] GH_TOKEN is not set in .env.
    exit /b 1
)

pushd "%SCRIPT_DIR%"

echo [publish-create-ui-app] Verifying GitHub Packages authentication...
call npm whoami --registry=https://npm.pkg.github.com >nul
if errorlevel 1 (
    echo [publish-create-ui-app] Authentication failed. Check GH_TOKEN scopes and value in .env.
    popd
    exit /b 1
)

echo [publish-create-ui-app] Publishing package...
call npm publish %PUBLISH_ARGS%
set "EXIT_CODE=%ERRORLEVEL%"

popd
exit /b %EXIT_CODE%