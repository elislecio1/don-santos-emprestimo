import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Upload,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  Loader2,
  Search,
  AlertCircle,
  CheckCircle2,
  Download,
  Info,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminFatores() {
  const [search, setSearch] = useState("");
  const [prazoFilter, setPrazoFilter] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleteManyIds, setDeleteManyIds] = useState<number[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: factors, isLoading, refetch } = trpc.factors.getAll.useQuery();
  const uploadCSV = trpc.factors.uploadCSV.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.imported} fatores importados com sucesso!`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao importar CSV.");
    },
  });
  const deleteFactor = trpc.factors.delete.useMutation({
    onSuccess: () => {
      toast.success("Fator excluído com sucesso!");
      refetch();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir fator.");
    },
  });
  const deleteManyFactors = trpc.factors.deleteMany.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.deleted} fator(es) excluído(s) com sucesso!`);
      refetch();
      setSelectedIds(new Set());
      setDeleteManyIds(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir fatores.");
    },
  });

  // Get unique prazos for filter
  const uniquePrazos = factors
    ? Array.from(new Set(factors.map((f) => f.prazo))).sort((a, b) => a - b)
    : [];

  // Filter factors
  const filteredFactors = factors?.filter((f) => {
    const matchesPrazo = prazoFilter === "all" || f.prazo === parseInt(prazoFilter);
    const matchesSearch =
      f.prazo.toString().includes(search) ||
      f.dia.toString().includes(search) ||
      f.fator.includes(search);
    return matchesPrazo && matchesSearch;
  });

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredFactors) {
      setSelectedIds(new Set(filteredFactors.map((f) => f.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected = filteredFactors && filteredFactors.length > 0 && filteredFactors.every((f) => selectedIds.has(f.id));
  const isSomeSelected = selectedIds.size > 0;

  // Limpar seleção quando filtros mudarem
  useEffect(() => {
    setSelectedIds(new Set());
  }, [search, prazoFilter]);

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Por favor, selecione um arquivo CSV.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      try {
        await uploadCSV.mutateAsync({ csvContent: content });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      toast.error("Erro ao ler o arquivo.");
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  // Download template CSV
  const downloadTemplate = () => {
    const template = "prazo;dia;fator\n12;1;0.09500\n12;2;0.09510\n24;1;0.05200\n24;2;0.05210";
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_fatores.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fatores de Empréstimo</h1>
          <p className="text-muted-foreground">Gerencie os fatores utilizados nas simulações</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Upload Section */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Fatores
          </CardTitle>
          <CardDescription>
            Faça upload de um arquivo CSV com os fatores de empréstimo. O arquivo deve conter as colunas: prazo, dia, fator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Formato do CSV:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Separador: ponto e vírgula (;) ou vírgula (,)</li>
                  <li>Colunas: prazo, dia, fator</li>
                  <li>Fator com ponto decimal (ex: 0.09500)</li>
                  <li>A importação substitui todos os fatores existentes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Selecionar Arquivo CSV
                </>
              )}
            </Button>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Fatores</p>
                <p className="text-2xl font-bold">{factors?.length || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prazos Disponíveis</p>
                <p className="text-2xl font-bold">{uniquePrazos.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dias Cobertos</p>
                <p className="text-2xl font-bold">
                  {factors ? Array.from(new Set(factors.map((f) => f.dia))).length : 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por prazo, dia ou fator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={prazoFilter}
              onChange={(e) => setPrazoFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">Todos os prazos</option>
              {uniquePrazos.map((prazo) => (
                <option key={prazo} value={prazo}>
                  {prazo} parcelas
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredFactors && filteredFactors.length > 0 ? (
            <>
              {/* Toolbar com botão de excluir selecionados */}
              {isSomeSelected && (
                <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedIds.size} fator(es) selecionado(s)
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteManyIds(Array.from(selectedIds))}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Selecionados
                  </Button>
                </div>
              )}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Dia</TableHead>
                      <TableHead>Fator</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFactors.map((factor) => (
                      <TableRow key={factor.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(factor.id)}
                            onCheckedChange={(checked) => handleSelectOne(factor.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">#{factor.id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{factor.prazo}x</Badge>
                        </TableCell>
                        <TableCell>Dia {factor.dia}</TableCell>
                        <TableCell className="font-mono">{factor.fator}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(factor.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileSpreadsheet className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Nenhum fator encontrado</h3>
              <p className="text-muted-foreground">
                {search || prazoFilter !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "Importe um arquivo CSV para adicionar fatores."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Fator</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este fator? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteFactor.mutate({ id: deleteId })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Many Confirmation Dialog */}
      <AlertDialog open={!!deleteManyIds} onOpenChange={() => setDeleteManyIds(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Fatores Selecionados</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {deleteManyIds?.length || 0} fator(es) selecionado(s)? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteManyIds && deleteManyFactors.mutate({ ids: deleteManyIds })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteManyFactors.isPending}
            >
              {deleteManyFactors.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                `Excluir ${deleteManyIds?.length || 0} fator(es)`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
