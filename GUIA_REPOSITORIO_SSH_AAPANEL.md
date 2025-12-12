# Guia: Configurar Repositório Git com SSH no aaPanel

## Repositório Configurado
O repositório está configurado como: `git@github.com:elislecio1/don-santos-emprestimo.git` (SSH)

## Verificar se SSH está Funcionando

Execute no terminal do servidor:

```bash
# Testar conexão SSH com GitHub
ssh -T git@github.com
```

**Resposta esperada:**
- ✅ `Hi elislecio1! You've successfully authenticated...` = SSH funcionando
- ❌ `Permission denied` = SSH não configurado

## Se SSH Não Estiver Configurado

### Opção 1: Configurar Chave SSH (Recomendado para Repositórios Privados)

```bash
# Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu-email@exemplo.com" -f ~/.ssh/id_ed25519

# Exibir chave pública
cat ~/.ssh/id_ed25519.pub

# Copiar a chave e adicionar no GitHub:
# 1. GitHub → Settings → SSH and GPG keys
# 2. New SSH key
# 3. Cole a chave pública
# 4. Save

# Testar novamente
ssh -T git@github.com
```

### Opção 2: Mudar para HTTPS (Mais Simples)

Se preferir usar HTTPS (não requer chaves SSH):

```bash
cd /www/wwwroot/don.cim.br
git remote set-url origin https://github.com/elislecio1/don-santos-emprestimo.git
git remote -v
```

Depois, no aaPanel:
1. Site → don.cim.br → Repositório
2. Altere a URL para: `https://github.com/elislecio1/don-santos-emprestimo.git`
3. Salve

## Configurar no aaPanel

1. **Vá em Site → don.cim.br → Repositório**
2. **Configure:**
   - **URL**: `git@github.com:elislecio1/don-santos-emprestimo.git` (SSH)
   - **OU**: `https://github.com/elislecio1/don-santos-emprestimo.git` (HTTPS)
   - **Branch**: `main`
   - **Diretório**: `/www/wwwroot/don.cim.br`
3. **Clique em "Atualizar"** para testar

## Resolver Problema de "Failed to obtain the current submitted info"

Execute no terminal:

```bash
cd /www/wwwroot/don.cim.br

# Verificar remote
git remote -v

# Se estiver usando SSH, testar conexão
ssh -T git@github.com

# Configurar safe.directory
git config --global --add safe.directory /www/wwwroot/don.cim.br

# Testar pull
git fetch origin main
```

## Script Automático

Execute o script atualizado:

```bash
cd /www/wwwroot/don.cim.br
bash corrigir-repositorio.sh
```

O script agora detecta se está usando SSH ou HTTPS e oferece opções.

## Verificações Finais

1. **Testar SSH:**
   ```bash
   ssh -T git@github.com
   ```

2. **Verificar Remote:**
   ```bash
   cd /www/wwwroot/don.cim.br
   git remote -v
   ```

3. **Testar Pull:**
   ```bash
   git fetch origin main
   git status
   ```

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

3. **Ou mudar para HTTPS:**
   ```bash
   git remote set-url origin https://github.com/elislecio1/don-santos-emprestimo.git
   ```

