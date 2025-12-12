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
    git remote add origin https://github.com/elislecio1/don-santos-emprestimo.git
    git branch -M main
    echo "✅ Repositório inicializado"
else
    echo "✅ Repositório Git já existe"
fi

# Verificar remote atual
echo "📋 Remote atual:"
git remote -v

# Verificar se está usando SSH ou HTTPS
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

if [[ "$CURRENT_REMOTE" == *"git@github.com"* ]]; then
    echo "🔑 Repositório configurado com SSH"
    echo "   Verificando chaves SSH..."
    
    # Verificar se há chave SSH
    if [ -f ~/.ssh/id_rsa ] || [ -f ~/.ssh/id_ed25519 ]; then
        echo "   ✅ Chave SSH encontrada"
    else
        echo "   ⚠️  Nenhuma chave SSH encontrada"
        echo "   💡 Opções:"
        echo "      1. Configurar chave SSH (recomendado para privado)"
        echo "      2. Mudar para HTTPS (mais simples)"
        read -p "   Deseja mudar para HTTPS? (s/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            git remote set-url origin https://github.com/elislecio1/don-santos-emprestimo.git
            echo "   ✅ Mudado para HTTPS"
        fi
    fi
    
    # Testar conexão SSH
    echo "🔍 Testando conexão SSH..."
    ssh -T git@github.com 2>&1 | head -3 || echo "   ⚠️  Erro na conexão SSH"
else
    echo "🌐 Repositório configurado com HTTPS"
    # Se quiser mudar para SSH, descomente:
    # git remote set-url origin git@github.com:elislecio1/don-santos-emprestimo.git
fi

# Configurar safe.directory
echo "🔐 Configurando Git safe.directory..."
git config --global --add safe.directory /www/wwwroot/don.cim.br

# Testar conexão
echo "🔍 Testando conexão com o repositório..."
git fetch origin main 2>&1 | head -5

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

