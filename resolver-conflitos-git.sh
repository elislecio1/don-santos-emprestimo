#!/bin/bash

# Script para resolver conflitos do Git e atualizar o repositório
# Execute no terminal do servidor

echo "=========================================="
echo "🔧 Resolvendo Conflitos do Git"
echo "=========================================="

cd /www/wwwroot/don.cim.br || {
    echo "❌ Erro: Não foi possível acessar o diretório"
    exit 1
}

echo "📋 Status atual do Git:"
git status --short

# Fazer backup dos arquivos locais
echo ""
echo "💾 Fazendo backup dos arquivos locais..."
BACKUP_DIR="/tmp/backup_git_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup de arquivos modificados
if [ -f deploy.sh ]; then
    cp deploy.sh "$BACKUP_DIR/deploy.sh.backup"
    echo "✅ Backup de deploy.sh criado"
fi

# Backup de arquivos não rastreados
for file in ativar-ssl.sh configurar-ssl-nginx.sh corrigir-nginx-ssl.sh pnpm-lock.yaml; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo "✅ Backup de $file criado"
    fi
done

echo "📁 Backup salvo em: $BACKUP_DIR"

# Stash das alterações locais
echo ""
echo "📦 Salvando alterações locais..."
git stash push -m "Backup antes de pull - $(date)" || {
    echo "⚠️  Nenhuma alteração para fazer stash"
}

# Remover arquivos não rastreados que conflitam
echo ""
echo "🗑️  Removendo arquivos não rastreados que conflitam..."
rm -f ativar-ssl.sh configurar-ssl-nginx.sh corrigir-nginx-ssl.sh

# Manter pnpm-lock.yaml se necessário (pode ser útil)
if [ -f pnpm-lock.yaml ]; then
    echo "⚠️  pnpm-lock.yaml será sobrescrito no pull"
fi

# Fazer pull
echo ""
echo "📥 Fazendo pull do repositório..."
git pull origin main || {
    echo "❌ Erro no pull. Tentando resolver..."
    
    # Se ainda houver conflito, fazer reset (CUIDADO: isso descarta alterações locais)
    read -p "Deseja descartar alterações locais e forçar atualização? (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo "🔄 Fazendo reset hard..."
        git reset --hard origin/main
        git clean -fd
        echo "✅ Repositório atualizado (alterações locais descartadas)"
    else
        echo "⚠️  Pull não concluído. Resolva manualmente os conflitos."
        exit 1
    fi
}

# Verificar se pnpm-lock.yaml precisa ser atualizado
if [ -f pnpm-lock.yaml ]; then
    echo ""
    echo "📦 Atualizando pnpm-lock.yaml..."
    pnpm install --lockfile-only 2>/dev/null || echo "⚠️  Não foi possível atualizar lockfile"
fi

echo ""
echo "=========================================="
echo "✅ Conflitos resolvidos!"
echo "=========================================="
echo ""
echo "📋 Arquivos atualizados do repositório"
echo "💾 Backup salvo em: $BACKUP_DIR"
echo ""
echo "📝 Próximos passos:"
echo "1. Teste o deploy: bash /www/server/panel/data/deploy_script_git/don.cim.br_siteds"
echo "2. Ou use o painel do aaPanel para fazer deploy"
echo ""

