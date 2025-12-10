import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de fatores de empréstimo
 * Cada linha representa um fator para um prazo específico e dia
 */
export const loanFactors = mysqlTable("loan_factors", {
  id: int("id").autoincrement().primaryKey(),
  prazo: int("prazo").notNull(), // Número de parcelas (ex: 12, 24, 36, 48, 60, 72, 84)
  dia: int("dia").notNull(), // Dia do mês (1-31)
  fator: varchar("fator", { length: 20 }).notNull(), // Fator como string para precisão decimal
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoanFactor = typeof loanFactors.$inferSelect;
export type InsertLoanFactor = typeof loanFactors.$inferInsert;

/**
 * Tabela de propostas/leads
 * Armazena todas as informações do cliente e da simulação
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  
  // Dados da simulação
  valorEmprestimo: varchar("valorEmprestimo", { length: 20 }).notNull(),
  valorParcela: varchar("valorParcela", { length: 20 }).notNull(),
  prazo: int("prazo").notNull(),
  fatorUtilizado: varchar("fatorUtilizado", { length: 20 }).notNull(),
  
  // Dados pessoais
  nomeCompleto: varchar("nomeCompleto", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull(), // 000.000.000-00
  dataNascimento: varchar("dataNascimento", { length: 10 }).notNull(), // DD/MM/YYYY
  rgOuCnh: varchar("rgOuCnh", { length: 30 }).notNull(),
  filiacao: varchar("filiacao", { length: 255 }).notNull(), // Nome da mãe
  telefone: varchar("telefone", { length: 20 }).notNull(),
  
  // Endereço
  cep: varchar("cep", { length: 10 }).notNull(),
  logradouro: varchar("logradouro", { length: 255 }).notNull(),
  numero: varchar("numero", { length: 20 }).notNull(),
  complemento: varchar("complemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }).notNull(),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  estado: varchar("estado", { length: 2 }).notNull(),
  
  // Dados bancários
  banco: varchar("banco", { length: 100 }).notNull(),
  agencia: varchar("agencia", { length: 20 }).notNull(),
  conta: varchar("conta", { length: 30 }).notNull(),
  tipoConta: mysqlEnum("tipoConta", ["corrente", "poupanca"]).default("corrente").notNull(),
  
  // URLs dos documentos (armazenados no Google Drive ou S3)
  rgFrenteUrl: text("rgFrenteUrl"),
  rgVersoUrl: text("rgVersoUrl"),
  comprovanteResidenciaUrl: text("comprovanteResidenciaUrl"),
  selfieUrl: text("selfieUrl"),
  
  // Pasta do Google Drive
  googleDriveFolderId: varchar("googleDriveFolderId", { length: 100 }),
  googleDriveFolderUrl: text("googleDriveFolderUrl"),
  
  // Status e metadados
  status: mysqlEnum("status", ["pendente", "em_analise", "aprovado", "recusado"]).default("pendente").notNull(),
  observacoes: text("observacoes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * Tabela de configurações do sistema
 */
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

/**
 * Tabela de usuários administrativos
 * Sistema de login simples com email e senha
 */
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
