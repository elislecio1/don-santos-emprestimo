# Script para iniciar MySQL - Execute como Administrador
# Clique com botão direito e "Executar como Administrador"

Write-Host "=== INICIANDO MYSQL ===" -ForegroundColor Cyan
Write-Host ""

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin"
$env:Path += ";$mysqlPath"

# Verificar se MySQL está instalado
if (-not (Test-Path "$mysqlPath\mysqld.exe")) {
    Write-Host "❌ MySQL não encontrado em: $mysqlPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ MySQL encontrado" -ForegroundColor Green

# Verificar se já está rodando
$mysqlProcess = Get-Process -Name mysqld -ErrorAction SilentlyContinue
if ($mysqlProcess) {
    Write-Host "✅ MySQL já está rodando (PID: $($mysqlProcess.Id))" -ForegroundColor Green
    exit 0
}

# Verificar serviços MySQL
$services = Get-Service | Where-Object { $_.Name -like "*MySQL*" }
if ($services) {
    foreach ($svc in $services) {
        if ($svc.Status -eq 'Running') {
            Write-Host "✅ MySQL já está rodando como serviço: $($svc.Name)" -ForegroundColor Green
            exit 0
        } else {
            Write-Host "Iniciando serviço: $($svc.Name)..." -ForegroundColor Yellow
            try {
                Start-Service $svc.Name -ErrorAction Stop
                Start-Sleep -Seconds 3
                Write-Host "✅ MySQL iniciado!" -ForegroundColor Green
                exit 0
            } catch {
                Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
}

# Tentar instalar como serviço
Write-Host "Instalando MySQL como serviço..." -ForegroundColor Yellow
try {
    $installResult = & "$mysqlPath\mysqld.exe" --install MySQL80 2>&1
    if ($LASTEXITCODE -eq 0 -or $installResult -match "successfully installed") {
        Write-Host "✅ Serviço instalado" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "⚠️ $installResult" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Erro na instalação: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Iniciar serviço
Write-Host "Iniciando serviço MySQL80..." -ForegroundColor Yellow
try {
    Start-Service MySQL80 -ErrorAction Stop
    Start-Sleep -Seconds 3
    $status = (Get-Service MySQL80).Status
    if ($status -eq 'Running') {
        Write-Host "✅ MySQL iniciado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Status: $status" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro ao iniciar: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Tente manualmente: net start MySQL80" -ForegroundColor Yellow
    exit 1
}

# Verificar se está rodando
Start-Sleep -Seconds 2
$mysqlProcess = Get-Process -Name mysqld -ErrorAction SilentlyContinue
if ($mysqlProcess) {
    Write-Host ""
    Write-Host "✅ MySQL está rodando! (PID: $($mysqlProcess.Id))" -ForegroundColor Green
    Write-Host ""
    Write-Host "Configurando banco de dados..." -ForegroundColor Cyan
    
    # Mudar para o diretório do projeto
    $projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $projectPath
    
    # Executar migrações
    Write-Host "Executando migrações..." -ForegroundColor Yellow
    pnpm db:push 2>&1 | Out-Null
    
    # Criar admin
    Write-Host "Criando usuário admin..." -ForegroundColor Yellow
    node scripts/seed-admin.mjs 2>&1 | Out-Null
    
    Write-Host ""
    Write-Host "=== CONCLUÍDO ===" -ForegroundColor Green
    Write-Host "Acesse: http://localhost:3001/admin" -ForegroundColor Cyan
    Write-Host "Email: elislecio@gmail.com" -ForegroundColor White
    Write-Host "Senha: rosy87" -ForegroundColor White
} else {
    Write-Host "⚠️ MySQL pode não ter iniciado completamente" -ForegroundColor Yellow
}

