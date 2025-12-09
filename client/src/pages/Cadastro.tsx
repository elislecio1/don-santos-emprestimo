import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowLeft,
  Phone,
  User,
  CreditCard,
  MapPin,
  Building2,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";

interface SimulacaoData {
  valorEmprestimo: number;
  valorParcela: number;
  prazo: number;
  fator: string;
}

const BANCOS = [
  "Banco do Brasil",
  "Bradesco",
  "Caixa Econômica Federal",
  "Itaú",
  "Santander",
  "Nubank",
  "Inter",
  "C6 Bank",
  "Sicoob",
  "Sicredi",
  "Banrisul",
  "BRB",
  "Outro",
];

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function Cadastro() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [simulacao, setSimulacao] = useState<SimulacaoData | null>(null);
  const [proposalId, setProposalId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Personal
    nomeCompleto: "",
    cpf: "",
    dataNascimento: "",
    rgOuCnh: "",
    filiacao: "",
    telefone: "",
    // Address
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    // Bank
    banco: "",
    agencia: "",
    conta: "",
    tipoConta: "corrente" as "corrente" | "poupanca",
  });

  // Document images
  const [documents, setDocuments] = useState<{
    rgFrente: { file: File | null; preview: string | null };
    rgVerso: { file: File | null; preview: string | null };
    comprovanteResidencia: { file: File | null; preview: string | null };
    selfie: { file: File | null; preview: string | null };
  }>({
    rgFrente: { file: null, preview: null },
    rgVerso: { file: null, preview: null },
    comprovanteResidencia: { file: null, preview: null },
    selfie: { file: null, preview: null },
  });

  // File input refs
  const fileInputRefs = {
    rgFrente: useRef<HTMLInputElement>(null),
    rgVerso: useRef<HTMLInputElement>(null),
    comprovanteResidencia: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
  };

  // tRPC mutations
  const createProposal = trpc.proposals.create.useMutation();
  const uploadDocument = trpc.proposals.uploadDocument.useMutation();

  // Load simulation data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("simulacao");
    if (stored) {
      setSimulacao(JSON.parse(stored));
    } else {
      toast.error("Nenhuma simulação encontrada. Faça uma simulação primeiro.");
      setLocation("/simulador");
    }
  }, [setLocation]);

  // Format functions
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);
    return numbers.replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);
    return numbers
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2");
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case "cpf":
        formattedValue = formatCPF(value);
        break;
      case "telefone":
        formattedValue = formatPhone(value);
        break;
      case "cep":
        formattedValue = formatCEP(value);
        break;
      case "dataNascimento":
        formattedValue = formatDate(value);
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  // Handle file upload
  const handleFileChange = (
    type: "rgFrente" | "rgVerso" | "comprovanteResidencia" | "selfie",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments((prev) => ({
          ...prev,
          [type]: { file, preview: reader.result as string },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove document
  const removeDocument = (type: "rgFrente" | "rgVerso" | "comprovanteResidencia" | "selfie") => {
    setDocuments((prev) => ({
      ...prev,
      [type]: { file: null, preview: null },
    }));
    if (fileInputRefs[type].current) {
      fileInputRefs[type].current.value = "";
    }
  };

  // CEP lookup
  const handleCEPBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  // Validate step
  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!formData.nomeCompleto || !formData.cpf || !formData.dataNascimento || 
            !formData.rgOuCnh || !formData.filiacao || !formData.telefone) {
          toast.error("Preencha todos os campos obrigatórios.");
          return false;
        }
        if (formData.cpf.replace(/\D/g, "").length !== 11) {
          toast.error("CPF inválido.");
          return false;
        }
        return true;
      case 2:
        if (!formData.cep || !formData.logradouro || !formData.numero || 
            !formData.bairro || !formData.cidade || !formData.estado) {
          toast.error("Preencha todos os campos obrigatórios do endereço.");
          return false;
        }
        return true;
      case 3:
        if (!formData.banco || !formData.agencia || !formData.conta) {
          toast.error("Preencha todos os dados bancários.");
          return false;
        }
        return true;
      case 4:
        if (!documents.rgFrente.file || !documents.rgVerso.file || 
            !documents.comprovanteResidencia.file || !documents.selfie.file) {
          toast.error("Envie todos os documentos obrigatórios.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateStep(4) || !acceptTerms || !simulacao) {
      if (!acceptTerms) {
        toast.error("Você precisa aceitar os termos para continuar.");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Create proposal
      const result = await createProposal.mutateAsync({
        valorEmprestimo: simulacao.valorEmprestimo.toFixed(2),
        valorParcela: simulacao.valorParcela.toFixed(2),
        prazo: simulacao.prazo,
        fatorUtilizado: simulacao.fator,
        ...formData,
      });

      setProposalId(result.id);

      // Upload documents
      const documentTypes = [
        { type: "rgFrente" as const, doc: documents.rgFrente },
        { type: "rgVerso" as const, doc: documents.rgVerso },
        { type: "comprovanteResidencia" as const, doc: documents.comprovanteResidencia },
        { type: "selfie" as const, doc: documents.selfie },
      ];

      for (const { type, doc } of documentTypes) {
        if (doc.file && doc.preview) {
          const base64Data = doc.preview.split(",")[1];
          await uploadDocument.mutateAsync({
            proposalId: result.id,
            documentType: type,
            base64Data,
            mimeType: doc.file.type,
          });
        }
      }

      // Clear session storage
      sessionStorage.removeItem("simulacao");

      // Go to success step
      setStep(5);
      toast.success("Proposta enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
      toast.error("Erro ao enviar proposta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Document upload component
  const DocumentUpload = ({
    type,
    label,
    description,
  }: {
    type: "rgFrente" | "rgVerso" | "comprovanteResidencia" | "selfie";
    label: string;
    description: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        type="file"
        ref={fileInputRefs[type]}
        accept="image/*"
        capture={type === "selfie" ? "user" : undefined}
        onChange={(e) => handleFileChange(type, e)}
        className="hidden"
      />
      {documents[type].preview ? (
        <div className="relative">
          <img
            src={documents[type].preview!}
            alt={label}
            className="w-full h-40 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeDocument(type)}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Enviado
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRefs[type].current?.click()}
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            {type === "selfie" ? (
              <Camera className="w-6 h-6 text-muted-foreground" />
            ) : (
              <Upload className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      )}
    </div>
  );

  if (!simulacao) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-50 shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold">DS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold">Don Santos</h1>
                <p className="text-xs text-primary-foreground/80">Correspondente Bancário</p>
              </div>
            </Link>
            <a href="tel:08008802525" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-semibold hidden sm:inline">0800 880 2525</span>
            </a>
          </div>
        </div>
      </header>

      {/* Progress */}
      {step < 5 && (
        <div className="bg-muted/30 py-4">
          <div className="container">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { num: 1, label: "Dados Pessoais", icon: User },
                { num: 2, label: "Endereço", icon: MapPin },
                { num: 3, label: "Dados Bancários", icon: Building2 },
                { num: 4, label: "Documentos", icon: FileText },
              ].map((s, index) => (
                <div key={s.num} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= s.num
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.num ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="hidden sm:block ml-2 text-sm font-medium">{s.label}</span>
                  {index < 3 && (
                    <div className={`w-8 sm:w-16 h-1 mx-2 rounded ${step > s.num ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="py-8 md:py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Simulation Summary */}
            {step < 5 && (
              <Card className="mb-6 bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor do Empréstimo</p>
                      <p className="text-xl font-bold text-primary">
                        {simulacao.valorEmprestimo.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Parcela</p>
                      <p className="text-xl font-bold">
                        {simulacao.prazo}x de{" "}
                        {simulacao.valorParcela.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                    <Link href="/simulador">
                      <Button variant="outline" size="sm">
                        Alterar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Personal Data */}
            {step === 1 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                    <Input
                      id="nomeCompleto"
                      name="nomeCompleto"
                      placeholder="Digite seu nome completo"
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        placeholder="DD/MM/AAAA"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rgOuCnh">RG ou CNH *</Label>
                      <Input
                        id="rgOuCnh"
                        name="rgOuCnh"
                        placeholder="Número do documento"
                        value={formData.rgOuCnh}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filiacao">Nome da Mãe *</Label>
                    <Input
                      id="filiacao"
                      name="filiacao"
                      placeholder="Nome completo da mãe"
                      value={formData.filiacao}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleNext} className="btn-gold">
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        name="cep"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={handleChange}
                        onBlur={handleCEPBlur}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado *</Label>
                      <Select
                        value={formData.estado}
                        onValueChange={(v) => setFormData((prev) => ({ ...prev, estado: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {ESTADOS.map((uf) => (
                            <SelectItem key={uf} value={uf}>
                              {uf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logradouro">Logradouro *</Label>
                    <Input
                      id="logradouro"
                      name="logradouro"
                      placeholder="Rua, Avenida, etc."
                      value={formData.logradouro}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número *</Label>
                      <Input
                        id="numero"
                        name="numero"
                        placeholder="Nº"
                        value={formData.numero}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        name="complemento"
                        placeholder="Apto, Bloco, etc."
                        value={formData.complemento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro *</Label>
                      <Input
                        id="bairro"
                        name="bairro"
                        placeholder="Bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        placeholder="Cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button onClick={handleNext} className="btn-gold">
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Bank Data */}
            {step === 3 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Dados Bancários
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="banco">Banco *</Label>
                    <Select
                      value={formData.banco}
                      onValueChange={(v) => setFormData((prev) => ({ ...prev, banco: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o banco" />
                      </SelectTrigger>
                      <SelectContent>
                        {BANCOS.map((banco) => (
                          <SelectItem key={banco} value={banco}>
                            {banco}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência *</Label>
                      <Input
                        id="agencia"
                        name="agencia"
                        placeholder="0000"
                        value={formData.agencia}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conta">Conta *</Label>
                      <Input
                        id="conta"
                        name="conta"
                        placeholder="00000-0"
                        value={formData.conta}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Conta *</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tipoConta"
                          value="corrente"
                          checked={formData.tipoConta === "corrente"}
                          onChange={() => setFormData((prev) => ({ ...prev, tipoConta: "corrente" }))}
                          className="w-4 h-4 text-primary"
                        />
                        <span>Conta Corrente</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tipoConta"
                          value="poupanca"
                          checked={formData.tipoConta === "poupanca"}
                          onChange={() => setFormData((prev) => ({ ...prev, tipoConta: "poupanca" }))}
                          className="w-4 h-4 text-primary"
                        />
                        <span>Poupança</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      A conta informada deve estar em seu nome (titular) para receber o crédito.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button onClick={handleNext} className="btn-gold">
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Envie fotos legíveis dos documentos abaixo. Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <DocumentUpload
                      type="rgFrente"
                      label="RG - Frente *"
                      description="Foto da frente do RG"
                    />
                    <DocumentUpload
                      type="rgVerso"
                      label="RG - Verso *"
                      description="Foto do verso do RG"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <DocumentUpload
                      type="comprovanteResidencia"
                      label="Comprovante de Residência *"
                      description="Conta de luz, água ou telefone"
                    />
                    <DocumentUpload
                      type="selfie"
                      label="Selfie *"
                      description="Tire uma foto do seu rosto"
                    />
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                      Li e aceito a{" "}
                      <Link href="/politica-privacidade" className="text-primary hover:underline">
                        Política de Privacidade
                      </Link>{" "}
                      e os{" "}
                      <Link href="/termos-servico" className="text-primary hover:underline">
                        Termos de Serviço
                      </Link>
                      . Autorizo o tratamento dos meus dados pessoais para análise de crédito.
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(3)}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="btn-gold"
                      disabled={isSubmitting || !acceptTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Proposta
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <Card className="border-0 shadow-xl text-center">
                <CardContent className="p-8 md:p-12">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Proposta Enviada com Sucesso!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Sua proposta foi recebida e está em análise. Em breve nossa equipe entrará em contato pelo telefone informado.
                  </p>
                  {proposalId && (
                    <p className="text-sm text-muted-foreground mb-8">
                      Número da proposta: <strong>#{proposalId}</strong>
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                      <Button variant="outline">
                        Voltar ao Início
                      </Button>
                    </Link>
                    <a href="https://wa.me/5575999999999" target="_blank" rel="noopener noreferrer">
                      <Button className="btn-gold">
                        Falar no WhatsApp
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-8">
        <div className="container text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Don Santos Correspondente Bancário. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
