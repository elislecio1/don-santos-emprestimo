/**
 * Script para criar usuário administrador
 * Executar com: node scripts/seed-admin.mjs
 */

import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { createHash } from 'crypto';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL não configurada');
  process.exit(1);
}

// Simple password hashing (same as in server/db.ts)
function hashPassword(password) {
  return createHash('sha256').update(password + 'don-santos-salt-2024').digest('hex');
}

async function seedAdmin() {
  console.log('Conectando ao banco de dados...');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  const email = 'elislecio@gmail.com';
  const password = 'rosy87';
  const name = 'Master Admin';
  
  console.log(`Criando usuário admin: ${email}`);
  
  // Check if admin already exists
  const [existing] = await connection.execute(
    'SELECT id FROM admin_users WHERE email = ?',
    [email]
  );
  
  if (existing.length > 0) {
    console.log('⚠️  Usuário admin já existe. Atualizando senha...');
    const passwordHash = hashPassword(password);
    await connection.execute(
      'UPDATE admin_users SET passwordHash = ?, name = ?, isActive = 1 WHERE email = ?',
      [passwordHash, name, email]
    );
    console.log('✅ Senha do usuário admin atualizada!');
  } else {
    const passwordHash = hashPassword(password);
    await connection.execute(
      'INSERT INTO admin_users (email, passwordHash, name, isActive) VALUES (?, ?, ?, 1)',
      [email, passwordHash, name]
    );
    console.log('✅ Usuário admin criado com sucesso!');
  }
  
  // Verify
  const [rows] = await connection.execute(
    'SELECT id, email, name, isActive FROM admin_users WHERE email = ?',
    [email]
  );
  console.log('Usuário criado:', rows[0]);
  
  await connection.end();
}

seedAdmin().catch(console.error);

