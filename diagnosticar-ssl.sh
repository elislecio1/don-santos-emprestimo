#!/bin/bash

echo "🔍 Diagnóstico completo do SSL..."

# Verificar certificado atual sendo servido
echo ""
echo "1️⃣ Verificando certificado sendo servido pelo servidor:"
echo "=================================================="
echo | openssl s_client -servername don.cim.br -connect don.cim.br:443 2>&1 | grep -A 5 "Certificate chain" || echo "Erro ao conectar"

echo ""
echo "2️⃣ Verificando issuer do certificado:"
echo "=================================================="
ISSUER=$(echo | openssl s_client -servername don.cim.br -connect don.cim.br:443 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null)
echo "Issuer: $ISSUER"

if echo "$ISSUER" | grep -q "Let's Encrypt"; then
    echo "✅ Certificado do Let's Encrypt detectado"
else
    echo "⚠️ Certificado não é do Let's Encrypt ou não foi possível verificar"
fi

echo ""
echo "3️⃣ Verificando arquivos de certificado locais:"
echo "=================================================="
CERT_DIR="/www/server/panel/vhost/cert/don.cim.br"
LETSENCRYPT_DIR="/etc/letsencrypt/live/don.cim.br"

if [ -f "$CERT_DIR/fullchain.crt" ]; then
    echo "✅ fullchain.crt existe"
    CERT_ISSUER=$(openssl x509 -in "$CERT_DIR/fullchain.crt" -noout -issuer 2>/dev/null)
    echo "   Issuer: $CERT_ISSUER"
    
    # Verificar se a cadeia está completa
    CHAIN_COUNT=$(grep -c "BEGIN CERTIFICATE" "$CERT_DIR/fullchain.crt" 2>/dev/null || echo "0")
    echo "   Certificados na cadeia: $CHAIN_COUNT"
    if [ "$CHAIN_COUNT" -lt 2 ]; then
        echo "   ⚠️ Cadeia de certificados pode estar incompleta (deve ter pelo menos 2)"
    fi
else
    echo "❌ fullchain.crt não encontrado"
fi

if [ -f "$LETSENCRYPT_DIR/fullchain.pem" ]; then
    echo "✅ Let's Encrypt fullchain.pem existe"
    LE_CHAIN_COUNT=$(grep -c "BEGIN CERTIFICATE" "$LETSENCRYPT_DIR/fullchain.pem" 2>/dev/null || echo "0")
    echo "   Certificados na cadeia: $LE_CHAIN_COUNT"
else
    echo "❌ Let's Encrypt fullchain.pem não encontrado"
fi

echo ""
echo "4️⃣ Verificando configuração do Nginx:"
echo "=================================================="
NGINX_CONF="/www/server/panel/vhost/nginx/don.cim.br.conf"
if grep -q "ssl_certificate.*fullchain.crt" "$NGINX_CONF"; then
    echo "✅ Nginx configurado para usar fullchain.crt"
    grep "ssl_certificate" "$NGINX_CONF" | head -2
else
    echo "❌ Nginx não está configurado para usar fullchain.crt"
fi

echo ""
echo "5️⃣ Testando validação do certificado:"
echo "=================================================="
# Usar openssl para verificar a cadeia completa
openssl s_client -servername don.cim.br -connect don.cim.br:443 -showcerts </dev/null 2>/dev/null | openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt - 2>&1 | head -5 || echo "Não foi possível validar (normal se não tiver CA bundle local)"

echo ""
echo "6️⃣ Verificando se há certificado intermediário:"
echo "=================================================="
# Baixar certificado intermediário do Let's Encrypt se necessário
INTERMEDIATE_CERT="/tmp/lets-encrypt-r3.pem"
if [ ! -f "$INTERMEDIATE_CERT" ]; then
    echo "📥 Baixando certificado intermediário do Let's Encrypt..."
    curl -s https://letsencrypt.org/certs/lets-encrypt-r3.pem -o "$INTERMEDIATE_CERT" 2>/dev/null || echo "⚠️ Não foi possível baixar"
fi

echo ""
echo "7️⃣ Recomendações:"
echo "=================================================="
echo "Se o certificado não estiver sendo reconhecido:"
echo "1. Limpe o cache do navegador (Ctrl+Shift+Delete)"
echo "2. Tente em modo anônimo/privado"
echo "3. Aguarde alguns minutos para propagação"
echo "4. Verifique se o certificado não expirou"
echo ""
echo "Para forçar atualização do certificado:"
echo "  certbot renew --force-renewal --cert-name don.cim.br"

