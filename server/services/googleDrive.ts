import { getSetting } from "../db";

interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  folderId?: string;
}

interface UploadResult {
  success: boolean;
  fileId?: string;
  webViewLink?: string;
  error?: string;
}

interface FolderResult {
  success: boolean;
  folderId?: string;
  webViewLink?: string;
  error?: string;
}

async function getAccessToken(config: GoogleDriveConfig): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function getGoogleDriveConfig(): Promise<GoogleDriveConfig | null> {
  const clientId = await getSetting("gdrive_client_id");
  const clientSecret = await getSetting("gdrive_client_secret");
  const refreshToken = await getSetting("gdrive_refresh_token");
  const folderId = await getSetting("gdrive_folder_id");

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    folderId: folderId || undefined,
  };
}

export async function createGoogleDriveFolder(
  folderName: string,
  parentFolderId?: string
): Promise<FolderResult> {
  try {
    const config = await getGoogleDriveConfig();
    if (!config) {
      return { success: false, error: "Google Drive não configurado" };
    }

    const accessToken = await getAccessToken(config);
    const parentId = parentFolderId || config.folderId;

    const metadata: Record<string, unknown> = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };

    if (parentId) {
      metadata.parents = [parentId];
    }

    const response = await fetch(
      "https://www.googleapis.com/drive/v3/files?fields=id,webViewLink",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Erro ao criar pasta: ${error}` };
    }

    const data = await response.json();
    return {
      success: true,
      folderId: data.id,
      webViewLink: data.webViewLink,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function uploadToGoogleDrive(
  fileName: string,
  fileBuffer: Buffer,
  mimeType: string,
  folderId?: string
): Promise<UploadResult> {
  try {
    const config = await getGoogleDriveConfig();
    if (!config) {
      return { success: false, error: "Google Drive não configurado" };
    }

    const accessToken = await getAccessToken(config);
    const parentId = folderId || config.folderId;

    // Create multipart request
    const boundary = "-------314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata: Record<string, unknown> = {
      name: fileName,
      mimeType: mimeType,
    };

    if (parentId) {
      metadata.parents = [parentId];
    }

    const multipartBody = Buffer.concat([
      Buffer.from(
        delimiter +
          "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
          JSON.stringify(metadata) +
          delimiter +
          `Content-Type: ${mimeType}\r\n` +
          "Content-Transfer-Encoding: base64\r\n\r\n"
      ),
      Buffer.from(fileBuffer.toString("base64")),
      Buffer.from(closeDelimiter),
    ]);

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Erro ao fazer upload: ${error}` };
    }

    const data = await response.json();

    // Make file publicly accessible
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${data.id}/permissions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "reader",
          type: "anyone",
        }),
      }
    );

    return {
      success: true,
      fileId: data.id,
      webViewLink: `https://drive.google.com/file/d/${data.id}/view`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function testGoogleDriveConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getGoogleDriveConfig();
    if (!config) {
      return { success: false, error: "Google Drive não configurado" };
    }

    const accessToken = await getAccessToken(config);

    // Test by listing files
    const response = await fetch(
      "https://www.googleapis.com/drive/v3/files?pageSize=1",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Erro de conexão: ${error}` };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
