/**
 * Script para inserir fatores de empréstimo no banco de dados
 * Executar com: node scripts/seed-factors.mjs
 */

import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL não configurada');
  process.exit(1);
}

async function seedFactors() {
  console.log('Conectando ao banco de dados...');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  // Read CSV file
  const csvPath = './data/fatores_inss.csv';
  const csvContent = readFileSync(csvPath, 'utf-8');
  const lines = csvContent.trim().split('\n');
  
  // Skip header
  const dataLines = lines.slice(1);
  
  console.log(`Processando ${dataLines.length} registros...`);
  
  // Delete existing factors
  await connection.execute('DELETE FROM loan_factors');
  console.log('Fatores existentes removidos.');
  
  // Insert new factors in batches
  const batchSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < dataLines.length; i += batchSize) {
    const batch = dataLines.slice(i, i + batchSize);
    const values = batch.map(line => {
      const [prazo, dia, fator] = line.split(',');
      return `(${prazo}, ${dia}, '${fator}')`;
    }).join(', ');
    
    await connection.execute(
      `INSERT INTO loan_factors (prazo, dia, fator) VALUES ${values}`
    );
    
    inserted += batch.length;
    console.log(`Inseridos ${inserted}/${dataLines.length} registros...`);
  }
  
  console.log('✅ Fatores inseridos com sucesso!');
  
  // Verify
  const [rows] = await connection.execute('SELECT COUNT(*) as count FROM loan_factors');
  console.log(`Total de fatores no banco: ${rows[0].count}`);
  
  await connection.end();
}

seedFactors().catch(console.error);
