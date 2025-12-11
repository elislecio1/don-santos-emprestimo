# Comandos de Deploy - aaPanel (don.cim.br)

Execute os comandos abaixo no terminal do aaPanel para configurar o site.

## 1. Preparação Inicial

```bash
# Navegar para o diretório do site
cd /www/wwwroot/don.cim.br

# Limpar diretório (se necessário)
rm -rf * .*  2>/dev/null

# Clonar o repositório
git clone https://github.com/elislecio1/don-santos-emprestimo.git .
```

## 2. Instalar Dependências

```bash
# Instalar pnpm globalmente (se não estiver instalado)
npm install -g pnpm

# Instalar dependências do projeto
pnpm install
```

## 3. Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env
cat > .env << 'EOF'
# ===========================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# ===========================================
# Substitua pelos dados do seu banco MySQL
DATABASE_URL=mysql://usuario:senha@localhost:3306/don_santos

# ===========================================
# SEGURANÇA
# ===========================================
# Chave secreta para JWT (gere uma string aleatória)
JWT_SECRET=don-santos-jwt-secret-2024-producao

# ===========================================
# SERVIDOR
# ===========================================
NODE_ENV=production
PORT=3000
EOF

# Editar o arquivo .env com suas credenciais reais
nano .env
```

## 4. Configurar Banco de Dados

```bash
# Criar tabelas no banco de dados
pnpm db:push

# Popular tabela de fatores de empréstimo
node scripts/seed-factors.mjs
```

## 5. Build do Projeto

```bash
# Criar build de produção
pnpm build
```

## 6. Criar Diretório de Logs

```bash
# Criar diretório para logs do PM2
mkdir -p /www/wwwroot/don.cim.br/logs
```

## 7. Configurar PM2

```bash
# Instalar PM2 globalmente (se não estiver instalado)
npm install -g pm2

# Iniciar aplicação com PM2
pm2 start ecosystem.config.cjs

# Verificar se está rodando
pm2 status

# Ver logs em tempo real
pm2 logs don-santos

# Salvar configuração do PM2
pm2 save

# Configurar inicialização automática no boot
pm2 startup
```

## 8. Configurar Nginx no aaPanel

No painel do aaPanel, vá em **Website** > **don.cim.br** > **Config** e adicione:

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
    proxy_connect_timeout 60;
    proxy_send_timeout 60;
}
```

## 9. Reiniciar Nginx

```bash
# Reiniciar Nginx para aplicar configurações
systemctl restart nginx
```

## 10. Verificar Funcionamento

```bash
# Testar se a aplicação está respondendo
curl http://localhost:3000

# Verificar status do PM2
pm2 status

# Ver logs de erro (se houver)
pm2 logs don-santos --err
```

---

## Comandos Úteis do PM2

```bash
# Ver status de todas as aplicações
pm2 status

# Reiniciar aplicação
pm2 restart don-santos

# Parar aplicação
pm2 stop don-santos

# Ver logs em tempo real
pm2 logs don-santos

# Monitorar recursos
pm2 monit

# Recarregar sem downtime
pm2 reload don-santos

# Deletar aplicação do PM2
pm2 delete don-santos
```

## Atualizar o Site (Deploy de Novas Versões)

```bash
cd /www/wwwroot/don.cim.br

# Baixar atualizações do GitHub
git pull origin main

# Reinstalar dependências (se houver mudanças)
pnpm install

# Rebuild
pnpm build

# Reiniciar aplicação
pm2 restart don-santos
```

---

## Credenciais de Administrador

| Campo | Valor |
|-------|-------|
| **URL** | `https://don.cim.br/admin/login` |
| **Email** | `elislecio@gmail.com` |
| **Senha** | `rosy87` |

> ⚠️ **IMPORTANTE:** Altere a senha após o primeiro acesso!

---

## Troubleshooting

### Erro: "Cannot find module"
```bash
pnpm install
pnpm build
pm2 restart don-santos
```

### Erro: "ECONNREFUSED" no banco
Verifique se o MySQL está rodando e as credenciais no `.env` estão corretas.

### Erro: "Permission denied"
```bash
chown -R www:www /www/wwwroot/don.cim.br
chmod -R 755 /www/wwwroot/don.cim.br
```

### Site não carrega após reiniciar servidor
```bash
pm2 resurrect
# ou
pm2 start ecosystem.config.cjs
```
