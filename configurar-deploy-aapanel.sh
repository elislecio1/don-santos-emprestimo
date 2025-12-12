#!/bin/bash

# Script para configurar deploy automático no aaPanel
# Execute no terminal do servidor aaPanel

echo "=========================================="
echo "🔧 Configurando Deploy Automático"
echo "=========================================="

# Diretório onde o aaPanel procura os scripts
DEPLOY_DIR="/www/server/panel/data/deploy_script_git"
SCRIPT_NAME="don.cim.br_siteds"
SCRIPT_PATH="$DEPLOY_DIR/$SCRIPT_NAME"

# Criar diretório se não existir
echo "📁 Criando diretório de scripts..."
mkdir -p "$DEPLOY_DIR"

# Criar o script de deploy
echo "📝 Criando script de deploy..."
cat > "$SCRIPT_PATH" << 'SCRIPT_EOF'
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
NODE_20_PATH=$(nvm which 20 2>/dev/null | xargs dirname)
if [ -n "$NODE_20_PATH" ]; then
    pm2 start "node dist/index.js" \
        --name don-api \
        --cwd /www/wwwroot/don.cim.br \
        --time \
        --interpreter "$NODE_20_PATH/node" || {
        echo "❌ Erro ao iniciar PM2"
        exit 1
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
SCRIPT_EOF

# Dar permissão de execução
echo "🔐 Configurando permissões..."
chmod +x "$SCRIPT_PATH"

# Verificar se foi criado
if [ -f "$SCRIPT_PATH" ]; then
    echo "✅ Script criado com sucesso!"
    echo "📍 Localização: $SCRIPT_PATH"
    echo "📋 Permissões: $(ls -lh "$SCRIPT_PATH" | awk '{print $1}')"
    echo ""
    echo "✅ Configuração concluída!"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. No painel do aaPanel, vá em Site → don.cim.br → Deploy"
    echo "2. Selecione o script: 'siteds deploy'"
    echo "3. Configure o webhook do GitHub"
    echo "4. Teste fazendo um push para o repositório"
else
    echo "❌ Erro ao criar o script"
    exit 1
fi

