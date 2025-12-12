# Script para iniciar MySQL no Windows
# Execute como Administrador se necessário

Write-Host "=== INICIANDO MYSQL ===" -ForegroundColor Cyan
Write-Host ""

# Tentar diferentes nomes de serviço MySQL
$serviceNames = @("MySQL80", "MySQL", "MySQL Server 8.4", "MySQL*")

$started = $false
foreach ($name in $serviceNames) {
    $services = Get-Service -Name $name -ErrorAction SilentlyContinue
    if ($services) {
        foreach ($svc in $services) {
            Write-Host "Servico encontrado: $($svc.Name)" -ForegroundColor Yellow
            if ($svc.Status -eq 'Running') {
                Write-Host "  ✅ MySQL ja esta rodando!" -ForegroundColor Green
                $started = $true
                break
            } else {
                Write-Host "  Iniciando $($svc.Name)..." -ForegroundColor Yellow
                try {
                    Start-Service $svc.Name -ErrorAction Stop
                    Start-Sleep -Seconds 3
                    Write-Host "  ✅ MySQL iniciado com sucesso!" -ForegroundColor Green
                    $started = $true
                    break
                } catch {
                    Write-Host "  ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
                    Write-Host "  💡 Execute este script como Administrador" -ForegroundColor Yellow
                }
            }
        }
        if ($started) { break }
    }
}

if (-not $started) {
    Write-Host ""
    Write-Host "⚠️ MySQL nao foi encontrado ou nao pode ser iniciado automaticamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opcoes:" -ForegroundColor Cyan
    Write-Host "1. Execute como Administrador:" -ForegroundColor White
    Write-Host "   net start MySQL80" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Ou encontre o nome do servico:" -ForegroundColor White
    Write-Host "   Get-Service | Where-Object { `$_.DisplayName -like '*MySQL*' }" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Inicie manualmente o MySQL:" -ForegroundColor White
    Write-Host "   cd 'C:\Program Files\MySQL\MySQL Server 8.4\bin'" -ForegroundColor Gray
    Write-Host "   .\mysqld.exe --console" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Aguardando 3 segundos para MySQL inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Testar conexão
Write-Host ""
Write-Host "Testando conexao..." -ForegroundColor Yellow
try {
    $env:Path += ";C:\Program Files\MySQL\MySQL Server 8.4\bin"
    $result = mysql -u root -e "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL esta acessivel!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Executando configuracoes..." -ForegroundColor Cyan
        Write-Host ""
        
        # Executar migrações
        Write-Host "1. Executando migracoes..." -ForegroundColor Yellow
        pnpm db:push 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Migracoes OK" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Erro nas migracoes (pode ser normal)" -ForegroundColor Yellow
        }
        
        # Criar admin
        Write-Host "2. Criando usuario admin..." -ForegroundColor Yellow
        node scripts/seed-admin.mjs 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Admin criado!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Erro ao criar admin" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "=== CONCLUIDO ===" -ForegroundColor Green
        Write-Host "Acesse: http://localhost:3001/admin" -ForegroundColor Cyan
        Write-Host "Email: elislecio@gmail.com" -ForegroundColor White
        Write-Host "Senha: rosy87" -ForegroundColor White
        
    } else {
        Write-Host "⚠️ MySQL ainda nao esta acessivel. Aguarde alguns segundos e tente novamente." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Nao foi possivel testar a conexao: $($_.Exception.Message)" -ForegroundColor Yellow
}

