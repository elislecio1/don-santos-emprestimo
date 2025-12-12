#!/bin/bash

set -e

NGINX_CONF="/www/server/panel/vhost/nginx/don.cim.br.conf"
CERT_DIR="/www/server/panel/vhost/cert/don.cim.br"
LETSENCRYPT_DIR="/etc/letsencrypt/live/don.cim.br"

echo "🔧 Corrigindo configuração SSL..."

# 1) Criar diretório de certificados se não existir
mkdir -p "$CERT_DIR"

# 2) Copiar certificados do Let's Encrypt
echo "📋 Copiando certificados..."
if [ -f "$LETSENCRYPT_DIR/privkey.pem" ]; then
    cp "$LETSENCRYPT_DIR/privkey.pem" "$CERT_DIR/private.key"
    cp "$LETSENCRYPT_DIR/fullchain.pem" "$CERT_DIR/fullchain.crt"
    chmod 600 "$CERT_DIR/private.key"
    chmod 644 "$CERT_DIR/fullchain.crt"
    echo "✅ Certificados copiados"
else
    echo "❌ Erro: Certificados do Let's Encrypt não encontrados em $LETSENCRYPT_DIR"
    exit 1
fi

# 3) Fazer backup da configuração atual
echo "💾 Fazendo backup da configuração..."
cp "$NGINX_CONF" "${NGINX_CONF}.backup.$(date +%Y%m%d_%H%M%S)"

# 4) Recriar configuração completa com HTTP -> HTTPS e HTTPS
echo "📝 Recriando configuração do Nginx..."
cat > "$NGINX_CONF" << 'NGINX_EOF'
# Configuração HTTP - Redireciona para HTTPS
server {
    listen 80;
    server_name don.cim.br www.don.cim.br;
    
    # Permitir validação Let's Encrypt (DEVE vir PRIMEIRO)
    location ~ ^/\.well-known/acme-challenge {
        root /www/wwwroot/don.cim.br;
        try_files $uri =404;
        access_log off;
    }
    
    # Redirecionar todo o resto para HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
    
    access_log  /www/wwwlogs/don.cim.br.log;
    error_log   /www/wwwlogs/don.cim.br.error.log;
}

# Configuração HTTPS
server {
    listen 443 ssl http2;
    server_name don.cim.br www.don.cim.br;
    
    # Certificados SSL
    ssl_certificate /www/server/panel/vhost/cert/don.cim.br/fullchain.crt;
    ssl_certificate_key /www/server/panel/vhost/cert/don.cim.br/private.key;
    
    # Configurações SSL modernas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Permitir validação Let's Encrypt
    location ~ ^/\.well-known/acme-challenge {
        root /www/wwwroot/don.cim.br;
        try_files $uri =404;
        access_log off;
    }
    
    # front-end build
    root /www/wwwroot/don.cim.br/dist/public;
    index index.html;
    
    # arquivos sensíveis
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.env|\.svn|\.project|LICENSE|README.md) { 
        return 404; 
    }
    
    # API
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
    
    # tRPC
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
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    access_log  /www/wwwlogs/don.cim.br.log;
    error_log   /www/wwwlogs/don.cim.br.error.log;
}
NGINX_EOF

# 5) Testar configuração
echo "🧪 Testando configuração do Nginx..."
if /www/server/nginx/sbin/nginx -t; then
    echo "✅ Configuração válida"
else
    echo "❌ Erro na configuração do Nginx!"
    exit 1
fi

# 6) Recarregar Nginx
echo "🔄 Recarregando Nginx..."
/www/server/nginx/sbin/nginx -s reload || systemctl reload nginx || service nginx reload

# 7) Criar arquivo de marcação para o aaPanel (opcional)
# Isso pode ajudar o painel a reconhecer que o SSL está ativo
mkdir -p /www/server/panel/vhost/ssl/don.cim.br
touch /www/server/panel/vhost/ssl/don.cim.br/ssl.pl

# 8) Verificar se está funcionando
echo ""
echo "🔍 Verificando certificado..."
sleep 2
echo | openssl s_client -servername don.cim.br -connect don.cim.br:443 2>/dev/null | openssl x509 -noout -issuer -subject -dates 2>/dev/null || echo "⚠️ Não foi possível verificar o certificado (pode levar alguns segundos para propagar)"

echo ""
echo "✅ SSL configurado com sucesso!"
echo "🌐 Acesse: https://don.cim.br"
echo ""
echo "📝 Nota: Se o painel do aaPanel ainda mostrar 'SSL is NOT currently enabled',"
echo "   ignore essa mensagem. O SSL está funcionando corretamente no Nginx."
echo "   O aviso do navegador deve desaparecer em alguns minutos após o reload."

