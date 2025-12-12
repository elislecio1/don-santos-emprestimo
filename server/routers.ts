import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getAllLoanFactors,
  getLoanFactorByPrazoAndDia,
  getAvailablePrazos,
  bulkInsertLoanFactors,
  deleteLoanFactor,
  deleteManyLoanFactors,
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposalStatus,
  updateProposalDocuments,
  getProposalStats,
  getSetting,
  setSetting,
  getAllSettings,
  validateAdminLogin,
  getAdminUserByEmail,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import {
  uploadBase64Document,
  createClientFolder,
  getStorageProvider,
  getStorageStatus,
} from "./services/storageService";
import { testGoogleDriveConnection } from "./services/googleDrive";
import { SignJWT, jwtVerify } from "jose";

const ADMIN_COOKIE_NAME = "don_santos_admin_session";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "don-santos-secret-key-2024");

// Create admin JWT token
async function createAdminToken(adminId: number, email: string): Promise<string> {
  return await new SignJWT({ adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// Verify admin JWT token
async function verifyAdminToken(token: string): Promise<{ adminId: number; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { adminId: payload.adminId as number, email: payload.email as string };
  } catch {
    return null;
  }
}

// Admin procedure - checks for admin session cookie
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const cookies = ctx.req.headers.cookie || "";
  const adminCookie = cookies.split(";").find(c => c.trim().startsWith(ADMIN_COOKIE_NAME + "="));
  
  if (!adminCookie) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão expirada. Faça login novamente." });
  }
  
  const token = adminCookie.split("=")[1];
  const adminData = await verifyAdminToken(token);
  
  if (!adminData) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sessão inválida. Faça login novamente." });
  }
  
  const admin = await getAdminUserByEmail(adminData.email);
  if (!admin || !admin.isActive) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário não encontrado ou inativo." });
  }
  
  return next({ ctx: { ...ctx, admin } });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ ADMIN AUTH ============
  adminAuth: router({
    // Login with email and password
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const admin = await validateAdminLogin(input.email, input.password);
        
        if (!admin) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou senha inválidos." });
        }
        
        const token = await createAdminToken(admin.id, admin.email);
        
        // Set cookie
        ctx.res.cookie(ADMIN_COOKIE_NAME, token, {
          httpOnly: true,
          secure: ctx.req.protocol === "https",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: "/",
        });
        
        return {
          success: true,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          },
        };
      }),

    // Check if logged in
    me: publicProcedure.query(async ({ ctx }) => {
      const cookies = ctx.req.headers.cookie || "";
      const adminCookie = cookies.split(";").find(c => c.trim().startsWith(ADMIN_COOKIE_NAME + "="));
      
      if (!adminCookie) {
        return null;
      }
      
      const token = adminCookie.split("=")[1];
      const adminData = await verifyAdminToken(token);
      
      if (!adminData) {
        return null;
      }
      
      const admin = await getAdminUserByEmail(adminData.email);
      if (!admin || !admin.isActive) {
        return null;
      }
      
      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      };
    }),

    // Logout
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, {
        httpOnly: true,
        secure: ctx.req.protocol === "https",
        sameSite: "lax",
        path: "/",
      });
      return { success: true };
    }),
  }),

  // ============ LOAN FACTORS ============
  factors: router({
    // Public: Get all available prazos
    getPrazos: publicProcedure.query(async () => {
      return await getAvailablePrazos();
    }),

    // Public: Get factor for specific prazo and dia
    getFactor: publicProcedure
      .input(z.object({ prazo: z.number(), dia: z.number() }))
      .query(async ({ input }) => {
        const factor = await getLoanFactorByPrazoAndDia(input.prazo, input.dia);
        if (!factor) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Fator não encontrado para este prazo e dia." });
        }
        return factor;
      }),

    // Public: Get all factors (for simulation)
    getAll: publicProcedure.query(async () => {
      return await getAllLoanFactors();
    }),

    // Admin: Upload CSV with factors
    uploadCSV: adminProcedure
      .input(z.object({
        csvContent: z.string(),
      }))
      .mutation(async ({ input }) => {
        const lines = input.csvContent.trim().split("\n");
        const factors: { prazo: number; dia: number; fator: string }[] = [];
        
        // Skip header line if present
        const startIndex = lines[0].toLowerCase().includes("prazo") ? 1 : 0;
        
        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const parts = line.split(/[,;]/);
          if (parts.length >= 3) {
            const prazo = parseInt(parts[0].trim());
            const dia = parseInt(parts[1].trim());
            const fator = parts[2].trim().replace(",", ".");
            
            if (!isNaN(prazo) && !isNaN(dia) && fator) {
              factors.push({ prazo, dia, fator });
            }
          }
        }
        
        if (factors.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Nenhum fator válido encontrado no CSV." });
        }
        
        await bulkInsertLoanFactors(factors);
        return { imported: factors.length };
      }),

    // Admin: Delete factor
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteLoanFactor(input.id);
        return { success: true };
      }),

    // Admin: Delete multiple factors
    deleteMany: adminProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .mutation(async ({ input }) => {
        if (input.ids.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Nenhum fator selecionado." });
        }
        const deleted = await deleteManyLoanFactors(input.ids);
        return { success: true, deleted };
      }),
  }),

  // ============ SIMULATION ============
  simulation: router({
    // Calculate loan value from parcela
    calculateFromParcela: publicProcedure
      .input(z.object({
        valorParcela: z.number().positive(),
        prazo: z.number().positive(),
        dia: z.number().min(1).max(31),
      }))
      .query(async ({ input }) => {
        const factor = await getLoanFactorByPrazoAndDia(input.prazo, input.dia);
        if (!factor) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Fator não encontrado." });
        }
        
        const fatorNum = parseFloat(factor.fator);
        const valorEmprestimo = input.valorParcela / fatorNum;
        
        return {
          valorEmprestimo: Math.round(valorEmprestimo * 100) / 100,
          valorParcela: input.valorParcela,
          prazo: input.prazo,
          fator: factor.fator,
        };
      }),

    // Calculate parcela from loan value
    calculateFromEmprestimo: publicProcedure
      .input(z.object({
        valorEmprestimo: z.number().positive(),
        prazo: z.number().positive(),
        dia: z.number().min(1).max(31),
      }))
      .query(async ({ input }) => {
        const factor = await getLoanFactorByPrazoAndDia(input.prazo, input.dia);
        if (!factor) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Fator não encontrado." });
        }
        
        const fatorNum = parseFloat(factor.fator);
        const valorParcela = input.valorEmprestimo * fatorNum;
        
        return {
          valorEmprestimo: input.valorEmprestimo,
          valorParcela: Math.round(valorParcela * 100) / 100,
          prazo: input.prazo,
          fator: factor.fator,
        };
      }),
  }),

  // ============ PROPOSALS ============
  proposals: router({
    // Public: Create new proposal (no auth required)
    create: publicProcedure
      .input(z.object({
        // Simulation data
        valorEmprestimo: z.string(),
        valorParcela: z.string(),
        prazo: z.number(),
        fatorUtilizado: z.string(),
        
        // Personal data
        nomeCompleto: z.string().min(3),
        cpf: z.string().length(14), // 000.000.000-00
        dataNascimento: z.string(),
        rgOuCnh: z.string().min(5),
        filiacao: z.string().min(3),
        telefone: z.string().min(10),
        
        // Address
        cep: z.string(),
        logradouro: z.string(),
        numero: z.string(),
        complemento: z.string().optional(),
        bairro: z.string(),
        cidade: z.string(),
        estado: z.string().length(2),
        
        // Bank data
        banco: z.string(),
        agencia: z.string(),
        conta: z.string(),
        tipoConta: z.enum(["corrente", "poupanca"]),
      }))
      .mutation(async ({ input }) => {
        const id = await createProposal({
          ...input,
          status: "pendente",
        });
        return { id, success: true };
      }),

    // Public: Upload document for proposal
    uploadDocument: publicProcedure
      .input(z.object({
        proposalId: z.number(),
        documentType: z.enum(["rgFrente", "rgVerso", "comprovanteResidencia", "selfie"]),
        base64Data: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const proposal = await getProposalById(input.proposalId);
        if (!proposal) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Proposta não encontrada." });
        }
        
        // Create folder name from client name and CPF
        const folderName = `${proposal.nomeCompleto.toUpperCase().replace(/\s+/g, "_")}_${proposal.cpf.replace(/\D/g, "")}`;
        const fileExtension = input.mimeType.split("/")[1] || "jpg";
        const fileName = `${input.documentType}.${fileExtension}`;
        
        // Get or create client folder (for Google Drive)
        let clientFolderId = proposal.googleDriveFolderId || undefined;
        const provider = await getStorageProvider();
        
        if (provider === "google_drive" && !clientFolderId) {
          const folderResult = await createClientFolder(proposal.nomeCompleto, proposal.cpf.replace(/\D/g, ""));
          if (folderResult.success && folderResult.folderId) {
            clientFolderId = folderResult.folderId;
            await updateProposalDocuments(input.proposalId, {
              googleDriveFolderId: folderResult.folderId,
              googleDriveFolderUrl: folderResult.folderUrl,
            });
          }
        }
        
        // Upload using unified storage service
        const result = await uploadBase64Document(
          fileName,
          input.base64Data,
          input.mimeType,
          clientFolderId || folderName
        );
        
        if (!result.success) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: result.error || "Erro ao fazer upload." });
        }
        
        // Update proposal with document URL
        const updateField = {
          rgFrente: "rgFrenteUrl",
          rgVerso: "rgVersoUrl",
          comprovanteResidencia: "comprovanteResidenciaUrl",
          selfie: "selfieUrl",
        }[input.documentType];
        
        await updateProposalDocuments(input.proposalId, {
          [updateField]: result.url,
        });
        
        return { url: result.url, success: true };
      }),

    // Admin: Get all proposals
    getAll: adminProcedure.query(async () => {
      return await getAllProposals();
    }),

    // Admin: Get single proposal
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const proposal = await getProposalById(input.id);
        if (!proposal) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Proposta não encontrada." });
        }
        return proposal;
      }),

    // Admin: Update proposal status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pendente", "em_analise", "aprovado", "recusado"]),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateProposalStatus(input.id, input.status, input.observacoes);
        return { success: true };
      }),

    // Admin: Get stats
    getStats: adminProcedure.query(async () => {
      return await getProposalStats();
    }),
  }),

  // ============ SETTINGS ============
  settings: router({
    get: adminProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return await getSetting(input.key);
      }),

    set: adminProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await setSetting(input.key, input.value, input.description);
        return { success: true };
      }),

    getAll: adminProcedure.query(async () => {
      return await getAllSettings();
    }),
  }),

  // ============ STORAGE ============
  storage: router({
    // Admin: Get storage status
    getStatus: adminProcedure.query(async () => {
      return await getStorageStatus();
    }),

    // Admin: Test Google Drive connection
    testGoogleDrive: adminProcedure.mutation(async () => {
      return await testGoogleDriveConnection();
    }),
  }),
});

export type AppRouter = typeof appRouter;
