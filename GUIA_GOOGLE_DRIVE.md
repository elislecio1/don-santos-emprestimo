# Guia Completo: Configuração do Google Drive API

Este guia explica passo a passo como obter as credenciais necessárias para integrar o Google Drive ao sistema.

---

## 📋 O que você vai precisar:

1. **Client ID** (ex: `xxxxx.apps.googleusercontent.com`)
2. **Client Secret** (ex: `GOCSPX-XXXXX`)
3. **Refresh Token** (ex: `1//xxxxx`)

---

## 🚀 Passo 1: Acessar o Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google (a mesma que você quer usar para armazenar os documentos)

---

## 🚀 Passo 2: Criar ou Selecionar um Projeto

1. No topo da página, clique no dropdown do projeto (ao lado do logo do Google Cloud)
2. Clique em **"Novo Projeto"** (New Project)
3. Preencha:
   - **Nome do projeto:** `DS PROMOTORA - Documentos` (ou outro nome de sua preferência)
   - **Organização:** (deixe padrão se não tiver)
4. Clique em **"Criar"**
5. Aguarde alguns segundos e selecione o projeto recém-criado

---

## 🚀 Passo 3: Ativar a Google Drive API

1. No menu lateral esquerdo, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Na barra de pesquisa, digite: **"Google Drive API"**
3. Clique no resultado **"Google Drive API"**
4. Clique no botão **"ATIVAR"** (Enable)
5. Aguarde alguns segundos até aparecer "API habilitada"

---

## 🚀 Passo 4: Criar Credenciais OAuth 2.0

1. No menu lateral, vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"** (Create Credentials)
3. Selecione **"ID do cliente OAuth"** (OAuth client ID)

### 4.1. Configurar a Tela de Consentimento (se for a primeira vez)

Se aparecer um aviso sobre configurar a tela de consentimento:

1. Clique em **"CONFIGURAR TELA DE CONSENTIMENTO"**
2. Selecione **"Externo"** (External) e clique em **"CRIAR"**
3. Preencha os campos obrigatórios:
   - **Nome do app:** `DS PROMOTORA`
   - **Email de suporte do usuário:** Seu email
   - **Email de contato do desenvolvedor:** Seu email
4. Clique em **"SALVAR E CONTINUAR"**
5. Na próxima tela (Escopos), clique em **"SALVAR E CONTINUAR"**
6. Na tela de usuários de teste, adicione seu próprio email e clique em **"SALVAR E CONTINUAR"**
7. Na última tela, clique em **"VOLTAR AO PAINEL"**

### 4.2. Criar o ID do Cliente

1. Volte em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"** → **"ID do cliente OAuth"**
3. Preencha:
   - **Tipo de aplicativo:** Selecione **"Aplicativo da Web"** (Web application)
   - **Nome:** `DS PROMOTORA - Web Client`
   - **URIs de redirecionamento autorizados:** Adicione:
     ```
     https://developers.google.com/oauthplayground
     ```
4. Clique em **"CRIAR"**
5. **IMPORTANTE:** Copie e salve:
   - **Client ID** (ex: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (ex: `GOCSPX-abc123xyz`)
   - ⚠️ **Você só verá o Client Secret uma vez!** Anote em local seguro.

---

## 🚀 Passo 5: Obter o Refresh Token via OAuth Playground

1. Acesse: https://developers.google.com/oauthplayground/
2. No canto superior direito, clique no ícone de **engrenagem (⚙️)**
3. Marque a opção: **"Use your own OAuth credentials"**
4. Cole:
   - **OAuth Client ID:** (o Client ID que você copiou)
   - **OAuth Client secret:** (o Client Secret que você copiou)
5. Clique em **"Close"**

### 5.1. Autorizar Escopos

1. No painel esquerdo, procure por **"Drive API v3"**
2. Marque os escopos:
   - ✅ `https://www.googleapis.com/auth/drive.file` (Criar, editar e excluir apenas arquivos criados por este app)
   - ✅ `https://www.googleapis.com/auth/drive` (Acesso completo ao Google Drive) - **Recomendado para mais controle**
3. Clique em **"Authorize APIs"**
4. Faça login com sua conta Google
5. Clique em **"Allow"** (Permitir) para dar as permissões

### 5.2. Obter o Refresh Token

1. Após autorizar, você verá um código de autorização no painel direito
2. Clique em **"Exchange authorization code for tokens"**
3. Você verá algo como:
   ```json
   {
     "access_token": "ya29.a0...",
     "refresh_token": "1//0g...",  ← ESTE É O QUE VOCÊ PRECISA!
     "scope": "...",
     "token_type": "Bearer",
     "expires_in": 3599
   }
   ```
4. **Copie o valor de `refresh_token`** (ex: `1//0gabc123xyz...`)

---

## ✅ Passo 6: Configurar no Sistema

Agora você tem todas as credenciais! Vá na área administrativa do sistema:

1. Acesse: `http://www.don.cim.br/admin/configuracoes`
2. Faça login
3. Vá na seção **"Configuração do Google Drive"**
4. Cole as credenciais:
   - **Client ID:** (ex: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret:** (ex: `GOCSPX-abc123xyz`)
   - **Refresh Token:** (ex: `1//0gabc123xyz...`)
   - **ID da Pasta (opcional):** Deixe vazio para criar automaticamente
5. Clique em **"Salvar"** ou **"Testar Conexão"**

---

## 🔒 Segurança

- ⚠️ **Nunca compartilhe** suas credenciais
- ⚠️ **Client Secret** só aparece uma vez - guarde em local seguro
- ⚠️ **Refresh Token** é sensível - trate como senha
- ✅ Use apenas em servidores seguros
- ✅ Considere usar variáveis de ambiente para produção

---

## 🆘 Problemas Comuns

### "Error 400: redirect_uri_mismatch"
- Verifique se adicionou `https://developers.google.com/oauthplayground` nas URIs de redirecionamento

### "Access blocked: This app's request is invalid"
- Verifique se adicionou seu email como "usuário de teste" na tela de consentimento

### "Refresh token não funciona"
- O refresh token pode expirar se não for usado por 6 meses
- Gere um novo seguindo o Passo 5

---

## 📚 Links Úteis

- Google Cloud Console: https://console.cloud.google.com/
- OAuth Playground: https://developers.google.com/oauthplayground/
- Documentação Google Drive API: https://developers.google.com/drive/api

---

**Pronto!** Agora você pode armazenar documentos dos clientes diretamente no Google Drive. 🎉

