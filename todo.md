# Don Santos - Simulador de Empréstimo - TODO

## Site Institucional
- [x] Página inicial com hero section e apresentação da empresa
- [x] Seção "Quem Somos" com história e valores
- [x] Seção "Áreas de Atuação" (Empréstimo Consignado, Cartão de Crédito, Seguros)
- [x] Seção "Seja Parceiro" para cadastro de subestabelecidos
- [x] Seção "Contato" com informações e formulário
- [x] Footer com informações da empresa e links
- [x] Página de Política de Privacidade (LGPD)
- [x] Página de Termos de Serviço
- [x] Design responsivo (desktop e mobile)
- [x] Navegação principal com menu

## Simulador de Empréstimo
- [x] Interface de simulação com campos de entrada
- [x] Cálculo por valor da parcela (Parcela ÷ Fator = Valor do empréstimo)
- [x] Cálculo por valor do empréstimo (Empréstimo x Fator = Parcela)
- [x] Seleção de prazo (número de parcelas)
- [x] Exibição dos resultados da simulação
- [x] Botão para prosseguir para cadastro

## Formulário de Cadastro (Lead Page)
- [x] Dados pessoais: Nome completo
- [x] Dados pessoais: CPF
- [x] Dados pessoais: Data de nascimento
- [x] Dados pessoais: RG ou CNH
- [x] Dados pessoais: Filiação (nome da mãe)
- [x] Dados pessoais: Telefone
- [x] Dados pessoais: Endereço completo
- [x] Dados bancários: Banco, Agência, Conta
- [x] Captura de imagem: Frente do RG
- [x] Captura de imagem: Verso do RG
- [x] Captura de imagem: Comprovante de Residência
- [x] Captura de imagem: Selfie
- [x] Validação de campos obrigatórios
- [x] Confirmação de envio

## Área Administrativa
- [x] Login de administrador
- [x] Dashboard com estatísticas
- [x] Upload de CSV com tabela de fatores
- [x] Listagem de propostas/leads
- [x] Visualização detalhada de cada proposta
- [x] Exportação de dados em PDF
- [x] Exportação de dados em Excel/CSV
- [x] Gerenciamento de fatores (visualizar/editar)

## Integração com Google Drive
- [x] Configuração da API do Google Drive
- [x] Criação automática de diretórios por cliente (NOME CPF)
- [x] Upload de documentos para o diretório do cliente
- [x] Link de acesso aos documentos na proposta

## Banco de Dados
- [x] Tabela de usuários (admin)
- [x] Tabela de fatores de empréstimo
- [x] Tabela de propostas/leads
- [x] Tabela de configurações

## Deploy e Repositório
- [x] Criar repositório no GitHub
- [x] Push do código para o repositório
- [x] Script de deploy criado (deploy.sh)
- [x] Guia detalhado de deploy criado (GUIA_DEPLOY_AAPANEL.md)
- [x] Configuração de exemplo do Nginx (nginx.conf.example)
- [ ] Configurar no aaPanel (manual)
- [ ] Testar em produção

## Configurações de Integração (Admin)
- [x] Página de configurações no painel admin
- [x] Seleção de serviço de armazenamento (S3 ou Google Drive)
- [x] Formulário para credenciais do Google Drive
- [x] Formulário para credenciais S3 customizado
- [x] Teste de conexão antes de salvar
- [x] Configurações gerais da empresa (telefone, WhatsApp, e-mail)

## Sistema de Login Admin
- [x] Criar sistema de login com usuário e senha
- [x] Usuário master: elislecio@gmail.com
- [x] Página de login admin
- [x] Proteção das rotas administrativas


## Dados Iniciais
- [x] Processar planilha de fatores INSS
- [x] Cadastrar fatores no banco de dados (217 registros)

## Documentação e Deploy
- [x] README.md completo para GitHub
- [x] Script de inicialização PM2 (ecosystem.config.cjs)
- [x] Comandos de deploy para aaPanel (DEPLOY_AAPANEL_COMANDOS.md)

## Correções Deploy aaPanel
- [ ] Garantir que ecosystem.config.cjs está no repositório
- [ ] Garantir que scripts/seed-factors.mjs está no repositório
- [ ] Atualizar instruções para Node.js 20+
