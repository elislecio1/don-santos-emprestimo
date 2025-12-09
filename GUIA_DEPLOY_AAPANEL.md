# Guia de Deploy - Don Santos Empréstimo no aaPanel

Este guia detalha o processo completo para fazer o deploy do site Don Santos no servidor com aaPanel.

---

## Pré-requisitos

- Acesso ao aaPanel: https://181.232.139.201:25936/7bcd6627
- Credenciais: `scohxwr0` / `d90d22e4`
- Repositório GitHub: https://github.com/elislecio1/don-santos-emprestimo

---

## Passo 1: Criar Banco de Dados MySQL

1. No menu lateral do aaPanel, clique em **"Bancos de dados"**
2. Clique no botão **"Adicionar banco de dados"**
3. Preencha os campos:
   - **Nome do banco de dados:** `don_santos_db`
   - **Usuário:** `don_santos_user`
   - **Senha:** (gere uma senha forte ou use: `DonSantos@2024!`)
   - **Permissões:** Todos os privilégios
4. Clique em **"Enviar"**

**Anote as credenciais:**
```
Host: localhost
Porta: 3306
Banco: don_santos_db
Usuário: don_santos_user
Senha: [sua senha]
```

---

## Passo 2: Acessar o Terminal SSH

1. No menu lateral do aaPanel, clique em **"terminal"**
2. Ou acesse via SSH externo:
   ```bash
   ssh root@181.232.139.201
   ```

---

## Passo 3: Clonar o Repositório

Execute os seguintes comandos no terminal:

```bash
# Navegar para o diretório de sites
cd /www/wwwroot

# Clonar o repositório
git clone https://github.com/elislecio1/don-santos-emprestimo.git

# Entrar no diretório
cd don-santos-emprestimo
```

---

## Passo 4: Instalar Dependências

```bash
# Verificar se pnpm está instalado
pnpm -v

# Se não estiver, instalar:
npm install -g pnpm

# Instalar dependências do projeto
pnpm install
```

---

## Passo 5: Configurar Variáveis de Ambiente

Crie o arquivo `.env`:

```bash
nano .env
```

Cole o seguinte conteúdo (ajuste os valores conforme necessário):

```env
# ===========================================
# Configurações do Banco de Dados
# ===========================================
DATABASE_URL="mysql://don_santos_user:SUA_SENHA_AQUI@localhost:3306/don_santos_db"

# ===========================================
# Configurações de Autenticação
# ===========================================
JWT_SECRET="don-santos-jwt-secret-2024-mude-isso-em-producao"

# ===========================================
# Configurações da Aplicação
# ===========================================
NODE_ENV=production
PORT=3000

# ===========================================
# Configurações do OAuth (opcional)
# ===========================================
VITE_APP_ID=""
OAUTH_SERVER_URL=""
VITE_OAUTH_PORTAL_URL=""
OWNER_OPEN_ID=""
OWNER_NAME=""

# ===========================================
# Configurações de Storage
# ===========================================
BUILT_IN_FORGE_API_URL=""
BUILT_IN_FORGE_API_KEY=""
VITE_FRONTEND_FORGE_API_KEY=""
VITE_FRONTEND_FORGE_API_URL=""
```

Salve com `Ctrl+O`, Enter, e saia com `Ctrl+X`.

---

## Passo 6: Fazer Build da Aplicação

```bash
# Fazer build
pnpm build

# Executar migrações do banco de dados
pnpm db:push
```

---

## Passo 7: Configurar PM2

```bash
# Parar instância anterior (se existir)
pm2 stop don-santos 2>/dev/null || true
pm2 delete don-santos 2>/dev/null || true

# Iniciar aplicação com PM2
pm2 start dist/index.js --name don-santos

# Salvar configuração
pm2 save

# Configurar para iniciar no boot
pm2 startup
```

Verifique se está rodando:
```bash
pm2 status
pm2 logs don-santos
```

---

## Passo 8: Criar Site no aaPanel

1. No menu lateral, clique em **"Site"**
2. Clique em **"Adicionar site"**
3. Preencha:
   - **Domínio:** seu domínio (ex: `donsantosba.com.br`) ou IP temporário
   - **Diretório raiz:** `/www/wwwroot/don-santos-emprestimo`
   - **PHP:** Selecione "Estático" ou desmarque PHP
