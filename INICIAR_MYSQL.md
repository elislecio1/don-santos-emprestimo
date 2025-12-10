# Como Iniciar o MySQL

## Opção 1: Instalar como Serviço (Recomendado)

1. **Abra o PowerShell como Administrador:**
   - Clique com botão direito no menu Iniciar
   - Selecione "Windows PowerShell (Admin)" ou "Terminal (Admin)"

2. **Execute os comandos:**
   ```powershell
   cd "C:\Program Files\MySQL\MySQL Server 8.4\bin"
   .\mysqld.exe --install MySQL84
   net start MySQL84
   ```

3. **Configure a senha do root (se necessário):**
   ```powershell
   .\mysql.exe -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';"
   ```

## Opção 2: Usar XAMPP (Mais Fácil)

Se preferir uma solução mais simples para desenvolvimento:

1. **Instale o XAMPP:**
   ```powershell
   winget install ApacheFriends.Xampp.8.2
   ```

2. **Inicie o XAMPP Control Panel**

3. **Clique em "Start" ao lado do MySQL**

4. **Ajuste o .env:**
   ```
   DATABASE_URL=mysql://root:@localhost:3306/don_santos_db
   ```
   (sem senha, que é o padrão do XAMPP)

## Opção 3: Iniciar Manualmente (Sem Serviço)

Para desenvolvimento rápido, você pode iniciar o MySQL manualmente:

```powershell
cd "C:\Program Files\MySQL\MySQL Server 8.4\bin"
.\mysqld.exe --console
```

Deixe essa janela aberta enquanto desenvolve.

## Após Iniciar o MySQL

Execute os comandos de setup:

```powershell
# Criar banco de dados
mysql -u root -p -e "CREATE DATABASE don_santos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Executar migrações
pnpm db:push

# Popular fatores
node scripts/seed-factors.mjs

# Criar usuário admin
node scripts/seed-admin.mjs
```

