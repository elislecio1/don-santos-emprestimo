#!/bin/bash

# ===========================================
# Script de Deploy - Don Santos Empréstimo
# ===========================================
# Este script configura e faz deploy do site
# no servidor com aaPanel
# ===========================================

set -e

echo "=========================================="
echo "  Don Santos - Script de Deploy"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variáveis de configuração
APP_NAME="don-santos-emprestimo"
APP_DIR="/www/wwwroot/${APP_NAME}"
REPO_URL="https://github.com/elislecio1/don-santos-emprestimo.git"
NODE_PORT=3000

# Função para exibir mensagens
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    log_warn "Recomendado executar como root (sudo)"
fi

# 1. Verificar e instalar dependências
log_info "Verificando dependências..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado. Instale via aaPanel > App Store > Node.js"
    exit 1
fi
log_info "Node.js: $(node -v)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    log_error "npm não encontrado"
    exit 1
fi
log_info "npm: $(npm -v)"

# Instalar pnpm se não existir
if ! command -v pnpm &> /dev/null; then
    log_info "Instalando pnpm..."
    npm install -g pnpm
fi
log_info "pnpm: $(pnpm -v)"

# Verificar PM2
if ! command -v pm2 &> /dev/null; then
    log_info "Instalando PM2..."
    npm install -g pm2
fi
log_info "PM2: $(pm2 -v)"

# 2. Clonar ou atualizar repositório
log_info "Configurando diretório da aplicação..."

if [ -d "$APP_DIR" ]; then
    log_info "Diretório existe. Atualizando..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard origin/main
else
    log_info "Clonando repositório..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# 3. Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    log_warn "Arquivo .env não encontrado. Criando template..."
    cat > .env << 'EOF'
# ===========================================
# Configurações do Banco de Dados
# ===========================================
# Substitua pelos dados do seu banco MySQL
DATABASE_URL="mysql://usuario:senha@localhost:3306/don_santos_db"

# ===========================================
# Configurações de Autenticação
# ===========================================
JWT_SECRET="sua-chave-secreta-aqui-mude-isso"

# ===========================================
# Configurações da Aplicação
# ===========================================
NODE_ENV=production
PORT=3000

# ===========================================
# Configurações do OAuth (Manus)
# ===========================================
# Deixe em branco se não usar autenticação Manus
VITE_APP_ID=""
OAUTH_SERVER_URL=""
VITE_OAUTH_PORTAL_URL=""
OWNER_OPEN_ID=""
OWNER_NAME=""

# ===========================================
# Configurações de Storage (S3)
# ===========================================
# Deixe em branco para usar armazenamento local
BUILT_IN_FORGE_API_URL=""
BUILT_IN_FORGE_API_KEY=""
VITE_FRONTEND_FORGE_API_KEY=""
VITE_FRONTEND_FORGE_API_URL=""
EOF
    log_warn "IMPORTANTE: Edite o arquivo .env com suas configurações!"
    log_warn "Localização: ${APP_DIR}/.env"
fi

# 4. Instalar dependências
log_info "Instalando dependências..."
pnpm install --frozen-lockfile || pnpm install

# 5. Build da aplicação
log_info "Fazendo build da aplicação..."
pnpm build

# 6. Configurar PM2
log_info "Configurando PM2..."

# Parar aplicação existente se houver
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true

# Iniciar aplicação
pm2 start dist/index.js --name "$APP_NAME" --env production

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup 2>/dev/null || true

# 7. Verificar status
log_info "Verificando status da aplicação..."
pm2 status "$APP_NAME"

echo ""
echo "=========================================="
echo "  Deploy concluído!"
echo "=========================================="
echo ""
echo "Próximos passos:"
echo ""
echo "1. Edite o arquivo .env com suas configurações:"
echo "   nano ${APP_DIR}/.env"
echo ""
echo "2. Configure o banco de dados MySQL no aaPanel:"
echo "   - Crie um banco de dados chamado 'don_santos_db'"
echo "   - Crie um usuário com permissões completas"
echo "   - Atualize DATABASE_URL no .env"
echo ""
echo "3. Configure o Nginx no aaPanel:"
echo "   - Vá em Site > Add Site"
echo "   - Configure o domínio"
echo "   - Adicione proxy reverso para porta ${NODE_PORT}"
echo ""
echo "4. Reinicie a aplicação após configurar .env:"
echo "   pm2 restart ${APP_NAME}"
echo ""
echo "5. Para ver logs:"
echo "   pm2 logs ${APP_NAME}"
echo ""
echo "=========================================="
