#!/bin/bash

# Script de Deploy para aaPanel
# Versão otimizada com verificações e melhorias

set -e  # Parar em caso de erro (comentado para permitir tratamento manual)

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

# Verificar se Node está disponível
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js antes de continuar."
    exit 1
fi

# Habilitar corepack e pnpm
corepack enable 2>/dev/null || true
corepack use pnpm@10 2>/dev/null || pnpm --version

# Verificar se pnpm está disponível
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm não encontrado. Instale pnpm antes de continuar."
    exit 1
fi

# Resolver conflitos antes do pull
echo "🔧 Verificando conflitos do Git..."
if [ -f deploy.sh ] && git diff deploy.sh &>/dev/null; then
    echo "📦 Salvando alterações locais em deploy.sh..."
    git stash push -m "Backup deploy.sh - $(date)" 2>/dev/null || true
fi

# Remover pnpm-lock.yaml local se existir (será regenerado)
if [ -f pnpm-lock.yaml ] && ! git ls-files --error-unmatch pnpm-lock.yaml &>/dev/null; then
    echo "🗑️  Removendo pnpm-lock.yaml local (será regenerado)..."
    rm -f pnpm-lock.yaml
fi

# Pull do repositório
echo "📥 Atualizando código do repositório..."
git pull origin main || {
    echo "⚠️  Erro no pull. Tentando resolver conflitos..."
    git stash push -m "Backup antes de pull - $(date)" 2>/dev/null || true
    rm -f pnpm-lock.yaml ativar-ssl.sh configurar-ssl-nginx.sh corrigir-nginx-ssl.sh 2>/dev/null || true
    git pull origin main || {
        echo "❌ Erro ao fazer pull do repositório após resolver conflitos"
        echo "💡 Execute manualmente: git reset --hard origin/main"
        exit 1
    }
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

# Verificar se o build foi bem-sucedido
if [ ! -f "dist/index.js" ]; then
    echo "❌ Erro: dist/index.js não foi criado após o build"
    exit 1
fi

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 não encontrado. Instalando PM2 globalmente..."
    npm install -g pm2 || {
        echo "❌ Erro ao instalar PM2"
        exit 1
    }
fi

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
echo "🚀 Iniciando aplicação com PM2..."
if [ -n "$NODE_PATH" ] && [ "$NODE_PATH" != "node" ] && [ -f "$NODE_PATH" ]; then
    pm2 start "node dist/index.js" \
        --name don-api \
        --cwd /www/wwwroot/don.cim.br \
        --time \
        --interpreter "$NODE_PATH" || {
        echo "⚠️  Erro ao iniciar PM2 com interpreter, tentando sem..."
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

# Aguardar alguns segundos para a aplicação iniciar
echo "⏳ Aguardando aplicação iniciar..."
sleep 5

# Verificar status do PM2
echo "✅ Verificando status do PM2..."
PM2_STATUS=$(pm2 list | grep don-api || echo "")
if [ -z "$PM2_STATUS" ]; then
    echo "⚠️  Processo don-api não encontrado no PM2"
    echo "📋 Listando todos os processos PM2:"
    pm2 list
else
    echo "✅ Processo encontrado:"
    echo "$PM2_STATUS"
fi

# Verificar logs recentes
echo "📋 Últimas linhas dos logs:"
pm2 logs don-api --lines 5 --nostream 2>/dev/null || echo "⚠️  Não foi possível ler os logs"

# Testar API com timeout
echo "🔍 Testando API..."
API_RESPONSE=$(curl -f -s --max-time 10 http://127.0.0.1:3001/api/health 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ API respondendo corretamente"
    echo "   Resposta: $API_RESPONSE"
else
    echo "⚠️  API não respondeu ainda (pode levar alguns segundos)"
    echo "   Erro: $API_RESPONSE"
    echo "💡 Verifique os logs: pm2 logs don-api"
fi

# Verificar se a porta está em uso
PORT_CHECK=$(netstat -tlnp 2>/dev/null | grep :3001 || ss -tlnp 2>/dev/null | grep :3001 || echo "")
if [ -n "$PORT_CHECK" ]; then
    echo "✅ Porta 3001 está em uso (aplicação provavelmente rodando)"
else
    echo "⚠️  Porta 3001 não está em uso"
fi

echo ""
echo "=========================================="
echo "✅ Deploy concluído - $(date)"
echo "=========================================="
echo ""
echo "📝 Comandos úteis:"
echo "   Ver logs: pm2 logs don-api"
echo "   Ver status: pm2 status"
echo "   Reiniciar: pm2 restart don-api"
echo ""
