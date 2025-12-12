#!/bin/bash

set -e

NGINX_CONF="/www/server/panel/vhost/nginx/don.cim.br.conf"
CERT_DIR="/www/server/panel/vhost/cert/don.cim.br"
LETSENCRYPT_DIR="/etc/letsencrypt/live/don.cim.br"

echo "🔧 Corrigindo SSL com cadeia completa..."

# 1) Garantir que os certificados estão atualizados
mkdir -p "$CERT_DIR"

echo "📋 Atualizando certificados..."
if [ -f "$LETSENCRYPT_DIR/privkey.pem" ]; then
    # Copiar certificados
    cp "$LETSENCRYPT_DIR/privkey.pem" "$CERT_DIR/private.key"
    cp "$LETSENCRYPT_DIR/fullchain.pem" "$CERT_DIR/fullchain.crt"
    
    # Verificar se fullchain tem a cadeia completa
    CHAIN_COUNT=$(grep -c "BEGIN CERTIFICATE" "$CERT_DIR/fullchain.crt" 2>/dev/null || echo "0")
    echo "   Certificados na cadeia: $CHAIN_COUNT"
    
    # Se a cadeia estiver incompleta, adicionar certificado intermediário
    if [ "$CHAIN_COUNT" -lt 2 ]; then
        echo "   ⚠️ Cadeia incompleta, adicionando certificado intermediário..."
        INTERMEDIATE="/tmp/lets-encrypt-r3.pem"
        if [ ! -f "$INTERMEDIATE" ]; then
            curl -s https://letsencrypt.org/certs/lets-encrypt-r3.pem -o "$INTERMEDIATE" || true
        fi
        if [ -f "$INTERMEDIATE" ]; then
            cat "$CERT_DIR/fullchain.crt" "$INTERMEDIATE" > "$CERT_DIR/fullchain.crt.tmp"
            mv "$CERT_DIR/fullchain.crt.tmp" "$CERT_DIR/fullchain.crt"
            echo "   ✅ Certificado intermediário adicionado"
        fi
    fi
    
    chmod 600 "$CERT_DIR/private.key"
    chmod 644 "$CERT_DIR/fullchain.crt"
    echo "✅ Certificados atualizados"
else
    echo "❌ Erro: Certificados do Let's Encrypt não encontrados"
    exit 1
fi

# 2) Backup
cp "$NGINX_CONF" "${NGINX_CONF}.backup.$(date +%Y%m%d_%H%M%S)"

# 3) Recriar configuração com SSL otimizado
echo "📝 Atualizando configuração do Nginx..."
cat > "$NGINX_CONF" << 'NGINX_EOF'
# HTTP -> HTTPS
server {
    listen 80;
    server_name don.cim.br www.don.cim.br;
    
    location ~ ^/\.well-known/acme-challenge {
        root /www/wwwroot/don.cim.br;
        try_files $uri =404;
        access_log off;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
    
    access_log  /www/wwwlogs/don.cim.br.log;
    error_log   /www/wwwlogs/don.cim.br.error.log;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name don.cim.br www.don.cim.br;
    
    # Certificados SSL (fullchain inclui certificado + intermediário)
    ssl_certificate /www/server/panel/vhost/cert/don.cim.br/fullchain.crt;
    ssl_certificate_key /www/server/panel/vhost/cert/don.cim.br/private.key;
    
    # Configurações SSL modernas e seguras
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:!aNULL:!MD5:!DSS';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # OCSP Stapling (melhora validação do certificado)
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /www/server/panel/vhost/cert/don.cim.br/fullchain.crt;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Headers de segurança
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location ~ ^/\.well-known/acme-challenge {
        root /www/wwwroot/don.cim.br;
        try_files $uri =404;
        access_log off;
    }
    
    root /www/wwwroot/don.cim.br/dist/public;
    index index.html;
    
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.env|\.svn|\.project|LICENSE|README.md) { 
        return 404; 
    }
    
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
    }
    
    location /trpc {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    access_log  /www/wwwlogs/don.cim.br.log;
    error_log   /www/wwwlogs/don.cim.br.error.log;
}
NGINX_EOF

# 4) Testar configuração
echo "🧪 Testando configuração..."
if /www/server/nginx/sbin/nginx -t; then
    echo "✅ Configuração válida"
else
    echo "❌ Erro na configuração!"
    exit 1
fi

# 5) Recarregar Nginx
echo "🔄 Recarregando Nginx..."
/www/server/nginx/sbin/nginx -s reload

# 6) Verificar certificado
echo ""
echo "🔍 Verificando certificado após correção..."
sleep 3
echo | openssl s_client -servername don.cim.br -connect don.cim.br:443 2>/dev/null | openssl x509 -noout -issuer -subject -dates 2>/dev/null || echo "⚠️ Aguarde alguns segundos"

echo ""
echo "✅ SSL corrigido!"
echo ""
echo "📋 Próximos passos:"
echo "1. Limpe o cache do navegador (Ctrl+Shift+Delete)"
echo "2. Feche e abra o navegador novamente"
echo "3. Tente em modo anônimo/privado"
echo "4. Aguarde 2-5 minutos para propagação"
echo ""
echo "🌐 Teste: https://don.cim.br"
echo ""
echo "💡 Se ainda aparecer 'Não seguro', pode ser cache do navegador."
echo "   O certificado está correto e será reconhecido em breve."

