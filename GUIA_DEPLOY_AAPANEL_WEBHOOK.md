# Guia: Configurar Deploy Automático no aaPanel

## Problema Identificado

O erro mostra que o aaPanel está procurando o script em:
```
/www/server/panel/data/deploy_script_git/don.cim.br_siteds
```

Mas o arquivo não existe nesse local.

## Solução: Configurar o Script no aaPanel

### Passo 1: Acessar Configurações do Site

1. No painel do aaPanel, vá em **Site**
2. Clique no domínio **don.cim.br**
3. Vá na aba **Deploy** ou **Git**

### Passo 2: Configurar Webhook do GitHub

1. No GitHub, vá em **Settings** → **Webhooks** do repositório
2. Adicione um novo webhook:
   - **Payload URL**: `https://don.cim.br/webhook` (ou o URL do webhook do aaPanel)
   - **Content type**: `application/json`
   - **Events**: Selecione "Just the push event"
   - **Active**: ✅

### Passo 3: Criar o Script de Deploy no aaPanel

**Opção A: Via Interface do aaPanel**

1. No painel do aaPanel, vá em **Site** → **don.cim.br** → **Deploy**
2. Clique em **Adicionar Script de Deploy** ou **Configurar Git**
3. Cole o conteúdo do script abaixo
4. Salve com o nome: `siteds deploy`

**Opção B: Criar Arquivo Manualmente**

Execute no terminal do servidor:

```bash
# Criar diretório se não existir
mkdir -p /www/server/panel/data/deploy_script_git

# Criar o script
cat > /www/server/panel/data/deploy_script_git/don.cim.br_siteds << 'SCRIPT_EOF'
#!/bin/bash

echo "=========================================="
echo "🚀 Iniciando deploy - $(date)"
echo "=========================================="

# Navegar para o diretório
cd /www/wwwroot/don.cim.br || {
    echo "❌ Erro: Não foi possível acessar o diretório"
    exit 1
}

# Ativar Node 20 e pnpm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 || {
    echo "⚠️  Node 20 não encontrado, usando versão padrão"
}

corepack enable
corepack use pnpm@10 || pnpm --version

# Pull do repositório
echo "📥 Atualizando código do repositório..."
git pull origin main || {
    echo "❌ Erro ao fazer pull do repositório"
    exit 1
}

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install || {
    echo "❌ Erro ao instalar dependências"
    exit 1
}

# Executar migrações do banco (se necessário)
echo "🗄️  Executando migrações do banco..."
pnpm db:push || {
    echo "⚠️  Erro nas migrações (pode ser normal se já estiverem aplicadas)"
}

# Build do frontend
echo "🔨 Fazendo build do frontend..."
pnpm build || {
    echo "❌ Erro no build do frontend"
    exit 1
}

# Reiniciar API com PM2
echo "🔄 Reiniciando API..."
pm2 stop don-api 2>/dev/null || true
pm2 delete don-api 2>/dev/null || true

# Usar Node 20 explicitamente
export NODE_PATH=$(nvm which 20 | xargs dirname)
pm2 start "node dist/index.js" \
    --name don-api \
    --cwd /www/wwwroot/don.cim.br \
    --time \
    --interpreter $NODE_PATH/node || {
    echo "❌ Erro ao iniciar PM2"
    exit 1
}

pm2 save

# Aguardar alguns segundos
sleep 5

# Verificar status
echo "✅ Verificando status..."
pm2 list | grep don-api || echo "⚠️  Processo don-api não encontrado"

# Testar API
echo "🔍 Testando API..."
curl -f http://127.0.0.1:3001/api/health 2>/dev/null && echo "✅ API respondendo" || echo "⚠️  API não respondeu ainda (pode levar alguns segundos)"

echo ""
echo "=========================================="
echo "✅ Deploy concluído - $(date)"
echo "=========================================="
SCRIPT_EOF

# Dar permissão de execução
chmod +x /www/server/panel/data/deploy_script_git/don.cim.br_siteds

# Verificar se foi criado
ls -lh /www/server/panel/data/deploy_script_git/don.cim.br_siteds
```

### Passo 4: Testar o Script

Execute manualmente para testar:

```bash
bash /www/server/panel/data/deploy_script_git/don.cim.br_siteds
```

### Passo 5: Configurar no aaPanel

1. Vá em **Site** → **don.cim.br** → **Deploy**
2. Selecione o script: `siteds deploy`
3. Ative o webhook
4. Salve as configurações

## Verificações

Após configurar, verifique:

1. **Arquivo existe:**
   ```bash
   ls -lh /www/server/panel/data/deploy_script_git/don.cim.br_siteds
   ```

2. **Permissões corretas:**
   ```bash
   chmod +x /www/server/panel/data/deploy_script_git/don.cim.br_siteds
   ```

3. **Script executável:**
   ```bash
   bash /www/server/panel/data/deploy_script_git/don.cim.br_siteds
   ```

## Notas Importantes

- O nome do arquivo deve ser exatamente: `don.cim.br_siteds`
- O script deve ter permissão de execução (`chmod +x`)
- O caminho deve ser exatamente: `/www/server/panel/data/deploy_script_git/`
- O nome do script no aaPanel deve ser: `siteds deploy`

## Troubleshooting

Se ainda não funcionar:

1. Verifique os logs do webhook no aaPanel
2. Execute o script manualmente para ver erros
3. Verifique se o Git está configurado corretamente no servidor
4. Verifique se o PM2 está instalado e funcionando

