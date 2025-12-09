import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllLoanFactors: vi.fn().mockResolvedValue([
    { id: 1, prazo: 12, dia: 1, fator: "0.09500" },
    { id: 2, prazo: 12, dia: 2, fator: "0.09510" },
    { id: 3, prazo: 24, dia: 1, fator: "0.05200" },
  ]),
  getLoanFactorByPrazoAndDia: vi.fn().mockImplementation(async (prazo: number, dia: number) => {
    const factors: Record<string, { prazo: number; dia: number; fator: string }> = {
      "12-1": { prazo: 12, dia: 1, fator: "0.09500" },
      "12-2": { prazo: 12, dia: 2, fator: "0.09510" },
      "24-1": { prazo: 24, dia: 1, fator: "0.05200" },
    };
    return factors[`${prazo}-${dia}`] || null;
  }),
  getAvailablePrazos: vi.fn().mockResolvedValue([12, 24, 36, 48, 60]),
  bulkInsertLoanFactors: vi.fn().mockResolvedValue(undefined),
  deleteLoanFactor: vi.fn().mockResolvedValue(undefined),
  createProposal: vi.fn().mockResolvedValue(1),
  getAllProposals: vi.fn().mockResolvedValue([
    {
      id: 1,
      nomeCompleto: "João Silva",
      cpf: "123.456.789-00",
      valorEmprestimo: "10000.00",
      valorParcela: "950.00",
      prazo: 12,
      status: "pendente",
      createdAt: new Date(),
    },
  ]),
  getProposalById: vi.fn().mockImplementation(async (id: number) => {
    if (id === 1) {
      return {
        id: 1,
        nomeCompleto: "João Silva",
        cpf: "123.456.789-00",
        valorEmprestimo: "10000.00",
        valorParcela: "950.00",
        prazo: 12,
        fatorUtilizado: "0.09500",
        dataNascimento: "01/01/1990",
        rgOuCnh: "12345678",
        filiacao: "Maria Silva",
        telefone: "(11) 99999-9999",
        cep: "01234-567",
        logradouro: "Rua Teste",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        banco: "001",
        agencia: "1234",
        conta: "12345-6",
        tipoConta: "corrente",
        status: "pendente",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }),
  updateProposalStatus: vi.fn().mockResolvedValue(undefined),
  updateProposalDocuments: vi.fn().mockResolvedValue(undefined),
  getProposalStats: vi.fn().mockResolvedValue({
    total: 10,
    pendentes: 5,
    emAnalise: 2,
    aprovados: 2,
    recusados: 1,
  }),
  getSetting: vi.fn().mockResolvedValue(undefined),
  setSetting: vi.fn().mockResolvedValue(undefined),
  getAllSettings: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

// Mock storage services
vi.mock("./services/storageService", () => ({
  uploadBase64Document: vi.fn().mockResolvedValue({ success: true, url: "https://example.com/doc.jpg" }),
  createClientFolder: vi.fn().mockResolvedValue({ success: true, folderId: "folder123" }),
  getStorageProvider: vi.fn().mockResolvedValue("s3"),
  getStorageStatus: vi.fn().mockResolvedValue({ provider: "s3", configured: true }),
}));

vi.mock("./services/googleDrive", () => ({
  testGoogleDriveConnection: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://s3.example.com/file.jpg", key: "file.jpg" }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("factors procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPrazos returns available prazos", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.factors.getPrazos();

    expect(result).toEqual([12, 24, 36, 48, 60]);
  });

  it("getFactor returns factor for valid prazo and dia", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.factors.getFactor({ prazo: 12, dia: 1 });

    expect(result).toEqual({ prazo: 12, dia: 1, fator: "0.09500" });
  });

  it("getFactor throws error for invalid prazo/dia", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.factors.getFactor({ prazo: 99, dia: 99 })).rejects.toThrow(
      "Fator não encontrado"
    );
  });

  it("getAll returns all factors", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.factors.getAll();

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty("prazo");
    expect(result[0]).toHaveProperty("dia");
    expect(result[0]).toHaveProperty("fator");
  });
});

describe("simulation procedures", () => {
  it("calculateFromParcela calculates loan value correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.calculateFromParcela({
      valorParcela: 950,
      prazo: 12,
      dia: 1,
    });

    // 950 / 0.095 = 10000
    expect(result.valorEmprestimo).toBe(10000);
    expect(result.valorParcela).toBe(950);
    expect(result.prazo).toBe(12);
    expect(result.fator).toBe("0.09500");
  });

  it("calculateFromEmprestimo calculates installment correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulation.calculateFromEmprestimo({
      valorEmprestimo: 10000,
      prazo: 12,
      dia: 1,
    });

    // 10000 * 0.095 = 950
    expect(result.valorParcela).toBe(950);
    expect(result.valorEmprestimo).toBe(10000);
    expect(result.prazo).toBe(12);
    expect(result.fator).toBe("0.09500");
  });
});

describe("proposals procedures", () => {
  it("create creates a new proposal", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.proposals.create({
      valorEmprestimo: "10000.00",
      valorParcela: "950.00",
      prazo: 12,
      fatorUtilizado: "0.09500",
      nomeCompleto: "João Silva",
      cpf: "123.456.789-00",
      dataNascimento: "01/01/1990",
      rgOuCnh: "12345678",
      filiacao: "Maria Silva",
      telefone: "(11) 99999-9999",
      cep: "01234-567",
      logradouro: "Rua Teste",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      banco: "001",
      agencia: "1234",
      conta: "12345-6",
      tipoConta: "corrente",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe(1);
  });

  it("getAll requires admin access", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.proposals.getAll()).rejects.toThrow();
  });

  it("getAll returns proposals for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.proposals.getAll();

    expect(result).toHaveLength(1);
    expect(result[0].nomeCompleto).toBe("João Silva");
  });

  it("getById returns proposal details for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.proposals.getById({ id: 1 });

    expect(result.id).toBe(1);
    expect(result.nomeCompleto).toBe("João Silva");
    expect(result.cpf).toBe("123.456.789-00");
  });

  it("getById throws error for non-existent proposal", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.proposals.getById({ id: 999 })).rejects.toThrow(
      "Proposta não encontrada"
    );
  });

  it("getStats returns statistics for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.proposals.getStats();

    expect(result.total).toBe(10);
    expect(result.pendentes).toBe(5);
    expect(result.emAnalise).toBe(2);
    expect(result.aprovados).toBe(2);
    expect(result.recusados).toBe(1);
  });
});

describe("storage procedures", () => {
  it("getStatus returns storage configuration for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.storage.getStatus();

    expect(result.provider).toBe("s3");
    expect(result.configured).toBe(true);
  });

  it("testGoogleDrive tests connection for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.storage.testGoogleDrive();

    expect(result.success).toBe(true);
  });
});
