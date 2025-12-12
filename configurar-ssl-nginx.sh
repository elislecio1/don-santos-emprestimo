#!/bin/bash

# ===========================================
# Script para Configurar SSL com Nginx
# Corrige o problema de validação ACME
# ===========================================

set -e

DOMAIN="don.cim.br"
NGINX_CONF="/www/server/panel/vhost/nginx/${DOMAIN}.conf"
WEBROOT="/www/wwwroot/${DOMAIN}"

echo "=========================================="
echo "🔒 Configurando SSL para ${DOMAIN}"
echo "=========================================="

# Verificar se o arquivo de configuração existe
if [ ! -f "$NGINX_CONF" ]; then
    echo "❌ Erro: Arquivo de configuração não encontrado: $NGINX_CONF"
    exit 1
fi

# Fazer backup
echo "📋 Fazendo backup da configuração..."
cp "$NGINX_CONF" "${NGINX_CONF}.backup.$(date +%Y%m%d_%H%M%S)"

# Verificar se já existe configuração para .well-known
if grep -q "\.well-known" "$NGINX_CONF"; then
    echo "✅ Configuração .well-known já existe"
else
    echo "🔧 Adicionando configuração para .well-known..."
    
    # Adicionar antes do location /
    # Criar um novo arquivo temporário
    cat > /tmp/nginx_ssl_fix.txt << 'EOF'
    # Permitir validação Let's Encrypt
    location ~ ^/\.well-known/acme-challenge {
        root /www/wwwroot/don.cim.br;
        try_files $uri =404;
    }

EOF
    
    # Inserir antes do primeiro location /
    sed -i '/location \// {
        r /tmp/nginx_ssl_fix.txt
    }' "$NGINX_CONF" || {
        echo "⚠️  Tentando método alternativo..."
        # Método alternativo: adicionar no início do server block
        sed -i '/server {/a\
    # Permitir validação Let\'s Encrypt\
    location ~ ^/\.well-known/acme-challenge {\
        root /www/wwwroot/don.cim.br;\
        try_files $uri =404;\
    }
' "$NGINX_CONF"
    }
    
    rm -f /tmp/nginx_ssl_fix.txt
fi

# Criar diretório .well-known se não existir
mkdir -p "${WEBROOT}/.well-known/acme-challenge"
chmod -R 755 "${WEBROOT}/.well-known"

# Testar configuração do Nginx
echo "🧪 Testando configuração do Nginx..."
if nginx -t; then
    echo "✅ Configuração do Nginx válida"
    
    # Recarregar Nginx
    echo "🔄 Recarregando Nginx..."
    systemctl reload nginx || nginx -s reload || {
        echo "⚠️  Tentando reiniciar Nginx..."
        systemctl restart nginx
    }
    
    echo "✅ Nginx recarregado"
else
    echo "❌ Erro na configuração do Nginx!"
    echo "Restaurando backup..."
    cp "${NGINX_CONF}.backup."* "$NGINX_CONF" 2>/dev/null || true
    exit 1
fi

# Aguardar alguns segundos
sleep 2

# Testar se o .well-known está acessível
echo "🧪 Testando acesso ao .well-known..."
TEST_FILE="${WEBROOT}/.well-known/acme-challenge/test.txt"
echo "test" > "$TEST_FILE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://${DOMAIN}/.well-known/acme-challenge/test.txt" || echo "000")
HTTP_CODE_WWW=$(curl -s -o /dev/null -w "%{http_code}" "http://www.${DOMAIN}/.well-known/acme-challenge/test.txt" || echo "000")

rm -f "$TEST_FILE"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE_WWW" = "200" ]; then
    echo "✅ Diretório .well-known está acessível"
else
    echo "⚠️  Aviso: .well-known pode não estar acessível (HTTP $HTTP_CODE)"
    echo "   Isso pode ser normal se o DNS ainda não estiver propagado"
fi

echo ""
echo "=========================================="
echo "✅ Configuração concluída!"
echo "=========================================="
echo ""
echo "Agora você pode:"
echo "1. Executar o certbot novamente:"
echo "   certbot certonly --webroot -w ${WEBROOT} -d ${DOMAIN} -d www.${DOMAIN} --email elislecio@gmail.com --agree-tos --non-interactive"
echo ""
echo "2. Ou usar a interface do aaPanel:"
echo "   Site → ${DOMAIN} → SSL → Let's Encrypt"
echo ""

