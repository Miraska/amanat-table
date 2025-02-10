<#
    build.ps1 — Условная версия Makefile для Windows (PowerShell).
    ----------------------------------------------------------------------------
    Пример использования:
      .\build.ps1 sqlite.mode
      .\build.ps1 postgres.mode
      .\build.ps1 docker.up teable-postgres
      .\build.ps1 docker.await teable-postgres
      .\build.ps1 switch-db-mode
      .\build.ps1 help
#>

Param(
    # Основная команда, аналог "make <command>"
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Action,

    # Остальные аргументы (названия сервисов, etc.)
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

# ----------------------------------------------------------------------------
# ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (по аналогии с Makefile)
# ----------------------------------------------------------------------------

if (-not $env:ENV_PATH) { $env:ENV_PATH = "./apps/nextjs-app" }
if (-not $env:DOCKER_COMPOSE) { $env:DOCKER_COMPOSE = "docker compose" }
if (-not $env:NETWORK_MODE) { $env:NETWORK_MODE = "teablenet" }
if (-not $env:CI_JOB_ID) { $env:CI_JOB_ID = "0" }
if (-not $env:CI) { $env:CI = "0" }
if (-not $env:TIMEOUT) { $env:TIMEOUT = "300" }

# Значения по умолчанию для prisma
if (-not $env:SQLITE_PRISMA_DATABASE_URL) {
    $env:SQLITE_PRISMA_DATABASE_URL = "file:../../db/main.db"
}
if (-not $env:POSTGES_PRISMA_DATABASE_URL) {
    $env:POSTGES_PRISMA_DATABASE_URL = "postgresql://teable:teable@127.0.0.1:5432/teable?schema=public&statement_cache_size=1"
}

# Если в CI, модифицируем имя сети
if ($env:CI_JOB_ID -and $env:CI_JOB_ID -ne "0") {
    $env:NETWORK_MODE = "$($env:NETWORK_MODE)-$($env:CI_JOB_ID)"
}

# Цвета для удобства вывода
$Colors = @{
    "RESET"       = "White"
    "RED"         = "Red"
    "GREEN"       = "Green"
    "YELLOW"      = "Yellow"
    "BLUE"        = "Blue"
    "PURPLE"      = "Magenta"
    "LIGHTPURPLE" = "Cyan"
}

function Info($text, $color="White") {
    Write-Host $text -ForegroundColor $color
}
function Warn($text) {
    Write-Host $text -ForegroundColor $($Colors.YELLOW)
}
function ErrorMsg($text) {
    Write-Host $text -ForegroundColor $($Colors.RED)
}
function SuccessMsg($text) {
    Write-Host $text -ForegroundColor $($Colors.GREEN)
}

# ----------------------------------------------------------------------------
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ DOCKER
# ----------------------------------------------------------------------------

function Docker-CreateNetwork {
    if ($env:NETWORK_MODE -ne "host") {
        $exists = docker network inspect $env:NETWORK_MODE -ErrorAction SilentlyContinue
        if (-not $exists) {
            docker network create $env:NETWORK_MODE | Out-Null
            SuccessMsg "Network '$($env:NETWORK_MODE)' created."
        }
    }
}

function Docker-RmNetwork {
    if ($env:NETWORK_MODE -ne "host") {
        $exists = docker network inspect $env:NETWORK_MODE -ErrorAction SilentlyContinue
        if ($exists) {
            docker network rm $env:NETWORK_MODE | Out-Null
            Warn "Network '$($env:NETWORK_MODE)' removed."
        }
    }
}

function Get-ComposeArgs {
    # Находим все *.yml в ./dockers
    $composeFiles = Get-ChildItem -Path "./dockers" -Filter "*.yml" -File | ForEach-Object { "-f `"$($_.FullName)`"" }
    # Если есть .env в ./dockers/.env
    $composeEnv = ""
    if (Test-Path "./dockers/.env") {
        $composeEnv = "--env-file `".\dockers\.env`""
    }
    return $composeEnv + " " + ($composeFiles -join " ")
}

function Docker-Up([string[]]$services) {
    Docker-CreateNetwork
    $args = Get-ComposeArgs
    $cmd = "$($env:DOCKER_COMPOSE) $args up --no-recreate -d $($services -join ' ')"
    Info ">>> $cmd" $Colors.BLUE
    iex $cmd
}

function Docker-Down {
    Docker-RmNetwork
    $args = Get-ComposeArgs
    $cmd = "$($env:DOCKER_COMPOSE) $args down"
    Info ">>> $cmd" $Colors.BLUE
    iex $cmd
}

function Docker-Start([string[]]$services) {
    $args = Get-ComposeArgs
    $cmd = "$($env:DOCKER_COMPOSE) $args start $($services -join ' ')"
    Info ">>> $cmd" $Colors.BLUE
    iex $cmd
}

function Docker-Stop([string[]]$services) {
    $args = Get-ComposeArgs
    $cmd = "$($env:DOCKER_COMPOSE) $args stop $($services -join ' ')"
    Info ">>> $cmd" $Colors.BLUE
    iex $cmd
}

function Docker-Restart([string[]]$services) {
    Docker-Stop $services
    Docker-Start $services
}

function Docker-Run([string[]]$runArgs) {
    # 1-й арг — сервис, остальные – аргументы
    if ($runArgs.Count -gt 0) {
        $service = $runArgs[0]
        $serviceArgs = $runArgs[1..($runArgs.Count - 1)]
    } else {
        $service = ""
        $serviceArgs = @()
    }
    Docker-CreateNetwork
    $args = Get-ComposeArgs
    $joinedArgs = $serviceArgs -join " "
    $cmd = "$($env:DOCKER_COMPOSE) $args run -T --no-deps --rm $service $joinedArgs"
    Info ">>> $cmd" $Colors.BLUE
    iex $cmd
}

function Docker-Await([string[]]$services) {
    $timeout = [int]$env:TIMEOUT
    foreach ($service in $services) {
        $containerId = (& $env:DOCKER_COMPOSE $(Get-ComposeArgs) ps -q $service) 2>$null
        if (-not $containerId) {
            continue
        }
        # Проверка Health
        $health = docker inspect -f '{{.State.Health.Status}}' $containerId 2>$null
        if (-not $health) {
            continue
        }
        $time = 0
        while ($true) {
            $health = docker inspect -f '{{.State.Health.Status}}' $containerId 2>$null
            if ($health -eq "healthy") {
                SuccessMsg "Service '$service' is healthy"
                break
            }
            Start-Sleep 1
            $time++
            if ($time -gt $timeout) {
                Warn "Timeout ($timeout s) waiting for '$service' to be healthy"
                docker logs $service
                exit 1
            }
        }
    }
}

# ----------------------------------------------------------------------------
# ФУНКЦИИ ДЛЯ SQLITE / POSTGRES MIGRATIONS
# ----------------------------------------------------------------------------

function Activate-SqliteMode {
    Info "Activating sqlite.mode" $Colors.BLUE

    # Переопределяем переменную окружения для SQLite,
    # чтобы точно было "file:..." и избежать ошибки P1012.
    $env:PRISMA_DATABASE_URL = $env:SQLITE_PRISMA_DATABASE_URL

    Push-Location .\packages\db-main-prisma

    # Предполагается, что package.json в этой папке содержит:
    #   "scripts": {
    #     "prisma-generate": "prisma generate",
    #     "prisma-migrate": "prisma migrate"
    #   }
    # Тогда:
    pnpm prisma-generate --schema .\prisma\sqlite\schema.prisma
    pnpm prisma-migrate deploy --schema .\prisma\sqlite\schema.prisma

    # Если таких скриптов нет, замените на:
    # pnpm exec prisma generate --schema .\prisma\sqlite\schema.prisma
    # pnpm exec prisma migrate deploy --schema .\prisma\sqlite\schema.prisma

    Pop-Location
}

function Activate-PostgresMode {
    Info "Activating postgres.mode" $Colors.BLUE

    # Устанавливаем переменную для Postgres
    $env:PRISMA_DATABASE_URL = $env:POSTGES_PRISMA_DATABASE_URL

    Push-Location .\packages\db-main-prisma

    pnpm prisma-generate --schema .\prisma\postgres\schema.prisma
    pnpm prisma-migrate deploy --schema .\prisma\postgres\schema.prisma

    # Либо через "pnpm exec prisma ..." – если нет алиасов

    Pop-Location
}

# ----------------------------------------------------------------------------
# ПРИМЕР "switch-db-mode" (интерактивный)
# ----------------------------------------------------------------------------

function Switch-DbMode {
    Write-Host "Select a database to start:"
    Write-Host "1) sqlite"
    Write-Host "2) postges(pg)"
    $command = Read-Host "Enter a command"
    switch ($command) {
        "1" {
            Info "Switching to sqlite" $Colors.BLUE
            .\build.ps1 sqlite.mode
        }
        "sqlite" {
            .\build.ps1 sqlite.mode
        }
        "2" {
            Info "Switching to postgres" $Colors.BLUE
            .\build.ps1 docker.up teable-postgres
            .\build.ps1 docker.await teable-postgres
            .\build.ps1 postgres.mode
        }
        "postges" {
            .\build.ps1 docker.up teable-postgres
            .\build.ps1 docker.await teable-postgres
            .\build.ps1 postgres.mode
        }
        "pg" {
            .\build.ps1 docker.up teable-postgres
            .\build.ps1 docker.await teable-postgres
            .\build.ps1 postgres.mode
        }
        default {
            ErrorMsg "Unknown command: $command"
        }
    }
}

# ----------------------------------------------------------------------------
# MAIN SWITCH — аналог "make <target>"
# ----------------------------------------------------------------------------

switch ($Action) {

    # ---- Docker targets ----
    "docker.up"      { Docker-Up $Args; break }
    "docker.down"    { Docker-Down; break }
    "docker.start"   { Docker-Start $Args; break }
    "docker.stop"    { Docker-Stop $Args; break }
    "docker.restart" { Docker-Restart $Args; break }
    "docker.run"     { Docker-Run $Args; break }
    "docker.await"   { Docker-Await $Args; break }

    # ---- DB modes ----
    "sqlite.mode"    { Activate-SqliteMode; break }
    "postgres.mode"  { Activate-PostgresMode; break }
    "switch-db-mode" { Switch-DbMode; break }

    # ---- Help ----
    "help" {
        Write-Host "Available Commands:" -ForegroundColor Cyan
        Write-Host "  docker.up <service>        - Start containers in background"
        Write-Host "  docker.down               - Down/remove containers"
        Write-Host "  docker.start <service>    - Start existing containers"
        Write-Host "  docker.stop <service>     - Stop containers"
        Write-Host "  docker.restart <service>  - Restart containers"
        Write-Host "  docker.run <service> ...  - Run one-shot container"
        Write-Host "  docker.await <service>    - Wait for container(s) health"
        Write-Host "  sqlite.mode               - Migrate & generate prisma for sqlite"
        Write-Host "  postgres.mode             - Migrate & generate prisma for postgres"
        Write-Host "  switch-db-mode            - Interactive DB switch"
        break
    }

    default {
        ErrorMsg "Unknown command: $Action"
        Write-Host "Run '.\build.ps1 help' to see available commands."
    }
}
