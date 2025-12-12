#!/bin/bash

# ===========================================
# Script para Corrigir Configuração Nginx
# e Ativar SSL
# ===========================================

set -e

DOMAIN="don.cim.br"
NGINX_CONF="/www/server/panel/vhost/nginx/${DOMAIN}.conf"
WEBROOT="/www/wwwroot/${DOMAIN}"

echo "=========================================="
echo "🔧 Corrigindo Configuração Nginx para SSL"
echo "=========================================="

# Verificar se o arquivo existe
if [ ! -f "$NGINX_CONF" ]; then
    echo "❌ Erro: Arquivo não encontrado: $NGINX_CONF"
    exit 1
fi

# Fazer backup
echo "📋 Fazendo backup..."
BACKUP_FILE="${NGINX_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$NGINX_CONF" "$BACKUP_FILE"
echo "✅ Backup salvo em: $BACKUP_FILE"

# Criar diretório .well-known
mkdir -p "${WEBROOT}/.well-known/acme-challenge"
chmod -R 755 "${WEBROOT}/.well-known"

# Verificar se .well-known já está configurado corretamente
if grep -q "location ~ \^/\\\.well-known/acme-challenge" "$NGINX_CONF" && \
   ! grep -A5 "location ~ \^/\\\.well-known/acme-challenge" "$NGINX_CONF" | grep -q "location /api\|location /trpc\|location / {"; then
    echo "✅ Configuração .well-known já está correta"
else
    echo "🔧 Corrigindo configuração..."
    
    # Remover configurações .well-known incorretas (dentro de outros locations)
    sed -i '/location \/api/,/^    }/ {
        /location ~ \^\/\\\.well-known\/acme-challenge/,/access_log off;/d
    }' "$NGINX_CONF"
    
    sed -i '/location \/trpc/,/^    }/ {
        /location ~ \^\/\\\.well-known\/acme-challenge/,/access_log off;/d
    }' "$NGINX_CONF"
    
    sed -i '/location \/ {/,/^    }/ {
        /location ~ \^\/\\\.well-known\/acme-challenge/,/access_log off;/d
    }' "$NGINX_CONF"
    
    # Adicionar .well-known no início do server block (após server {)
    if ! grep -q "location ~ \^/\\\.well-known/acme-challenge" "$NGINX_CONF"; then
        echo "➕ Adicionando configuração .well-known..."
        
        # Encontrar a linha após "server {" e inserir antes do primeiro location
        sed -i '/^server {/a\
    # Permitir validação Let'\''s Encrypt (DEVE vir ANTES de qualquer location)\
    location ~ ^/\.well-known/acme-challenge {\
        root /www/wwwroot/don.cim.br;\
        try_files $uri =404;\
        access_log off;\
    }
' "$NGINX_CONF"
    fi
fi

# Testar configuração
echo "🧪 Testando configuração do Nginx..."
if nginx -t 2>&1; then
    echo "✅ Configuração válida!"
    
    # Recarregar Nginx
    echo "🔄 Recarregando Nginx..."
    systemctl reload nginx 2>/dev/null || nginx -s reload || {
        echo "⚠️  Tentando reiniciar..."
        systemctl restart nginx
    }
    
    echo "✅ Nginx recarregado!"
    
    # Testar acesso ao .well-known
    echo "🧪 Testando acesso ao .well-known..."
    TEST_FILE="${WEBROOT}/.well-known/acme-challenge/test-$(date +%s).txt"
    echo "test-validation" > "$TEST_FILE"
    
    sleep 1
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://${DOMAIN}/.well-known/acme-challenge/$(basename $TEST_FILE)" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ .well-known está acessível! (HTTP $HTTP_CODE)"
        rm -f "$TEST_FILE"
    else
        echo "⚠️  .well-known retornou HTTP $HTTP_CODE"
        echo "   Verifique se o DNS está apontando corretamente"
        rm -f "$TEST_FILE"
    fi
    
else
    echo "❌ Erro na configuração do Nginx!"
    echo "Restaurando backup..."
    cp "$BACKUP_FILE" "$NGINX_CONF"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Configuração corrigida!"
echo "=========================================="
echo ""
echo "Agora você pode obter o certificado SSL:"
echo ""
echo "certbot certonly --webroot \\"
echo "  -w ${WEBROOT} \\"
echo "  -d ${DOMAIN} \\"
echo "  -d www.${DOMAIN} \\"
echo "  --email elislecio@gmail.com \\"
echo "  --agree-tos \\"
echo "  --non-interactive"
echo ""

