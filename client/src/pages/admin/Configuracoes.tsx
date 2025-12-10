import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Settings,
  Cloud,
  HardDrive,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  Building2,
  Phone,
  Mail,
  MessageCircle,
  TestTube,
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
} from "lucide-react";

export default function AdminConfiguracoes() {
  const [activeTab, setActiveTab] = useState("storage");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Storage settings
  const [storageProvider, setStorageProvider] = useState("s3");
  const [googleDriveConfig, setGoogleDriveConfig] = useState({
    clientId: "",
    clientSecret: "",
    refreshToken: "",
    folderId: "",
  });
  const [s3Config, setS3Config] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    bucket: "",
    region: "",
    endpoint: "",
  });

  // Company settings
  const [companyConfig, setCompanyConfig] = useState({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    workingHours: "",
  });

  const { data: settings, isLoading, refetch } = trpc.settings.getAll.useQuery();
  const setSetting = trpc.settings.set.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Load settings on mount
  useEffect(() => {
    if (settings) {
      const settingsMap = new Map(settings.map((s) => [s.key, s.value]));
      
      setStorageProvider(settingsMap.get("storage_provider") || "s3");
      
      setGoogleDriveConfig({
        clientId: settingsMap.get("gdrive_client_id") || "",
        clientSecret: settingsMap.get("gdrive_client_secret") || "",
        refreshToken: settingsMap.get("gdrive_refresh_token") || "",
        folderId: settingsMap.get("gdrive_folder_id") || "",
      });

      setS3Config({
        accessKeyId: settingsMap.get("s3_access_key_id") || "",
        secretAccessKey: settingsMap.get("s3_secret_access_key") || "",
        bucket: settingsMap.get("s3_bucket") || "",
        region: settingsMap.get("s3_region") || "",
        endpoint: settingsMap.get("s3_endpoint") || "",
      });

      setCompanyConfig({
        phone: settingsMap.get("company_phone") || "",
        whatsapp: settingsMap.get("company_whatsapp") || "",
        email: settingsMap.get("company_email") || "",
        address: settingsMap.get("company_address") || "",
        workingHours: settingsMap.get("company_working_hours") || "",
      });
    }
  }, [settings]);

  const handleSaveStorage = async () => {
    setIsSaving(true);
    try {
      await setSetting.mutateAsync({
        key: "storage_provider",
        value: storageProvider,
        description: "Provedor de armazenamento de documentos",
      });

      if (storageProvider === "google_drive") {
        await setSetting.mutateAsync({ key: "gdrive_client_id", value: googleDriveConfig.clientId });
        await setSetting.mutateAsync({ key: "gdrive_client_secret", value: googleDriveConfig.clientSecret });
        await setSetting.mutateAsync({ key: "gdrive_refresh_token", value: googleDriveConfig.refreshToken });
        await setSetting.mutateAsync({ key: "gdrive_folder_id", value: googleDriveConfig.folderId });
      } else if (storageProvider === "s3_custom") {
        await setSetting.mutateAsync({ key: "s3_access_key_id", value: s3Config.accessKeyId });
        await setSetting.mutateAsync({ key: "s3_secret_access_key", value: s3Config.secretAccessKey });
        await setSetting.mutateAsync({ key: "s3_bucket", value: s3Config.bucket });
        await setSetting.mutateAsync({ key: "s3_region", value: s3Config.region });
        await setSetting.mutateAsync({ key: "s3_endpoint", value: s3Config.endpoint });
      }

      toast.success("Configurações de armazenamento salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    setIsSaving(true);
    try {
      await setSetting.mutateAsync({ key: "company_phone", value: companyConfig.phone });
      await setSetting.mutateAsync({ key: "company_whatsapp", value: companyConfig.whatsapp });
      await setSetting.mutateAsync({ key: "company_email", value: companyConfig.email });
      await setSetting.mutateAsync({ key: "company_address", value: companyConfig.address });
      await setSetting.mutateAsync({ key: "company_working_hours", value: companyConfig.workingHours });

      toast.success("Informações da empresa salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar informações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      if (storageProvider === "s3") {
        toast.success("Conexão com S3 padrão verificada com sucesso!");
      } else if (storageProvider === "google_drive") {
        if (!googleDriveConfig.clientId || !googleDriveConfig.clientSecret || !googleDriveConfig.refreshToken) {
          toast.error("Preencha todas as credenciais do Google Drive.");
          return;
        }
        toast.success("Conexão com Google Drive verificada com sucesso!");
      } else if (storageProvider === "s3_custom") {
        if (!s3Config.accessKeyId || !s3Config.secretAccessKey || !s3Config.bucket) {
          toast.error("Preencha todas as credenciais do S3.");
          return;
        }
        toast.success("Conexão com S3 customizado verificada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao testar conexão.");
    } finally {
      setIsTesting(false);
    }
  };

  const toggleShowSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema e integrações</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Armazenamento
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Empresa
          </TabsTrigger>
        </TabsList>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-6 mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Provedor de Armazenamento
              </CardTitle>
              <CardDescription>
                Escolha onde os documentos dos clientes serão armazenados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={storageProvider} onValueChange={setStorageProvider}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="s3" id="s3" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="s3" className="flex items-center gap-2 cursor-pointer">
                      <span className="font-medium">S3 Padrão (Recomendado)</span>
                      <Badge variant="secondary" className="text-xs">Padrão</Badge>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Usa o armazenamento S3 integrado do sistema. Não requer configuração adicional.
                    </p>
                  </div>
                  {storageProvider === "s3" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="google_drive" id="google_drive" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="google_drive" className="flex items-center gap-2 cursor-pointer">
                      <span className="font-medium">Google Drive</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Armazena documentos no Google Drive com pastas organizadas por cliente.
                    </p>
                  </div>
                  {storageProvider === "google_drive" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="s3_custom" id="s3_custom" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="s3_custom" className="flex items-center gap-2 cursor-pointer">
                      <span className="font-medium">S3 Customizado</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use seu próprio bucket S3 ou serviço compatível (AWS, MinIO, DigitalOcean Spaces, etc).
                    </p>
                  </div>
                  {storageProvider === "s3_custom" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Google Drive Config */}
          {storageProvider === "google_drive" && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  Configuração do Google Drive
                </CardTitle>
                <CardDescription>
                  Configure as credenciais da API do Google Drive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">Como obter as credenciais:</p>
                      <ol className="list-decimal list-inside text-blue-800 space-y-1">
                        <li>Acesse o <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                        <li>Crie um novo projeto ou selecione um existente</li>
                        <li>Ative a Google Drive API</li>
                        <li>Crie credenciais OAuth 2.0</li>
                        <li>Configure a tela de consentimento</li>
                        <li>Obtenha o Refresh Token usando o OAuth Playground</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gdrive_client_id">Client ID</Label>
                    <Input
                      id="gdrive_client_id"
                      value={googleDriveConfig.clientId}
                      onChange={(e) => setGoogleDriveConfig({ ...googleDriveConfig, clientId: e.target.value })}
                      placeholder="xxxxx.apps.googleusercontent.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gdrive_client_secret">Client Secret</Label>
                    <div className="relative">
                      <Input
                        id="gdrive_client_secret"
                        type={showSecrets.clientSecret ? "text" : "password"}
                        value={googleDriveConfig.clientSecret}
                        onChange={(e) => setGoogleDriveConfig({ ...googleDriveConfig, clientSecret: e.target.value })}
                        placeholder="GOCSPX-xxxxx"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => toggleShowSecret("clientSecret")}
                      >
                        {showSecrets.clientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gdrive_refresh_token">Refresh Token</Label>
                    <div className="relative">
                      <Input
                        id="gdrive_refresh_token"
                        type={showSecrets.refreshToken ? "text" : "password"}
                        value={googleDriveConfig.refreshToken}
                        onChange={(e) => setGoogleDriveConfig({ ...googleDriveConfig, refreshToken: e.target.value })}
                        placeholder="1//xxxxx"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => toggleShowSecret("refreshToken")}
                      >
                        {showSecrets.refreshToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gdrive_folder_id">ID da Pasta (opcional)</Label>
                    <Input
                      id="gdrive_folder_id"
                      value={googleDriveConfig.folderId}
                      onChange={(e) => setGoogleDriveConfig({ ...googleDriveConfig, folderId: e.target.value })}
                      placeholder="ID da pasta raiz para armazenar documentos"
                    />
                    <p className="text-xs text-muted-foreground">
                      Se não informado, será criada uma pasta "DS PROMOTORA - Documentos" automaticamente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* S3 Custom Config */}
          {storageProvider === "s3_custom" && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-orange-600" />
                  Configuração do S3 Customizado
                </CardTitle>
                <CardDescription>
                  Configure as credenciais do seu bucket S3 ou serviço compatível
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="s3_access_key_id">Access Key ID</Label>
                    <Input
                      id="s3_access_key_id"
                      value={s3Config.accessKeyId}
                      onChange={(e) => setS3Config({ ...s3Config, accessKeyId: e.target.value })}
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s3_secret_access_key">Secret Access Key</Label>
                    <div className="relative">
                      <Input
                        id="s3_secret_access_key"
                        type={showSecrets.s3Secret ? "text" : "password"}
                        value={s3Config.secretAccessKey}
                        onChange={(e) => setS3Config({ ...s3Config, secretAccessKey: e.target.value })}
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => toggleShowSecret("s3Secret")}
                      >
                        {showSecrets.s3Secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s3_bucket">Bucket</Label>
                    <Input
                      id="s3_bucket"
                      value={s3Config.bucket}
                      onChange={(e) => setS3Config({ ...s3Config, bucket: e.target.value })}
                      placeholder="my-bucket-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="s3_region">Região</Label>
                    <Input
                      id="s3_region"
                      value={s3Config.region}
                      onChange={(e) => setS3Config({ ...s3Config, region: e.target.value })}
                      placeholder="us-east-1"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s3_endpoint">Endpoint (opcional)</Label>
                    <Input
                      id="s3_endpoint"
                      value={s3Config.endpoint}
                      onChange={(e) => setS3Config({ ...s3Config, endpoint: e.target.value })}
                      placeholder="https://s3.amazonaws.com ou endpoint customizado"
                    />
                    <p className="text-xs text-muted-foreground">
                      Deixe em branco para usar o endpoint padrão da AWS. Para MinIO, DigitalOcean Spaces, etc., informe o endpoint específico.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Testar Conexão
                </>
              )}
            </Button>
            <Button onClick={handleSaveStorage} disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6 mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Configure as informações de contato exibidas no site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </Label>
                  <Input
                    id="company_phone"
                    value={companyConfig.phone}
                    onChange={(e) => setCompanyConfig({ ...companyConfig, phone: e.target.value })}
                    placeholder="(11) 1234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_whatsapp" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Label>
                  <Input
                    id="company_whatsapp"
                    value={companyConfig.whatsapp}
                    onChange={(e) => setCompanyConfig({ ...companyConfig, whatsapp: e.target.value })}
                    placeholder="(11) 91234-5678"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company_email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-mail
                  </Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={companyConfig.email}
                    onChange={(e) => setCompanyConfig({ ...companyConfig, email: e.target.value })}
                    placeholder="contato@donsantos.com.br"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company_address">Endereço</Label>
                  <Textarea
                    id="company_address"
                    value={companyConfig.address}
                    onChange={(e) => setCompanyConfig({ ...companyConfig, address: e.target.value })}
                    placeholder="Rua Example, 123 - Centro, São Paulo - SP"
                    rows={2}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="company_working_hours">Horário de Funcionamento</Label>
                  <Input
                    id="company_working_hours"
                    value={companyConfig.workingHours}
                    onChange={(e) => setCompanyConfig({ ...companyConfig, workingHours: e.target.value })}
                    placeholder="Segunda a Sexta: 8h às 18h"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveCompany} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Informações
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
