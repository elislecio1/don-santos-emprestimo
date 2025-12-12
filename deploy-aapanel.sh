#!/bin/bash

echo "=========================================="
echo "🚀 Iniciando deploy - $(date)"
echo "=========================================="

# Navegar para o diretório
cd /www/wwwroot/don.cim.br || {
    echo "❌ Erro: Não foi possível acessar o diretório"
    exit 1
}

# Resolver problema de "dubious ownership" do Git
echo "🔐 Configurando Git safe.directory..."
git config --global --add safe.directory /www/wwwroot/don.cim.br || true

# Ativar Node 20 e pnpm
# Tentar diferentes locais do nvm
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    \. "$NVM_DIR/nvm.sh"
elif [ -s "/root/.nvm/nvm.sh" ]; then
    export NVM_DIR="/root/.nvm"
    \. "$NVM_DIR/nvm.sh"
elif [ -s "/usr/local/nvm/nvm.sh" ]; then
    export NVM_DIR="/usr/local/nvm"
    \. "$NVM_DIR/nvm.sh"
fi

# Tentar usar Node 20, mas continuar se não encontrar
if command -v nvm &> /dev/null; then
    nvm use 20 || {
        echo "⚠️  Node 20 não encontrado, usando versão padrão"
    }
else
    echo "⚠️  nvm não encontrado, usando Node do PATH"
fi

# Verificar versão do Node
NODE_VERSION=$(node --version 2>/dev/null || echo "não encontrado")
echo "📌 Node version: $NODE_VERSION"

# Habilitar corepack e pnpm
corepack enable 2>/dev/null || true
corepack use pnpm@10 2>/dev/null || pnpm --version

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

# Encontrar o caminho do Node
NODE_PATH=$(which node 2>/dev/null)
if [ -z "$NODE_PATH" ] && command -v nvm &> /dev/null; then
    NODE_20_PATH=$(nvm which 20 2>/dev/null | xargs dirname)
    if [ -n "$NODE_20_PATH" ] && [ -f "$NODE_20_PATH/node" ]; then
        NODE_PATH="$NODE_20_PATH/node"
    fi
fi

# Iniciar PM2
if [ -n "$NODE_PATH" ] && [ "$NODE_PATH" != "node" ]; then
    pm2 start "node dist/index.js" \
        --name don-api \
        --cwd /www/wwwroot/don.cim.br \
        --time \
        --interpreter "$NODE_PATH" || {
        echo "❌ Erro ao iniciar PM2 com interpreter"
        # Tentar sem interpreter
        pm2 start "node dist/index.js" \
            --name don-api \
            --cwd /www/wwwroot/don.cim.br \
            --time || {
            echo "❌ Erro ao iniciar PM2"
            exit 1
        }
    }
else
    pm2 start "node dist/index.js" \
        --name don-api \
        --cwd /www/wwwroot/don.cim.br \
        --time || {
        echo "❌ Erro ao iniciar PM2"
        exit 1
    }
fi

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
