import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Calendar,
  Filter,
  CheckCircle2,
} from "lucide-react";

export default function AdminExportar() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [isExporting, setIsExporting] = useState(false);

  const { data: proposals } = trpc.proposals.getAll.useQuery();

  const handleExport = async () => {
    if (!proposals || proposals.length === 0) {
      toast.error("Não há propostas para exportar.");
      return;
    }

    setIsExporting(true);

    try {
      // Filter proposals
      const filteredProposals = statusFilter === "all"
        ? proposals
        : proposals.filter((p) => p.status === statusFilter);

      if (filteredProposals.length === 0) {
        toast.error("Nenhuma proposta encontrada com os filtros selecionados.");
        setIsExporting(false);
        return;
      }

      // Prepare data
      const headers = [
        "ID",
        "Nome Completo",
        "CPF",
        "Data Nascimento",
        "RG/CNH",
        "Filiação",
        "Telefone",
        "CEP",
        "Logradouro",
        "Número",
        "Complemento",
        "Bairro",
        "Cidade",
        "Estado",
        "Banco",
        "Agência",
        "Conta",
        "Tipo Conta",
        "Valor Empréstimo",
        "Valor Parcela",
        "Prazo",
        "Fator",
        "Status",
        "Data Cadastro",
      ];

      const rows = filteredProposals.map((p) => [
        p.id,
        p.nomeCompleto,
        p.cpf,
        p.dataNascimento,
        p.rgOuCnh,
        p.filiacao,
        p.telefone,
        p.cep,
        p.logradouro,
        p.numero,
        p.complemento || "",
        p.bairro,
        p.cidade,
        p.estado,
        p.banco,
        p.agencia,
        p.conta,
        p.tipoConta,
        p.valorEmprestimo,
        p.valorParcela,
        p.prazo,
        p.fatorUtilizado,
        p.status,
        new Date(p.createdAt).toLocaleDateString("pt-BR"),
      ]);

      if (format === "csv") {
        // Generate CSV
        const csvContent = [
          headers.join(";"),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(";")),
        ].join("\n");

        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `propostas_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
      } else {
        // For XLSX, we'll use a simple CSV format that Excel can open
        // In a production app, you'd use a library like xlsx
        const csvContent = [
          headers.join("\t"),
          ...rows.map((row) => row.join("\t")),
        ].join("\n");

        const blob = new Blob(["\ufeff" + csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `propostas_${new Date().toISOString().split("T")[0]}.xls`;
        link.click();
      }

      toast.success(`${filteredProposals.length} propostas exportadas com sucesso!`);
    } catch (error) {
      toast.error("Erro ao exportar dados.");
    } finally {
      setIsExporting(false);
    }
  };

  const statusOptions = [
    { value: "all", label: "Todos os status" },
    { value: "pendente", label: "Pendente" },
    { value: "em_analise", label: "Em Análise" },
    { value: "aprovado", label: "Aprovado" },
    { value: "recusado", label: "Recusado" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exportar Dados</h1>
        <p className="text-muted-foreground">Exporte os dados das propostas em diferentes formatos</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Propostas</p>
                <p className="text-2xl font-bold">{proposals?.length || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
                <p className="text-2xl font-bold">
                  {proposals?.filter((p) => p.status === "aprovado").length || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">
                  {proposals?.filter((p) => p.status === "pendente").length || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Opções de Exportação
          </CardTitle>
          <CardDescription>
            Configure os filtros e formato de exportação dos dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrar por Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Formato do Arquivo
              </Label>
              <Select value={format} onValueChange={(v) => setFormat(v as "csv" | "xlsx")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel, Google Sheets)</SelectItem>
                  <SelectItem value="xlsx">XLS (Microsoft Excel)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Dados incluídos na exportação:</h4>
            <p className="text-sm text-muted-foreground">
              ID, Nome, CPF, Data de Nascimento, RG/CNH, Filiação, Telefone, Endereço completo, 
              Dados bancários, Valores da simulação, Status e Data de cadastro.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleExport}
            disabled={isExporting || !proposals || proposals.length === 0}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Exportar Propostas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Export History Info */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <span>Os arquivos CSV são compatíveis com Excel, Google Sheets e outros programas de planilha.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <span>Os dados exportados incluem todas as informações do cadastro, exceto as imagens de documentos.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <span>Para acessar os documentos, utilize a visualização individual de cada proposta.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
