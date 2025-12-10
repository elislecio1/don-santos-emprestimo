# Don Santos - Correspondente Bancário

Sistema completo de simulação de empréstimo consignado com captura de dados e documentos para a Don Santos Correspondente Bancário.

![Don Santos](https://img.shields.io/badge/Don%20Santos-Correspondente%20Bancário-d4a853?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql)

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Deploy em Produção](#-deploy-em-produção)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Credenciais de Administrador](#-credenciais-de-administrador)
- [Licença](#-licença)

## 🚀 Funcionalidades

### Site Institucional
- Página inicial com apresentação da empresa
- Página "Quem Somos" com história e valores
- Página "Seja Parceiro" para cadastro de subestabelecidos
- Página de Contato com formulário
- Política de Privacidade (LGPD)
- Termos de Serviço
- Design responsivo (desktop e mobile)

### Simulador de Empréstimo
- Cálculo por valor da parcela (Parcela ÷ Fator = Valor do empréstimo)
- Cálculo por valor do empréstimo (Empréstimo × Fator = Parcela)
- Seleção de prazo (18, 24, 30, 36, 48, 60, 72 meses)
- Fatores diários configuráveis (dias 1-31)

### Formulário de Cadastro (Lead Page)
- Dados pessoais: Nome, CPF, Data de Nascimento, RG/CNH, Filiação, Telefone
- Endereço completo com busca por CEP
- Dados bancários: Banco, Agência, Conta, Tipo de Conta
- Captura de documentos:
  - Frente do RG
  - Verso do RG
  - Comprovante de Residência
  - Selfie

### Área Administrativa
- Dashboard com estatísticas
- Listagem e gestão de propostas
- Upload de tabela de fatores via CSV
- Exportação de dados (CSV/Excel)
- Configurações de integração (S3/Google Drive)
- Sistema de login com email e senha

## 🛠 Tecnologias

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS
- **shadcn/ui** - Componentes de UI
- **Wouter** - Roteamento
- **TanStack Query** - Gerenciamento de estado do servidor

### Backend
- **Node.js 22** - Runtime JavaScript
- **Express 4** - Framework web
- **tRPC 11** - API type-safe
- **Drizzle ORM** - ORM para banco de dados
- **MySQL/TiDB** - Banco de dados

### Infraestrutura
- **Vite** - Build tool
- **PM2** - Process manager
- **Nginx** - Proxy reverso

## 📦 Pré-requisitos

- Node.js 22.x ou superior
- pnpm 10.x ou superior
- MySQL 8.x ou TiDB
- Git

## 💻 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/elislecio1/don-santos-emprestimo.git
cd don-santos-emprestimo
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@host:porta/database?ssl={"rejectUnauthorized":true}

# JWT Secret (gere uma string aleatória segura)
JWT_SECRET=sua-chave-secreta-muito-segura-aqui

# Porta do servidor (opcional, padrão: 3000)
PORT=3000

# Ambiente
NODE_ENV=production
```

### 4. Criar tabelas no banco de dados

```bash
pnpm db:push
```

### 5. Popular tabela de fatores (opcional)

```bash
node scripts/seed-factors.mjs
```

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `DATABASE_URL` | URL de conexão MySQL/TiDB | ✅ |
| `JWT_SECRET` | Chave secreta para tokens JWT | ✅ |
| `PORT` | Porta do servidor (padrão: 3000) | ❌ |
| `NODE_ENV` | Ambiente (development/production) | ❌ |

### Configuração do Google Drive (Opcional)

Para armazenar documentos no Google Drive, configure na área administrativa:
1. Acesse `/admin/configuracoes`
2. Selecione "Google Drive" como provedor de armazenamento
3. Preencha as credenciais (Client ID, Client Secret, Refresh Token)

## 🚀 Execução

### Modo Desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

### Modo Produção

```bash
# Build
pnpm build

# Iniciar
pnpm start
```

### Com PM2 (Recomendado para produção)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar com PM2
pm2 start ecosystem.config.cjs

# Salvar configuração
pm2 save

# Configurar inicialização automática
pm2 startup
```

## 🌐 Deploy em Produção

### Deploy no aaPanel (don.cim.br)

Execute os seguintes comandos no terminal do aaPanel:

```bash
# 1. Navegar para o diretório do site
cd /www/wwwroot/don.cim.br

# 2. Clonar o repositório
git clone https://github.com/elislecio1/don-santos-emprestimo.git .

# 3. Instalar pnpm (se não estiver instalado)
npm install -g pnpm

# 4. Instalar dependências
pnpm install

# 5. Criar arquivo .env
cat > .env << 'EOF'
DATABASE_URL=mysql://usuario:senha@localhost:3306/don_santos?ssl={"rejectUnauthorized":false}
JWT_SECRET=sua-chave-secreta-muito-segura-aqui
NODE_ENV=production
PORT=3000
EOF

# 6. Criar tabelas no banco de dados
pnpm db:push

# 7. Popular fatores de empréstimo
node scripts/seed-factors.mjs

# 8. Build do projeto
pnpm build

# 9. Instalar PM2 globalmente
npm install -g pm2

# 10. Iniciar com PM2
pm2 start ecosystem.config.cjs

# 11. Salvar configuração do PM2
pm2 save

# 12. Configurar inicialização automática
pm2 startup
```

### Configuração do Nginx

Adicione a seguinte configuração no Nginx do aaPanel:

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
```

## 📁 Estrutura do Projeto

```
don-santos-emprestimo/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   │   ├── admin/      # Páginas administrativas
│   │   │   └── ...         # Páginas públicas
│   │   ├── lib/            # Utilitários e configurações
│   │   └── App.tsx         # Componente raiz
│   └── index.html
├── server/                 # Backend Express/tRPC
│   ├── _core/              # Core do framework
│   ├── services/           # Serviços (Google Drive, Storage)
│   ├── db.ts               # Funções de banco de dados
│   └── routers.ts          # Rotas tRPC
├── drizzle/                # Schema e migrações
│   └── schema.ts           # Definição das tabelas
├── data/                   # Dados de seed
│   └── fatores_inss.csv    # Tabela de fatores
├── scripts/                # Scripts utilitários
│   └── seed-factors.mjs    # Script para popular fatores
├── ecosystem.config.cjs    # Configuração PM2
├── nginx.conf.example      # Exemplo de configuração Nginx
└── package.json
```

## 🔌 API Endpoints

A API utiliza tRPC. Principais procedures:

### Públicas
- `factors.getPrazos` - Lista prazos disponíveis
- `factors.getFactor` - Obtém fator por prazo e dia
- `simulation.calculateFromParcela` - Calcula empréstimo pela parcela
- `simulation.calculateFromEmprestimo` - Calcula parcela pelo empréstimo
- `proposals.create` - Cria nova proposta
- `proposals.uploadDocument` - Upload de documento

### Administrativas (requer autenticação)
- `adminAuth.login` - Login administrativo
- `adminAuth.me` - Dados do admin logado
- `proposals.getAll` - Lista todas as propostas
- `proposals.getById` - Detalhes de uma proposta
- `proposals.updateStatus` - Atualiza status da proposta
- `factors.uploadCSV` - Upload de tabela de fatores
- `settings.get/set` - Configurações do sistema

## 🔐 Credenciais de Administrador

### Acesso Padrão

| Campo | Valor |
|-------|-------|
| **URL** | `/admin/login` |
| **Email** | `elislecio@gmail.com` |
| **Senha** | `rosy87` |

> ⚠️ **Importante:** Altere a senha padrão após o primeiro acesso em produção!

### Criar Novo Administrador

Para criar um novo administrador, execute no banco de dados:

```sql
INSERT INTO admin_users (email, passwordHash, name, isActive)
VALUES (
  'novo@email.com',
  SHA2(CONCAT('nova-senha', 'don-santos-salt-2024'), 256),
  'Nome do Admin',
  1
);
```

## 📄 Licença

Este projeto é proprietário da Don Santos Correspondente Bancário.

---

**Desenvolvido com ❤️ para Don Santos Correspondente Bancário**
