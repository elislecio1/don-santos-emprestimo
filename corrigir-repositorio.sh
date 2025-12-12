#!/bin/bash

# Script para corrigir configuração do repositório Git no aaPanel
# Execute no terminal do servidor

echo "=========================================="
echo "🔧 Corrigindo Configuração do Repositório"
echo "=========================================="

cd /www/wwwroot/don.cim.br || {
    echo "❌ Erro: Não foi possível acessar o diretório"
    exit 1
}

echo "📁 Diretório atual: $(pwd)"

# Verificar se é um repositório Git
if [ ! -d .git ]; then
    echo "📦 Inicializando repositório Git..."
    git init
    git remote add origin git@github.com:elislecio1/don-santos-emprestimo.git
    git branch -M main
    echo "✅ Repositório inicializado com SSH"
else
    echo "✅ Repositório Git já existe"
fi

# Verificar remote atual
echo "📋 Remote atual:"
git remote -v

# Verificar se está usando SSH ou HTTPS
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

# Garantir que está usando SSH
if [[ "$CURRENT_REMOTE" != *"git@github.com"* ]]; then
    echo "🔗 Mudando para SSH..."
    git remote set-url origin git@github.com:elislecio1/don-santos-emprestimo.git
    echo "✅ Remote configurado para SSH"
fi

echo "🔑 Verificando chaves SSH..."
if [ -f ~/.ssh/id_rsa ] || [ -f ~/.ssh/id_ed25519 ]; then
    echo "   ✅ Chave SSH encontrada"
    SSH_KEY=$(ls ~/.ssh/id_*.pub 2>/dev/null | head -1)
    if [ -n "$SSH_KEY" ]; then
        echo "   📋 Chave: $SSH_KEY"
        echo "   💡 Certifique-se de que esta chave está adicionada no GitHub"
    fi
else
    echo "   ⚠️  Nenhuma chave SSH encontrada"
    echo "   💡 Para gerar uma chave SSH:"
    echo "      ssh-keygen -t ed25519 -C 'seu-email@exemplo.com' -f ~/.ssh/id_ed25519"
    echo "      cat ~/.ssh/id_ed25519.pub"
    echo "      (Adicione no GitHub: Settings → SSH and GPG keys)"
fi

# Testar conexão SSH
echo "🔍 Testando conexão SSH com GitHub..."
SSH_TEST=$(ssh -T git@github.com 2>&1)
if echo "$SSH_TEST" | grep -q "successfully authenticated"; then
    echo "   ✅ SSH funcionando corretamente!"
elif echo "$SSH_TEST" | grep -q "Permission denied"; then
    echo "   ❌ SSH não autenticado"
    echo "   💡 Configure a chave SSH no GitHub"
else
    echo "   ⚠️  Resposta: $(echo "$SSH_TEST" | head -1)"
fi

# Configurar safe.directory
echo "🔐 Configurando Git safe.directory..."
git config --global --add safe.directory /www/wwwroot/don.cim.br

# Testar conexão
echo "🔍 Testando conexão com o repositório..."
git fetch origin main 2>&1 | head -5

# Verificar se o fetch funcionou
if [ $? -eq 0 ]; then
    echo "   ✅ Conexão com repositório OK!"
else
    echo "   ⚠️  Erro ao fazer fetch"
    echo "   💡 Verifique se:"
    echo "      1. A chave SSH está configurada no GitHub"
    echo "      2. O repositório existe e você tem acesso"
    echo "      3. Execute: ssh -T git@github.com"
fi

# Verificar se o fetch funcionou
if [ $? -eq 0 ]; then
    echo "   ✅ Conexão com repositório OK!"
else
    echo "   ⚠️  Erro ao fazer fetch"
    echo "   💡 Verifique se:"
    echo "      1. A chave SSH está configurada no GitHub"
    echo "      2. O repositório existe e você tem acesso"
    echo "      3. Execute: ssh -T git@github.com"
fi

# Verificar status
echo ""
echo "📊 Status do repositório:"
git status --short | head -10

# Configurar permissões
echo ""
echo "🔐 Configurando permissões..."
chown -R www:www /www/wwwroot/don.cim.br 2>/dev/null || true
chmod -R 755 /www/wwwroot/don.cim.br 2>/dev/null || true

echo ""
echo "=========================================="
echo "✅ Configuração concluída!"
echo "=========================================="
echo ""
echo "📝 Próximos passos:"
echo "1. No aaPanel, vá em Site → don.cim.br → Repositório"
echo "2. Clique em 'Atualizar' para verificar"
echo "3. Teste o deploy em Roteiro → Implantar"
echo ""

