# Script de Setup Automático - Don Santos Empréstimo
# Execute: .\setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Don Santos Empréstimo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar MySQL
Write-Host "1. Verificando MySQL..." -ForegroundColor Yellow
$mysqlRunning = $false

# Verificar se MySQL está rodando na porta 3306
$mysqlPort = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
if ($mysqlPort) {
    Write-Host "   ✓ MySQL está rodando na porta 3306" -ForegroundColor Green
    $mysqlRunning = $true
} else {
    Write-Host "   ✗ MySQL não está rodando na porta 3306" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Por favor, inicie o MySQL:" -ForegroundColor Yellow
    Write-Host "   - Se instalou via XAMPP: Abra o XAMPP Control Panel e inicie o MySQL" -ForegroundColor White
    Write-Host "   - Se instalou via MySQL Installer: Inicie o serviço MySQL no Windows" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "   Deseja continuar mesmo assim? (s/n)"
    if ($continue -ne "s") {
        exit 1
    }
}

# Verificar banco de dados
Write-Host ""
Write-Host "2. Verificando banco de dados..." -ForegroundColor Yellow

# Ler DATABASE_URL do .env
$envContent = Get-Content .env -Raw
$dbUrlMatch = [regex]::Match($envContent, 'DATABASE_URL=mysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)')
if ($dbUrlMatch.Success) {
    $dbUser = $dbUrlMatch.Groups[1].Value
    $dbPass = $dbUrlMatch.Groups[2].Value
    $dbHost = $dbUrlMatch.Groups[3].Value
    $dbPort = $dbUrlMatch.Groups[4].Value
    $dbName = $dbUrlMatch.Groups[5].Value
    
    Write-Host "   Configuração encontrada:" -ForegroundColor White
    Write-Host "   - Host: $dbHost" -ForegroundColor Gray
    Write-Host "   - Port: $dbPort" -ForegroundColor Gray
    Write-Host "   - Database: $dbName" -ForegroundColor Gray
    Write-Host "   - User: $dbUser" -ForegroundColor Gray
} else {
    Write-Host "   ✗ DATABASE_URL não encontrada no .env" -ForegroundColor Red
    exit 1
}

# Executar migrações
Write-Host ""
Write-Host "3. Executando migrações do banco de dados..." -ForegroundColor Yellow
try {
    pnpm db:push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Tabelas criadas com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Erro ao criar tabelas" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ✗ Erro: $_" -ForegroundColor Red
    exit 1
}

# Popular fatores
Write-Host ""
Write-Host "4. Populando fatores INSS..." -ForegroundColor Yellow
try {
    node scripts/seed-factors.mjs
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Fatores inseridos com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Erro ao inserir fatores" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Erro: $_" -ForegroundColor Red
}

# Criar usuário admin
Write-Host ""
Write-Host "5. Criando usuário administrador..." -ForegroundColor Yellow
try {
    node scripts/seed-admin.mjs
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Usuário admin criado com sucesso!" -ForegroundColor Green
        Write-Host "   - Email: elislecio@gmail.com" -ForegroundColor Gray
        Write-Host "   - Senha: rosy87" -ForegroundColor Gray
    } else {
        Write-Host "   ✗ Erro ao criar usuário admin" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Erro: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar o servidor, execute:" -ForegroundColor Yellow
Write-Host "  pnpm dev" -ForegroundColor White
Write-Host ""
Write-Host "Acesse a área admin em:" -ForegroundColor Yellow
Write-Host "  http://localhost:3001/admin" -ForegroundColor White
Write-Host ""