4. Clique em **"Enviar"**

---

## Passo 9: Configurar Proxy Reverso no Nginx

1. Na lista de sites, clique no domínio que você criou
2. Vá na aba **"Configuração"** ou **"Conf"**
3. Encontre o bloco `location /` e **substitua** por:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 86400;
}

# Cache para arquivos estáticos
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

4. Clique em **"Salvar"**

---

## Passo 10: Configurar SSL (Opcional mas Recomendado)

1. Na configuração do site, vá na aba **"SSL"**
2. Clique em **"Let's Encrypt"**
3. Selecione o domínio e clique em **"Aplicar"**
4. Ative **"Forçar HTTPS"**

---

## Passo 11: Testar a Aplicação

1. Acesse o site pelo navegador: `http://seu-dominio.com.br` ou `http://181.232.139.201`
2. Verifique se a página inicial carrega
3. Teste o simulador de empréstimo
4. Acesse a área administrativa: `http://seu-dominio.com.br/admin`

---

## Passo 12: Criar Primeiro Administrador

Para acessar a área administrativa, você precisa criar um usuário admin no banco de dados:

1. No aaPanel, vá em **"Bancos de dados"**
2. Clique em **"phpMyAdmin"** ao lado do banco `don_santos_db`
3. Execute a seguinte query SQL:

```sql
INSERT INTO users (openId, name, email, role, createdAt, updatedAt, lastSignedIn)
VALUES (
  'admin-local-001',
  'Administrador',
  'admin@donsantosba.com.br',
  'admin',
  NOW(),
  NOW(),
  NOW()
);
```

**Nota:** Como o sistema usa autenticação OAuth, você pode precisar configurar um método alternativo de login ou usar o sistema de autenticação Manus.

---

## Comandos Úteis

### Ver logs da aplicação:
```bash
pm2 logs don-santos
```

### Reiniciar aplicação:
```bash
pm2 restart don-santos
```

### Parar aplicação:
```bash
pm2 stop don-santos
```

### Atualizar código do GitHub:
```bash
cd /www/wwwroot/don-santos-emprestimo
git pull origin main
pnpm install
pnpm build
pm2 restart don-santos
```

### Ver status do PM2:
```bash
pm2 status
```

---

## Solução de Problemas

### Erro de conexão com banco de dados:
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão: `mysql -u don_santos_user -p don_santos_db`

### Site não carrega:
1. Verifique se o PM2 está rodando: `pm2 status`
2. Verifique os logs: `pm2 logs don-santos`
3. Confirme se o Nginx está configurado corretamente

### Erro 502 Bad Gateway:
1. A aplicação Node.js pode não estar rodando
2. Execute: `pm2 restart don-santos`
3. Verifique se a porta 3000 está sendo usada: `netstat -tlnp | grep 3000`

### Permissões de arquivo:
```bash
chown -R www:www /www/wwwroot/don-santos-emprestimo
chmod -R 755 /www/wwwroot/don-santos-emprestimo
```

---

## Estrutura de URLs do Site

| URL | Descrição |
|-----|-----------|
| `/` | Página inicial |
| `/quem-somos` | Sobre a empresa |
| `/simulador` | Simulador de empréstimo |
| `/cadastro` | Formulário de cadastro |
| `/contato` | Página de contato |
| `/seja-parceiro` | Cadastro de parceiros |
| `/politica-privacidade` | Política de Privacidade (LGPD) |
| `/termos-servico` | Termos de Serviço |
| `/admin` | Área administrativa |
| `/admin/propostas` | Gestão de propostas |
| `/admin/fatores` | Upload de fatores CSV |
| `/admin/exportar` | Exportação de dados |
| `/admin/configuracoes` | Configurações do sistema |

---

## Suporte

Se encontrar problemas durante a configuração, verifique:
1. Logs do PM2: `pm2 logs don-santos`
2. Logs do Nginx: `/www/wwwlogs/seu-dominio.error.log`
3. Status dos serviços no aaPanel

---

**Repositório:** https://github.com/elislecio1/don-santos-emprestimo
