# Guia: Corrigir Erro "Failed to obtain the current submitted info"

## Problema
O erro "Failed to obtain the current submitted info. Please check if the repository is correct!" ocorre quando o aaPanel não consegue acessar as informações do repositório Git.

## Solução Passo a Passo

### 1. Verificar Configuração do Repositório no aaPanel

1. No painel do aaPanel, vá em **Site** → **don.cim.br** → **Repositório**
2. Verifique se o repositório está configurado:
   - **URL do Repositório**: `https://github.com/elislecio1/don-santos-emprestimo.git`
   - **Branch**: `main`
   - **Diretório**: `/www/wwwroot/don.cim.br`

### 2. Reconfigurar o Repositório

Se o repositório não estiver configurado ou estiver incorreto:

1. Vá em **Site** → **don.cim.br** → **Repositório**
2. Clique em **Configurar** ou **Adicionar Repositório**
3. Preencha:
   - **URL**: `https://github.com/elislecio1/don-santos-emprestimo.git`
   - **Branch**: `main`
   - **Diretório**: `/www/wwwroot/don.cim.br`
4. Salve

### 3. Verificar Git no Servidor (via Terminal)

Execute no terminal do servidor:

```bash
cd /www/wwwroot/don.cim.br

# Verificar se é um repositório Git
git status

# Verificar remote
git remote -v

# Se não estiver configurado, adicionar:
git remote add origin https://github.com/elislecio1/don-santos-emprestimo.git
git branch -M main
git remote set-url origin https://github.com/elislecio1/don-santos-emprestimo.git

# Verificar novamente
git remote -v
```

### 4. Resolver Problema de Permissões

```bash
# Dar permissões corretas
chown -R www:www /www/wwwroot/don.cim.br
chmod -R 755 /www/wwwroot/don.cim.br

# Configurar Git safe.directory
git config --global --add safe.directory /www/wwwroot/don.cim.br
```

### 5. Testar Conexão com o Repositório

```bash
cd /www/wwwroot/don.cim.br
git fetch origin
git status
```

### 6. Atualizar Script de Deploy

Certifique-se de que o script está correto:

1. Vá em **Site** → **don.cim.br** → **Roteiro**
2. Edite o script "siteds deploy"
3. Use o conteúdo do arquivo `deploy-script-aapanel.txt`
4. Salve

### 7. Testar Deploy Manualmente

No terminal do servidor:

```bash
cd /www/wwwroot/don.cim.br
bash /www/server/panel/data/deploy_script_git/don.cim.br_siteds
```

## Solução Rápida (Script Automático)

Execute no terminal do servidor:

```bash
cd /www/wwwroot/don.cim.br

# Verificar e configurar Git
if [ ! -d .git ]; then
    echo "Inicializando repositório Git..."
    git init
    git remote add origin https://github.com/elislecio1/don-santos-emprestimo.git
    git branch -M main
fi

# Configurar remote
git remote set-url origin https://github.com/elislecio1/don-santos-emprestimo.git

# Configurar safe.directory
git config --global --add safe.directory /www/wwwroot/don.cim.br

# Testar conexão
git fetch origin main

# Verificar status
git status
git remote -v

echo "✅ Configuração concluída!"
```

## Verificações Finais

1. **No aaPanel:**
   - Site → don.cim.br → Repositório
   - Deve mostrar o repositório configurado
   - Clique em "Atualizar" para testar

2. **No Terminal:**
   ```bash
   cd /www/wwwroot/don.cim.br
   git remote -v
   # Deve mostrar: origin  https://github.com/elislecio1/don-santos-emprestimo.git (fetch)
   #              origin  https://github.com/elislecio1/don-santos-emprestimo.git (push)
   ```

3. **Testar Deploy:**
   - No aaPanel, vá em **Roteiro**
   - Clique em "Implantar" no script "siteds deploy"
   - Deve funcionar sem erros

## Troubleshooting

### Se ainda não funcionar:

1. **Verificar se o repositório é público ou se há autenticação:**
   - Se for privado, configure SSH keys ou token de acesso

2. **Verificar logs:**
   - Site → don.cim.br → Registros de webhook
   - Veja os erros detalhados

3. **Reconfigurar do zero:**
   ```bash
   cd /www/wwwroot/don.cim.br
   rm -rf .git
   git clone https://github.com/elislecio1/don-santos-emprestimo.git .
   git config --global --add safe.directory /www/wwwroot/don.cim.br
   ```

