#!/bin/bash

echo "=========================================="
echo "🚀 Iniciando deploy - $(date)"
echo "=========================================="

# Navegar para o diretório
cd /www/wwwroot/don.cim.br || {
    echo "❌ Erro: Não foi possível acessar o diretório"
    exit 1
}

# Ativar Node 20 e pnpm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 || {
    echo "⚠️  Node 20 não encontrado, usando versão padrão"
}

corepack enable
corepack use pnpm@10 || pnpm --version

# Pull do repositório
echo "📥 Atualizando código do repositório..."
git pull origin main || {
    echo "❌ Erro ao fazer pull do repositório"
    exit 1
}

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install || {
    echo "❌ Erro ao instalar dependências"
    exit 1
}

# Executar migrações do banco (se necessário)
echo "🗄️  Executando migrações do banco..."
pnpm db:push || {
    echo "⚠️  Erro nas migrações (pode ser normal se já estiverem aplicadas)"
}

# Build do frontend
echo "🔨 Fazendo build do frontend..."
pnpm build || {
    echo "❌ Erro no build do frontend"
    exit 1
}

# Reiniciar API com PM2
echo "🔄 Reiniciando API..."
pm2 stop don-api 2>/dev/null || true
pm2 delete don-api 2>/dev/null || true

# Usar Node 20 explicitamente
export NODE_PATH=$(nvm which 20 | xargs dirname)
pm2 start "node dist/index.js" \
    --name don-api \
    --cwd /www/wwwroot/don.cim.br \
    --time \
    --interpreter $NODE_PATH/node || {
    echo "❌ Erro ao iniciar PM2"
    exit 1
}

pm2 save

# Aguardar alguns segundos
sleep 5

# Verificar status
echo "✅ Verificando status..."
pm2 list | grep don-api || echo "⚠️  Processo don-api não encontrado"

# Testar API
echo "🔍 Testando API..."
curl -f http://127.0.0.1:3001/api/health 2>/dev/null && echo "✅ API respondendo" || echo "⚠️  API não respondeu ainda (pode levar alguns segundos)"

echo ""
echo "=========================================="
echo "✅ Deploy concluído - $(date)"
echo "=========================================="

