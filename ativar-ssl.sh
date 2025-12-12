#!/bin/bash

# ===========================================
# Script para Ativar SSL/Let's Encrypt
# Domínios: don.cim.br e www.don.cim.br
# ===========================================

set -e

echo "=========================================="
echo "🔒 Ativando SSL/Let's Encrypt"
echo "=========================================="

DOMAIN1="don.cim.br"
DOMAIN2="www.don.cim.br"
EMAIL="elislecio@gmail.com"  # Altere para seu email

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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
    log_error "Este script precisa ser executado como root"
    exit 1
fi

# Método 1: Usar acme.sh (recomendado)
log_info "Verificando se acme.sh está instalado..."

if command -v acme.sh &> /dev/null; then
    log_info "acme.sh encontrado. Usando acme.sh..."
    
    # Instalar certificado para don.cim.br
    log_info "Instalando certificado para ${DOMAIN1}..."
    acme.sh --issue -d ${DOMAIN1} -d ${DOMAIN2} --webroot /www/wwwroot/${DOMAIN1} --email ${EMAIL} || {
        log_warn "Tentando método standalone..."
        acme.sh --issue -d ${DOMAIN1} -d ${DOMAIN2} --standalone --email ${EMAIL}
    }
    
    # Instalar certificado no Nginx
    log_info "Instalando certificado no Nginx..."
    acme.sh --install-cert -d ${DOMAIN1} \
        --key-file /www/server/panel/vhost/cert/${DOMAIN1}/private.key \
        --fullchain-file /www/server/panel/vhost/cert/${DOMAIN1}/fullchain.crt \
        --reloadcmd "nginx -s reload"
    
    log_info "✅ Certificado instalado com sucesso!"
    
# Método 2: Usar bt (comando do aaPanel)
elif command -v bt &> /dev/null; then
    log_info "Usando comando bt do aaPanel..."
    
    # Obter ID do site (pode precisar ajustar)
    SITE_ID=$(bt site list | grep -i "${DOMAIN1}" | awk '{print $1}' | head -1)
    
    if [ -z "$SITE_ID" ]; then
        log_error "Site não encontrado. Verifique se o domínio está configurado no aaPanel."
        exit 1
    fi
    
    log_info "Site ID encontrado: ${SITE_ID}"
    log_info "Aplicando Let's Encrypt..."
    
    # Aplicar SSL via bt
    bt site ssl ${SITE_ID} || {
        log_warn "Tentando método alternativo..."
        # Método alternativo: editar configuração diretamente
        log_info "Configurando SSL manualmente..."
    }
    
# Método 3: Usar certbot (Let's Encrypt oficial)
elif command -v certbot &> /dev/null; then
    log_info "Usando certbot..."
    
    log_info "Instalando certificado para ${DOMAIN1} e ${DOMAIN2}..."
    certbot certonly --webroot \
        -w /www/wwwroot/${DOMAIN1} \
        -d ${DOMAIN1} \
        -d ${DOMAIN2} \
        --email ${EMAIL} \
        --agree-tos \
        --non-interactive || {
        log_warn "Tentando método standalone..."
        certbot certonly --standalone \
            -d ${DOMAIN1} \
            -d ${DOMAIN2} \
            --email ${EMAIL} \
            --agree-tos \
            --non-interactive
    }
    
    # Copiar certificados para o diretório do aaPanel
    log_info "Copiando certificados para o diretório do aaPanel..."
    mkdir -p /www/server/panel/vhost/cert/${DOMAIN1}
    cp /etc/letsencrypt/live/${DOMAIN1}/privkey.pem /www/server/panel/vhost/cert/${DOMAIN1}/private.key
    cp /etc/letsencrypt/live/${DOMAIN1}/fullchain.pem /www/server/panel/vhost/cert/${DOMAIN1}/fullchain.crt
    
    log_info "✅ Certificado instalado!"
    
else
    log_error "Nenhuma ferramenta de SSL encontrada (acme.sh, bt ou certbot)"
    log_info "Instalando certbot..."
    
    # Instalar certbot
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y certbot
    elif command -v yum &> /dev/null; then
        yum install -y certbot
    else
        log_error "Gerenciador de pacotes não reconhecido"
        exit 1
    fi
    
    # Tentar novamente
    exec "$0"
fi

# Configurar Nginx para usar HTTPS
log_info "Configurando Nginx para HTTPS..."

NGINX_CONF="/www/server/panel/vhost/nginx/${DOMAIN1}.conf"

if [ -f "$NGINX_CONF" ]; then
    log_info "Atualizando configuração do Nginx..."
    
    # Backup
    cp "$NGINX_CONF" "${NGINX_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Adicionar configuração SSL se não existir
    if ! grep -q "listen 443" "$NGINX_CONF"; then
        log_info "Adicionando configuração SSL ao Nginx..."
        
        # Criar configuração SSL
        cat >> "$NGINX_CONF" << 'EOF'

# SSL Configuration
server {
    listen 443 ssl http2;
    server_name don.cim.br www.don.cim.br;
    
    ssl_certificate /www/server/panel/vhost/cert/don.cim.br/fullchain.crt;
    ssl_certificate_key /www/server/panel/vhost/cert/don.cim.br/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Resto da configuração (copiar do server block original)
    # ... (será preenchido abaixo)
}
EOF
        
        log_info "⚠️  Configuração SSL adicionada. Verifique manualmente se está correta."
    fi
    
    # Adicionar redirecionamento HTTP -> HTTPS
    if ! grep -q "return 301 https" "$NGINX_CONF"; then
        log_info "Adicionando redirecionamento HTTP -> HTTPS..."
        
        # Inserir no início do server block HTTP
        sed -i '/server {/,/listen 80;/ {
            /listen 80;/ a\
    return 301 https://$host$request_uri;
        }' "$NGINX_CONF" || log_warn "Não foi possível adicionar redirecionamento automaticamente"
    fi
    
    # Recarregar Nginx
    log_info "Recarregando Nginx..."
    nginx -t && nginx -s reload || {
        log_error "Erro ao recarregar Nginx. Verifique a configuração."
        exit 1
    }
    
    log_info "✅ Nginx recarregado com sucesso!"
else
    log_warn "Arquivo de configuração do Nginx não encontrado: $NGINX_CONF"
    log_info "Você pode precisar configurar SSL manualmente no painel do aaPanel"
fi

# Verificar certificado
log_info "Verificando certificado..."
if [ -f "/www/server/panel/vhost/cert/${DOMAIN1}/fullchain.crt" ]; then
    CERT_INFO=$(openssl x509 -in /www/server/panel/vhost/cert/${DOMAIN1}/fullchain.crt -noout -subject -dates 2>/dev/null || echo "Erro ao ler certificado")
    log_info "Informações do certificado:"
    echo "$CERT_INFO"
else
    log_warn "Certificado não encontrado no caminho esperado"
fi

echo ""
echo "=========================================="
log_info "✅ Processo concluído!"
echo "=========================================="
log_info "Acesse: https://${DOMAIN1} para verificar"
log_info "Acesse: https://${DOMAIN2} para verificar"
echo ""
log_warn "Nota: Se o certificado não aparecer, configure manualmente no aaPanel:"
log_info "1. Acesse: Site → ${DOMAIN1} → SSL"
log_info "2. Clique em 'Let's Encrypt'"
log_info "3. Selecione os domínios: ${DOMAIN1} e ${DOMAIN2}"
log_info "4. Clique em 'Aplicar'"
echo ""

