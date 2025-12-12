#!/bin/bash

# Script rápido para resolver conflitos do Git
cd /www/wwwroot/don.cim.br

echo "🔧 Resolvendo conflitos do Git..."

# Fazer stash das alterações locais
echo "📦 Salvando alterações locais..."
git stash push -m "Backup antes de atualizar - $(date)" 2>/dev/null || echo "⚠️  Nenhuma alteração para fazer stash"

# Remover pnpm-lock.yaml local (será regenerado)
echo "🗑️  Removendo pnpm-lock.yaml local..."
rm -f pnpm-lock.yaml

# Fazer pull
echo "📥 Fazendo pull..."
git pull origin main

# Se ainda houver conflito com deploy.sh, fazer reset
if [ $? -ne 0 ]; then
    echo "⚠️  Ainda há conflitos. Fazendo reset hard..."
    git reset --hard origin/main
    git clean -fd
    echo "✅ Repositório atualizado (alterações locais descartadas)"
fi

echo "✅ Conflitos resolvidos!"
echo ""
echo "📝 Próximos passos:"
echo "   bash /www/server/panel/data/deploy_script_git/don.cim.br_siteds"

