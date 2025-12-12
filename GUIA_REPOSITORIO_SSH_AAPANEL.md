# Guia: Configurar Repositório Git SSH no aaPanel

## Repositório Configurado
✅ **Mantendo SSH**: `git@github.com:elislecio1/don-santos-emprestimo.git`

## Verificar se SSH está Funcionando

Execute no terminal do servidor:

```bash
# Testar conexão SSH com GitHub
ssh -T git@github.com
```

**Resposta esperada:**
- ✅ `Hi elislecio1! You've successfully authenticated...` = SSH funcionando
- ❌ `Permission denied (publickey)` = SSH não configurado

## Se SSH Não Estiver Configurado

### Passo 1: Gerar Chave SSH

```bash
# Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu-email@exemplo.com" -f ~/.ssh/id_ed25519

# Ou usar RSA (alternativa)
ssh-keygen -t rsa -b 4096 -C "seu-email@exemplo.com" -f ~/.ssh/id_rsa

# Exibir chave pública
cat ~/.ssh/id_ed25519.pub
# OU
cat ~/.ssh/id_rsa.pub
```

### Passo 2: Adicionar Chave no GitHub

1. Copie a chave pública exibida (começa com `ssh-ed25519` ou `ssh-rsa`)
2. Acesse: https://github.com/settings/keys
3. Clique em **New SSH key**
4. Cole a chave pública
5. Dê um título (ex: "Servidor aaPanel")
6. Clique em **Add SSH key**

### Passo 3: Testar Conexão

```bash
# Testar novamente
ssh -T git@github.com
```

Deve aparecer: `Hi elislecio1! You've successfully authenticated...`

## Configurar Repositório no Servidor

Execute o script atualizado:

```bash
cd /www/wwwroot/don.cim.br
bash corrigir-repositorio.sh
```

O script irá:
- ✅ Verificar se o repositório está configurado com SSH
- ✅ Garantir que o remote está correto
- ✅ Verificar se há chaves SSH
- ✅ Testar conexão com GitHub
- ✅ Configurar safe.directory

## Configurar no aaPanel

1. **Vá em Site → don.cim.br → Repositório**
2. **Configure:**
   - **URL**: `git@github.com:elislecio1/don-santos-emprestimo.git`
   - **Branch**: `main`
   - **Diretório**: `/www/wwwroot/don.cim.br`
3. **Clique em "Atualizar"** para testar

## Resolver Problema de "Failed to obtain the current submitted info"

Execute no terminal:

```bash
cd /www/wwwroot/don.cim.br

# Verificar remote (deve ser SSH)
git remote -v

# Se não for SSH, corrigir
git remote set-url origin git@github.com:elislecio1/don-santos-emprestimo.git

# Configurar safe.directory
git config --global --add safe.directory /www/wwwroot/don.cim.br

# Testar SSH
ssh -T git@github.com

# Testar pull
git fetch origin main
```

## Verificações Finais

1. **Testar SSH:**
   ```bash
   ssh -T git@github.com
   ```
   Deve retornar: `Hi elislecio1! You've successfully authenticated...`

2. **Verificar Remote:**
   ```bash
   cd /www/wwwroot/don.cim.br
   git remote -v
   ```
   Deve mostrar: `origin  git@github.com:elislecio1/don-santos-emprestimo.git (fetch)`

3. **Testar Fetch:**
   ```bash
   git fetch origin main
   ```
   Deve funcionar sem erros

4. **No aaPanel:**
   - Site → don.cim.br → Repositório → Atualizar
   - Deve mostrar informações do repositório corretamente

## Troubleshooting

### Se SSH não funcionar:

1. **Verificar permissões:**
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/id_ed25519
   chmod 644 ~/.ssh/id_ed25519.pub
   ```

2. **Adicionar GitHub ao known_hosts:**
   ```bash
   ssh-keyscan github.com >> ~/.ssh/known_hosts
   ```

3. **Verificar se a chave está no GitHub:**
   - Acesse: https://github.com/settings/keys
   - Verifique se a chave está listada

4. **Testar com verbose:**
   ```bash
   ssh -vT git@github.com
   ```
   Isso mostra detalhes do processo de autenticação

## Importante

- ✅ **Mantemos SSH**: `git@github.com:elislecio1/don-santos-emprestimo.git`
- ✅ O script garante que o remote está configurado corretamente
- ✅ Verifica e testa a conexão SSH automaticamente
