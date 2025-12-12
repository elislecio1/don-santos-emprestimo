import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, loanFactors, InsertLoanFactor, LoanFactor, proposals, InsertProposal, Proposal, settings, InsertSetting, adminUsers, AdminUser, InsertAdminUser } from "../drizzle/schema";
import { createHash } from "crypto";

// Simple password hashing (for production, use bcrypt)
function hashPassword(password: string): string {
  return createHash("sha256").update(password + "don-santos-salt-2024").digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ LOAN FACTORS FUNCTIONS ============

export async function getAllLoanFactors(): Promise<LoanFactor[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(loanFactors).orderBy(asc(loanFactors.prazo), asc(loanFactors.dia));
}

export async function getLoanFactorByPrazoAndDia(prazo: number, dia: number): Promise<LoanFactor | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(loanFactors)
    .where(and(eq(loanFactors.prazo, prazo), eq(loanFactors.dia, dia)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAvailablePrazos(): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.selectDistinct({ prazo: loanFactors.prazo })
    .from(loanFactors)
    .orderBy(asc(loanFactors.prazo));
  
  return result.map(r => r.prazo);
}

export async function upsertLoanFactor(factor: InsertLoanFactor): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(loanFactors).values(factor).onDuplicateKeyUpdate({
    set: {
      fator: factor.fator,
      updatedAt: new Date(),
    },
  });
}

export async function bulkInsertLoanFactors(factors: InsertLoanFactor[]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete all existing factors first
  await db.delete(loanFactors);
  
  // Insert new factors in batches
  const batchSize = 100;
  for (let i = 0; i < factors.length; i += batchSize) {
    const batch = factors.slice(i, i + batchSize);
    await db.insert(loanFactors).values(batch);
  }
}

export async function deleteLoanFactor(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(loanFactors).where(eq(loanFactors.id, id));
}

export async function deleteManyLoanFactors(ids: number[]): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (ids.length === 0) return 0;
  
  const result = await db.delete(loanFactors).where(inArray(loanFactors.id, ids));
  return ids.length;
}

// ============ PROPOSALS FUNCTIONS ============

export async function createProposal(proposal: InsertProposal): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(proposals).values(proposal);
  return result[0].insertId;
}

export async function getAllProposals(): Promise<Proposal[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(proposals).orderBy(desc(proposals.createdAt));
}

export async function getProposalById(id: number): Promise<Proposal | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateProposalStatus(id: number, status: "pendente" | "em_analise" | "aprovado" | "recusado", observacoes?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: Record<string, unknown> = { status };
  if (observacoes !== undefined) {
    updateData.observacoes = observacoes;
  }
  
  await db.update(proposals).set(updateData).where(eq(proposals.id, id));
}

export async function updateProposalDocuments(id: number, documents: {
  rgFrenteUrl?: string;
  rgVersoUrl?: string;
  comprovanteResidenciaUrl?: string;
  selfieUrl?: string;
  googleDriveFolderId?: string;
  googleDriveFolderUrl?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(proposals).set(documents).where(eq(proposals.id, id));
}

export async function getProposalStats(): Promise<{
  total: number;
  pendentes: number;
  emAnalise: number;
  aprovados: number;
  recusados: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, pendentes: 0, emAnalise: 0, aprovados: 0, recusados: 0 };
  
  const all = await db.select().from(proposals);
  
  return {
    total: all.length,
    pendentes: all.filter(p => p.status === "pendente").length,
    emAnalise: all.filter(p => p.status === "em_analise").length,
    aprovados: all.filter(p => p.status === "aprovado").length,
    recusados: all.filter(p => p.status === "recusado").length,
  };
}

// ============ SETTINGS FUNCTIONS ============

export async function getSetting(key: string): Promise<string | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0].value : undefined;
}

export async function setSetting(key: string, value: string, description?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(settings).values({ key, value, description }).onDuplicateKeyUpdate({
    set: { value, description, updatedAt: new Date() },
  });
}

export async function getAllSettings(): Promise<{ key: string; value: string; description: string | null }[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    key: settings.key,
    value: settings.value,
    description: settings.description,
  }).from(settings);
  
  return result;
}


// ============ ADMIN USERS FUNCTIONS ============

export async function createAdminUser(email: string, password: string, name?: string): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const passwordHash = hashPassword(password);
  const result = await db.insert(adminUsers).values({
    email,
    passwordHash,
    name,
  });
  
  return result[0].insertId;
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function validateAdminLogin(email: string, password: string): Promise<AdminUser | null> {
  const admin = await getAdminUserByEmail(email);
  if (!admin || !admin.isActive) return null;
  
  if (!verifyPassword(password, admin.passwordHash)) return null;
  
  // Update last signed in
  const db = await getDb();
  if (db) {
    await db.update(adminUsers).set({ lastSignedIn: new Date() }).where(eq(adminUsers.id, admin.id));
  }
  
  return admin;
}

export async function ensureMasterAdminExists(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  const masterEmail = "elislecio@gmail.com";
  const existing = await getAdminUserByEmail(masterEmail);
  
  if (!existing) {
    await createAdminUser(masterEmail, "rosy87", "Administrador Master");
    console.log("[Admin] Master admin user created: " + masterEmail);
  }
}

// Call this on startup
ensureMasterAdminExists().catch(console.error);
