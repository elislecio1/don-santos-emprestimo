import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Download,
  FileText,
  Loader2,
  User,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Image,
  RefreshCw,
} from "lucide-react";

type ProposalStatus = "pendente" | "em_analise" | "aprovado" | "recusado";

const statusConfig: Record<ProposalStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendente: { label: "Pendente", variant: "secondary" },
  em_analise: { label: "Em Análise", variant: "default" },
  aprovado: { label: "Aprovado", variant: "outline" },
  recusado: { label: "Recusado", variant: "destructive" },
};

export default function AdminPropostas() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: proposals, isLoading, refetch } = trpc.proposals.getAll.useQuery();
  const { data: proposalDetails, isLoading: loadingDetails } = trpc.proposals.getById.useQuery(
    { id: selectedProposal! },
    { enabled: !!selectedProposal }
  );
  const updateStatus = trpc.proposals.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao atualizar status.");
    },
  });

  const filteredProposals = proposals?.filter((p) => {
    const matchesSearch =
      p.nomeCompleto.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (id: number) => {
    setSelectedProposal(id);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (id: number, newStatus: ProposalStatus) => {
    await updateStatus.mutateAsync({ id, status: newStatus });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Propostas</h1>
          <p className="text-muted-foreground">Gerencie todas as propostas de empréstimo</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="recusado">Recusado</SelectItem>
              </SelectContent>
            </Select>
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
          ) : filteredProposals && filteredProposals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">#{proposal.id}</TableCell>
                      <TableCell>{proposal.nomeCompleto}</TableCell>
                      <TableCell>{proposal.cpf}</TableCell>
                      <TableCell>
                        {parseFloat(proposal.valorEmprestimo).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>{proposal.prazo}x</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[proposal.status as ProposalStatus]?.variant || "secondary"}>
                          {statusConfig[proposal.status as ProposalStatus]?.label || proposal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(proposal.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(proposal.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Nenhuma proposta encontrada</h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Tente ajustar os filtros de busca."
                  : "As propostas aparecerão aqui quando forem enviadas."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Proposta #{selectedProposal}</DialogTitle>
          </DialogHeader>
          
          {loadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : proposalDetails ? (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Status atual</p>
                  <Badge variant={statusConfig[proposalDetails.status as ProposalStatus]?.variant || "secondary"} className="mt-1">
                    {statusConfig[proposalDetails.status as ProposalStatus]?.label || proposalDetails.status}
                  </Badge>
                </div>
                <Select
                  value={proposalDetails.status}
                  onValueChange={(v) => handleStatusChange(proposalDetails.id, v as ProposalStatus)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="recusado">Recusado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Simulation Data */}
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4" />
                  Dados da Simulação
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor do Empréstimo</p>
                    <p className="font-semibold text-lg">
                      {parseFloat(proposalDetails.valorEmprestimo).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor da Parcela</p>
                    <p className="font-semibold text-lg">
                      {parseFloat(proposalDetails.valorParcela).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prazo</p>
                    <p className="font-semibold">{proposalDetails.prazo} parcelas</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fator Utilizado</p>
                    <p className="font-semibold">{proposalDetails.fatorUtilizado}</p>
                  </div>
                </div>
              </div>

              {/* Personal Data */}
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <User className="w-4 h-4" />
                  Dados Pessoais
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{proposalDetails.nomeCompleto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium">{proposalDetails.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">{proposalDetails.dataNascimento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RG/CNH</p>
                    <p className="font-medium">{proposalDetails.rgOuCnh}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Filiação</p>
                    <p className="font-medium">{proposalDetails.filiacao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{proposalDetails.telefone}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4" />
                  Endereço
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Logradouro</p>
                    <p className="font-medium">
                      {proposalDetails.logradouro}, {proposalDetails.numero}
                      {proposalDetails.complemento && ` - ${proposalDetails.complemento}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bairro</p>
                    <p className="font-medium">{proposalDetails.bairro}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cidade/UF</p>
                    <p className="font-medium">{proposalDetails.cidade}/{proposalDetails.estado}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CEP</p>
                    <p className="font-medium">{proposalDetails.cep}</p>
                  </div>
                </div>
              </div>

              {/* Bank Data */}
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4" />
                  Dados Bancários
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Banco</p>
                    <p className="font-medium">{proposalDetails.banco}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agência</p>
                    <p className="font-medium">{proposalDetails.agencia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conta</p>
                    <p className="font-medium">{proposalDetails.conta}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Conta</p>
                    <p className="font-medium capitalize">{proposalDetails.tipoConta}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {(proposalDetails.rgFrenteUrl || proposalDetails.rgVersoUrl || proposalDetails.comprovanteResidenciaUrl || proposalDetails.selfieUrl) && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Image className="w-4 h-4" />
                    Documentos
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {proposalDetails.rgFrenteUrl && (
                      <a
                        href={proposalDetails.rgFrenteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                            <Image className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">RG - Frente</p>
                            <p className="text-xs text-muted-foreground">Clique para visualizar</p>
                          </div>
                        </div>
                      </a>
                    )}
                    {proposalDetails.rgVersoUrl && (
                      <a
                        href={proposalDetails.rgVersoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                            <Image className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">RG - Verso</p>
                            <p className="text-xs text-muted-foreground">Clique para visualizar</p>
                          </div>
                        </div>
                      </a>
                    )}
                    {proposalDetails.comprovanteResidenciaUrl && (
                      <a
                        href={proposalDetails.comprovanteResidenciaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                            <Image className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Comprovante de Residência</p>
                            <p className="text-xs text-muted-foreground">Clique para visualizar</p>
                          </div>
                        </div>
                      </a>
                    )}
                    {proposalDetails.selfieUrl && (
                      <a
                        href={proposalDetails.selfieUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                            <Image className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Selfie</p>
                            <p className="text-xs text-muted-foreground">Clique para visualizar</p>
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Criado em: {formatDate(proposalDetails.createdAt)}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
