# Script para configurar e iniciar MySQL
# Execute como Administrador: .\configurar-mysql.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuração do MySQL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin"
$env:Path += ";$mysqlPath"

# Verificar se MySQL está instalado
if (-not (Test-Path "$mysqlPath\mysqld.exe")) {
    Write-Host "✗ MySQL não encontrado em $mysqlPath" -ForegroundColor Red
    exit 1
}

Write-Host "✓ MySQL encontrado" -ForegroundColor Green
Write-Host ""

# Verificar se o serviço MySQL está instalado
$service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "Serviço MySQL encontrado: $($service.Name)" -ForegroundColor Yellow
    if ($service.Status -ne "Running") {
        Write-Host "Iniciando serviço MySQL..." -ForegroundColor Yellow
        Start-Service -Name $service.Name
        Start-Sleep -Seconds 3
        if ((Get-Service -Name $service.Name).Status -eq "Running") {
            Write-Host "✓ Serviço MySQL iniciado!" -ForegroundColor Green
        } else {
            Write-Host "✗ Erro ao iniciar serviço MySQL" -ForegroundColor Red
        }
    } else {
        Write-Host "✓ Serviço MySQL já está rodando" -ForegroundColor Green
    }
} else {
    Write-Host "⚠ Serviço MySQL não encontrado. Pode ser necessário configurar manualmente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Yellow
    Write-Host "1. Execute o MySQL Installer para configurar o servidor" -ForegroundColor White
    Write-Host "2. Ou execute manualmente:" -ForegroundColor White
    Write-Host "   cd 'C:\Program Files\MySQL\MySQL Server 8.4\bin'" -ForegroundColor Gray
    Write-Host "   .\mysqld --install" -ForegroundColor Gray
    Write-Host "   net start MySQL" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Testando conexão..." -ForegroundColor Yellow

# Tentar conectar (sem senha primeiro, depois com senha padrão)
$testConnection = $false
$passwords = @("", "password", "root")

foreach ($pwd in $passwords) {
    if ($pwd -eq "") {
        $result = & "$mysqlPath\mysql.exe" -u root -e "SELECT 1;" 2>&1
    } else {
        $result = & "$mysqlPath\mysql.exe" -u root -p"$pwd" -e "SELECT 1;" 2>&1
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Conexão bem-sucedida!" -ForegroundColor Green
        $testConnection = $true
        break
    }
}

if (-not $testConnection) {
    Write-Host "✗ Não foi possível conectar ao MySQL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Você pode precisar:" -ForegroundColor Yellow
    Write-Host "1. Configurar a senha do root MySQL" -ForegroundColor White
    Write-Host "2. Ou executar o MySQL Installer para configuração inicial" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

