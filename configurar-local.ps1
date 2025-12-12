# Script para iniciar MySQL e configurar admin
Write-Host "🔧 Configurando ambiente local..." -ForegroundColor Cyan

# 1) Verificar e iniciar MySQL
Write-Host "`n1️⃣ Verificando MySQL..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue

if ($mysqlService) {
    if ($mysqlService.Status -eq 'Running') {
        Write-Host "✅ MySQL já está rodando" -ForegroundColor Green
    } else {
        Write-Host "⏳ Iniciando MySQL..." -ForegroundColor Yellow
        try {
            Start-Service $mysqlService.Name
            Start-Sleep -Seconds 3
            Write-Host "✅ MySQL iniciado" -ForegroundColor Green
        } catch {
            Write-Host "❌ Erro ao iniciar MySQL. Execute como Administrador:" -ForegroundColor Red
            Write-Host "   net start $($mysqlService.Name)" -ForegroundColor Yellow
            exit 1
        }
    }
} else {
    Write-Host "⚠️ Serviço MySQL não encontrado." -ForegroundColor Yellow
    Write-Host "   Tentando iniciar manualmente..." -ForegroundColor Yellow
    
    # Tentar encontrar o nome do serviço
    $services = Get-Service | Where-Object { $_.Name -like "*MySQL*" -or $_.DisplayName -like "*MySQL*" }
    if ($services) {
        $service = $services[0]
        Write-Host "   Encontrado: $($service.Name)" -ForegroundColor Cyan
        try {
            Start-Service $service.Name
            Start-Sleep -Seconds 3
            Write-Host "✅ MySQL iniciado" -ForegroundColor Green
        } catch {
            Write-Host "❌ Execute como Administrador: net start $($service.Name)" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ MySQL não está instalado ou o serviço não foi encontrado." -ForegroundColor Red
        Write-Host "   Instale o MySQL ou inicie manualmente." -ForegroundColor Yellow
        exit 1
    }
}

# 2) Executar migrações
Write-Host "`n2️⃣ Executando migrações do banco de dados..." -ForegroundColor Yellow
try {
    pnpm db:push
    Write-Host "✅ Migrações executadas" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erro nas migrações (pode ser normal se já estiverem aplicadas)" -ForegroundColor Yellow
}

# 3) Criar usuário admin
Write-Host "`n3️⃣ Criando usuário administrador..." -ForegroundColor Yellow
try {
    node scripts/seed-admin.mjs
    Write-Host "✅ Usuário admin criado/atualizado" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao criar usuário admin: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Configuração concluída!" -ForegroundColor Green
Write-Host "`n📋 Credenciais de acesso:" -ForegroundColor Cyan
Write-Host "   Email: elislecio@gmail.com" -ForegroundColor White
Write-Host "   Senha: rosy87" -ForegroundColor White
Write-Host "`n🌐 Acesse: http://localhost:3001/admin" -ForegroundColor Cyan

