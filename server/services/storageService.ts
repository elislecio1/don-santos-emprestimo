import { getSetting } from "../db";
import { storagePut } from "../storage";
import {
  uploadToGoogleDrive,
  createGoogleDriveFolder,
  getGoogleDriveConfig,
} from "./googleDrive";
import { nanoid } from "nanoid";

export interface StorageResult {
  success: boolean;
  url?: string;
  folderId?: string;
  folderUrl?: string;
  error?: string;
}

export type StorageProvider = "s3" | "google_drive" | "s3_custom";

export async function getStorageProvider(): Promise<StorageProvider> {
  const provider = await getSetting("storage_provider");
  if (provider === "google_drive" || provider === "s3_custom") {
    return provider;
  }
  return "s3"; // Default
}

/**
 * Create a folder for a client (only applicable for Google Drive)
 * For S3, we use path prefixes instead of folders
 */
export async function createClientFolder(
  clientName: string,
  cpf: string
): Promise<StorageResult> {
  const provider = await getStorageProvider();

  // Format folder name: NOME COMPLETO CPF (formatted)
  const formattedCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const folderName = `${clientName.toUpperCase()} ${formattedCpf}`;

  if (provider === "google_drive") {
    const config = await getGoogleDriveConfig();
    if (!config) {
      return { success: false, error: "Google Drive não configurado" };
    }

    const result = await createGoogleDriveFolder(folderName, config.folderId);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      folderId: result.folderId,
      folderUrl: result.webViewLink,
    };
  }

  // For S3, we don't create folders - just return success
  // The folder structure is created implicitly when uploading files
  return {
    success: true,
    folderId: folderName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, ""),
  };
}

/**
 * Upload a document to the configured storage provider
 */
export async function uploadDocument(
  fileName: string,
  fileBuffer: Buffer,
  mimeType: string,
  clientFolder?: string
): Promise<StorageResult> {
  const provider = await getStorageProvider();

  // Generate unique file name
  const uniqueId = nanoid(8);
  const extension = fileName.split(".").pop() || "bin";
  const uniqueFileName = `${fileName.replace(`.${extension}`, "")}_${uniqueId}.${extension}`;

  if (provider === "google_drive") {
    const result = await uploadToGoogleDrive(
      uniqueFileName,
      fileBuffer,
      mimeType,
      clientFolder
    );

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      url: result.webViewLink,
    };
  }

  // S3 (default or custom)
  try {
    const fileKey = clientFolder
      ? `documents/${clientFolder}/${uniqueFileName}`
      : `documents/${uniqueFileName}`;

    const { url } = await storagePut(fileKey, fileBuffer, mimeType);

    return {
      success: true,
      url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao fazer upload",
    };
  }
}

/**
 * Upload a base64 encoded document
 */
export async function uploadBase64Document(
  fileName: string,
  base64Data: string,
  mimeType: string,
  clientFolder?: string
): Promise<StorageResult> {
  // Remove data URL prefix if present
  const base64Content = base64Data.replace(/^data:[^;]+;base64,/, "");
  const fileBuffer = Buffer.from(base64Content, "base64");

  return uploadDocument(fileName, fileBuffer, mimeType, clientFolder);
}

/**
 * Get storage provider status and configuration
 */
export async function getStorageStatus(): Promise<{
  provider: StorageProvider;
  configured: boolean;
  details?: string;
}> {
  const provider = await getStorageProvider();

  if (provider === "google_drive") {
    const config = await getGoogleDriveConfig();
    return {
      provider,
      configured: !!config,
      details: config ? "Google Drive configurado" : "Google Drive não configurado",
    };
  }

  if (provider === "s3_custom") {
    const accessKey = await getSetting("s3_access_key_id");
    const bucket = await getSetting("s3_bucket");
    return {
      provider,
      configured: !!(accessKey && bucket),
      details: accessKey && bucket ? "S3 customizado configurado" : "S3 customizado não configurado",
    };
  }

  // Default S3 is always configured
  return {
    provider: "s3",
    configured: true,
    details: "S3 padrão (integrado)",
  };
}
