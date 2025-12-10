# Guia de Instalação - Windows

## 1. Instalar MySQL

### Opção A: MySQL Installer (Recomendado)
1. Baixe o MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Execute o instalador
3. Escolha "Developer Default" ou "Server only"
4. Durante a instalação, defina:
   - **Root Password**: `password` (ou anote a senha que você escolher)
   - **Port**: `3306` (padrão)
5. Complete a instalação

### Opção B: XAMPP (Mais fácil para desenvolvimento)
1. Baixe o XAMPP: https://www.apachefriends.org/
2. Instale o XAMPP
3. Abra o XAMPP Control Panel
4. Inicie o MySQL clicando em "Start"

## 2. Verificar MySQL

Abra o PowerShell e execute:
```powershell
# Se instalou via MySQL Installer, adicione ao PATH ou use o caminho completo
mysql --version

# Ou se instalou via XAMPP
C:\xampp\mysql\bin\mysql.exe --version
```

## 3. Criar Banco de Dados

Execute no MySQL:
```sql
CREATE DATABASE don_santos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ou via linha de comando:
```powershell
# Com MySQL no PATH
mysql -u root -p -e "CREATE DATABASE don_santos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Ou com XAMPP
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE don_santos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 4. Configurar .env

Edite o arquivo `.env` e ajuste a `DATABASE_URL`:
```env
DATABASE_URL=mysql://root:password@localhost:3306/don_santos_db
```

**Substitua `password` pela senha do seu MySQL root.**

## 5. Executar Migrações e Seeds

```powershell
# Criar tabelas
pnpm db:push

# Popular fatores INSS
node scripts/seed-factors.mjs

# Criar usuário admin master
node scripts/seed-admin.mjs
```

## 6. Iniciar Servidor

```powershell
pnpm dev
```

O servidor estará disponível em: http://localhost:3001 (ou porta disponível)

## 7. Acessar Área Admin

1. Acesse: http://localhost:3001/admin
2. Faça login com:
   - **Email**: elislecio@gmail.com
   - **Senha**: rosy87

