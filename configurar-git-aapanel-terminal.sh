#!/bin/bash

# Script para configurar repositório Git e deploy no aaPanel via terminal
# Execute no terminal do servidor aaPanel

echo "=========================================="
echo "🔧 Configurando Git e Deploy no aaPanel"
echo "=========================================="

PROJECT_DIR="/www/wwwroot/don.cim.br"
REPO_URL="git@github.com:elislecio1/don-santos-emprestimo.git"
BRANCH="main"
SCRIPT_NAME="siteds deploy"
DEPLOY_SCRIPT_DIR="/www/server/panel/data/deploy_script_git"
DEPLOY_SCRIPT_FILE="$DEPLOY_SCRIPT_DIR/don.cim.br_siteds"

# 1) Navegar para o diretório do projeto
echo ""
echo "1️⃣ Configurando diretório do projeto..."
cd "$PROJECT_DIR" || {
    echo "❌ Erro: Não foi possível acessar $PROJECT_DIR"
    exit 1
}
echo "✅ Diretório: $(pwd)"

# 2) Verificar se é um repositório Git
echo ""
echo "2️⃣ Verificando repositório Git..."
if [ ! -d .git ]; then
    echo "📦 Inicializando repositório Git..."
    git init
    git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
    git branch -M main
    echo "✅ Repositório inicializado"
else
    echo "✅ Repositório Git já existe"
fi

# 3) Configurar remote
echo ""
echo "3️⃣ Configurando remote do repositório..."
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
    echo "🔗 Atualizando remote de '$CURRENT_REMOTE' para '$REPO_URL'"
    git remote set-url origin "$REPO_URL"
    echo "✅ Remote atualizado"
else
    echo "✅ Remote já está correto: $REPO_URL"
fi

# Verificar remote
echo "📋 Remote configurado:"
git remote -v

# 4) Configurar Git safe.directory
echo ""
echo "4️⃣ Configurando Git safe.directory..."
git config --global --add safe.directory "$PROJECT_DIR" || true
echo "✅ safe.directory configurado"

# 5) Verificar SSH
echo ""
echo "5️⃣ Verificando chave SSH..."
if [ -f ~/.ssh/id_ed25519 ] || [ -f ~/.ssh/id_rsa ]; then
    SSH_KEY=$(ls ~/.ssh/id_*.pub 2>/dev/null | head -1)
    echo "✅ Chave SSH encontrada: $SSH_KEY"
    echo "📋 Chave pública:"
    cat "$SSH_KEY" 2>/dev/null | head -1
    echo ""
    echo "💡 Certifique-se de que esta chave está adicionada no GitHub"
else
    echo "⚠️  Nenhuma chave SSH encontrada"
    echo "💡 Para gerar uma chave SSH:"
    echo "   ssh-keygen -t ed25519 -C 'seu-email@exemplo.com' -f ~/.ssh/id_ed25519"
    echo "   cat ~/.ssh/id_ed25519.pub"
    echo "   (Adicione no GitHub: Settings → SSH and GPG keys)"
fi

# 6) Testar conexão SSH
echo ""
echo "6️⃣ Testando conexão SSH com GitHub..."
SSH_TEST=$(ssh -T git@github.com 2>&1)
if echo "$SSH_TEST" | grep -q "successfully authenticated"; then
    echo "✅ SSH funcionando corretamente!"
elif echo "$SSH_TEST" | grep -q "Permission denied"; then
    echo "❌ SSH não autenticado"
    echo "💡 Configure a chave SSH no GitHub"
else
    echo "⚠️  Resposta: $(echo "$SSH_TEST" | head -1)"
fi

# 7) Testar pull
echo ""
echo "7️⃣ Testando pull do repositório..."
git fetch origin "$BRANCH" 2>&1 | head -5
if [ $? -eq 0 ]; then
    echo "✅ Pull funcionando!"
else
    echo "⚠️  Erro no pull. Verifique:"
    echo "   1. A chave SSH está no GitHub?"
    echo "   2. O repositório existe e você tem acesso?"
    echo "   3. Execute: ssh -T git@github.com"
fi

# 8) Criar script de deploy no local correto do aaPanel
echo ""
echo "8️⃣ Configurando script de deploy no aaPanel..."
mkdir -p "$DEPLOY_SCRIPT_DIR"

# Ler o script de deploy atualizado
cat > "$DEPLOY_SCRIPT_FILE" << 'DEPLOY_SCRIPT_EOF'
#!/bin/bash

# Script de Deploy para aaPanel
# Versão otimizada com verificações e melhorias

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
DEPLOY_SCRIPT_EOF

# Dar permissão de execução
chmod +x "$DEPLOY_SCRIPT_FILE"

if [ -f "$DEPLOY_SCRIPT_FILE" ]; then
    echo "✅ Script de deploy criado em: $DEPLOY_SCRIPT_FILE"
    echo "📋 Permissões: $(ls -lh "$DEPLOY_SCRIPT_FILE" | awk '{print $1}')"
else
    echo "❌ Erro ao criar script de deploy"
    exit 1
fi

# 9) Atualizar configuração do aaPanel (se possível)
echo ""
echo "9️⃣ Tentando atualizar configuração do aaPanel..."
# O aaPanel armazena configurações em arquivos JSON
AAPANEL_CONFIG="/www/server/panel/data/default.db"
if [ -f "$AAPANEL_CONFIG" ]; then
    echo "⚠️  Configuração do aaPanel está em banco de dados SQLite"
    echo "💡 Você precisará atualizar manualmente no painel ou usar o comando 'bt' do aaPanel"
else
    echo "ℹ️  Configuração não encontrada no local padrão"
fi

# 10) Resumo final
echo ""
echo "=========================================="
echo "✅ Configuração concluída!"
echo "=========================================="
echo ""
echo "📋 Resumo:"
echo "   ✅ Repositório: $REPO_URL"
echo "   ✅ Branch: $BRANCH"
echo "   ✅ Script de deploy: $DEPLOY_SCRIPT_FILE"
echo ""
echo "📝 Próximos passos:"
echo "1. No aaPanel, vá em Site → don.cim.br → Repositório"
echo "2. Verifique se está configurado: $REPO_URL"
echo "3. Se não estiver, tente atualizar manualmente ou use:"
echo "   cd $PROJECT_DIR"
echo "   git remote set-url origin $REPO_URL"
echo ""
echo "4. No aaPanel, vá em Site → don.cim.br → Roteiro"
echo "5. O script '$SCRIPT_NAME' deve aparecer na lista"
echo "6. Se não aparecer, crie um novo script com esse nome"
echo ""
echo "7. Teste o deploy:"
echo "   - No painel: Clique em 'Implantar'"
echo "   - Ou via terminal: bash $DEPLOY_SCRIPT_FILE"
echo ""

