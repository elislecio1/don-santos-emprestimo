import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Brand } from "@/components/Brand";
import {
  ArrowLeft,
  Phone,
  Calculator,
  ChevronRight,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function Simulador() {
  const [, setLocation] = useLocation();
  
  // Form state
  const [tipoCalculo, setTipoCalculo] = useState<"parcela" | "emprestimo">("parcela");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("");
  const [dia] = useState(() => new Date().getDate()); // Current day of month
  
  // Result state
  const [resultado, setResultado] = useState<{
    valorEmprestimo: number;
    valorParcela: number;
    prazo: number;
    fator: string;
  } | null>(null);

  // Fetch available prazos
  const { data: prazos, isLoading: loadingPrazos } = trpc.factors.getPrazos.useQuery();
  
  // Fetch all factors for validation
  const { data: allFactors } = trpc.factors.getAll.useQuery();

  // Check if factor exists for selected prazo and current day
  const factorExists = useMemo(() => {
    if (!allFactors || !prazo) return false;
    return allFactors.some(f => f.prazo === parseInt(prazo) && f.dia === dia);
  }, [allFactors, prazo, dia]);

  // Calculate from parcela
  const calculateFromParcela = trpc.simulation.calculateFromParcela.useQuery(
    {
      valorParcela: parseFloat(valor.replace(/\D/g, "")) / 100,
      prazo: parseInt(prazo),
      dia,
    },
    {
      enabled: false,
    }
  );

  // Calculate from emprestimo
  const calculateFromEmprestimo = trpc.simulation.calculateFromEmprestimo.useQuery(
    {
      valorEmprestimo: parseFloat(valor.replace(/\D/g, "")) / 100,
      prazo: parseInt(prazo),
      dia,
    },
    {
      enabled: false,
    }
  );

  // Format currency input
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = parseInt(numbers || "0") / 100;
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setValor(rawValue ? formatCurrency(rawValue) : "");
    setResultado(null);
  };

  const handleSimular = async () => {
    if (!valor || !prazo) {
      toast.error("Preencha todos os campos para simular.");
      return;
    }

    const valorNumerico = parseFloat(valor.replace(/\D/g, "")) / 100;
    if (valorNumerico <= 0) {
      toast.error("Digite um valor válido.");
      return;
    }

    try {
      if (tipoCalculo === "parcela") {
        const result = await calculateFromParcela.refetch();
        if (result.data) {
          setResultado(result.data);
        }
      } else {
        const result = await calculateFromEmprestimo.refetch();
        if (result.data) {
          setResultado(result.data);
        }
      }
    } catch (error) {
      toast.error("Erro ao calcular. Verifique se existe um fator cadastrado para este prazo.");
    }
  };

  const handleProsseguir = () => {
    if (!resultado) return;
    
    // Store simulation data in sessionStorage
    sessionStorage.setItem("simulacao", JSON.stringify(resultado));
    setLocation("/cadastro");
  };

  const isLoading = calculateFromParcela.isFetching || calculateFromEmprestimo.isFetching;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-50 shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between">
            <Brand variant="light" />
            <a href="tel:08008802525" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-semibold hidden sm:inline">0800 880 2525</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="container relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
              <Calculator className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Simulador de Empréstimo</h1>
              <p className="text-white/70">Descubra quanto você pode contratar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="py-12 md:py-16 -mt-8 relative z-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Form Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Faça sua Simulação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tipo de Cálculo */}
                <div className="space-y-3">
                  <Label>Como deseja calcular?</Label>
                  <RadioGroup
                    value={tipoCalculo}
                    onValueChange={(v) => {
                      setTipoCalculo(v as "parcela" | "emprestimo");
                      setResultado(null);
                    }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="parcela"
                        id="parcela"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="parcela"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <DollarSign className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">Pela Parcela</span>
                        <span className="text-xs text-muted-foreground">Quanto posso pegar?</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="emprestimo"
                        id="emprestimo"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="emprestimo"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <TrendingUp className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">Pelo Valor</span>
                        <span className="text-xs text-muted-foreground">Quanto vou pagar?</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Valor */}
                <div className="space-y-2">
                  <Label htmlFor="valor">
                    {tipoCalculo === "parcela" ? "Valor da Parcela Desejada" : "Valor do Empréstimo Desejado"}
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="valor"
                      placeholder="R$ 0,00"
                      value={valor}
                      onChange={handleValorChange}
                      className="pl-10 text-lg h-12"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tipoCalculo === "parcela"
                      ? "Digite o valor máximo que você pode pagar por mês"
                      : "Digite o valor total que você deseja contratar"}
                  </p>
                </div>

                {/* Prazo */}
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo (número de parcelas)</Label>
                  <Select value={prazo} onValueChange={(v) => { setPrazo(v); setResultado(null); }}>
                    <SelectTrigger className="h-12">
                      <Calendar className="w-5 h-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Selecione o prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingPrazos ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : prazos && prazos.length > 0 ? (
                        prazos.map((p) => (
                          <SelectItem key={p} value={p.toString()}>
                            {p} parcelas
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>Nenhum prazo disponível</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {prazo && !factorExists && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Fator não cadastrado para o dia {dia} deste mês
                    </p>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Dia de referência:</strong> {dia} (dia atual do mês)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Os fatores variam de acordo com o dia do mês e o prazo selecionado.
                  </p>
                </div>

                {/* Button */}
                <Button
                  size="lg"
                  className="w-full btn-gold"
                  onClick={handleSimular}
                  disabled={isLoading || !valor || !prazo || !factorExists}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-2" />
                      Simular Agora
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result Card */}
            <div className="space-y-6">
              {resultado ? (
                <Card className="border-0 shadow-xl bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      Resultado da Simulação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/10 rounded-xl">
                        <p className="text-sm text-primary-foreground/70 mb-1">Valor do Empréstimo</p>
                        <p className="text-2xl font-bold text-gold">
                          {resultado.valorEmprestimo.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl">
                        <p className="text-sm text-primary-foreground/70 mb-1">Valor da Parcela</p>
                        <p className="text-2xl font-bold">
                          {resultado.valorParcela.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/10 rounded-xl">
                        <p className="text-sm text-primary-foreground/70 mb-1">Prazo</p>
                        <p className="text-xl font-semibold">{resultado.prazo}x</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl">
                        <p className="text-sm text-primary-foreground/70 mb-1">Fator Aplicado</p>
                        <p className="text-xl font-semibold">{resultado.fator}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-accent/20 rounded-xl border border-accent/30">
                      <p className="text-sm text-primary-foreground/90">
                        <strong>Total a pagar:</strong>{" "}
                        {(resultado.valorParcela * resultado.prazo).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleProsseguir}
                    >
                      Prosseguir para Cadastro
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg bg-muted/30">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Faça sua Simulação</h3>
                    <p className="text-muted-foreground">
                      Preencha os campos ao lado e clique em "Simular Agora" para ver o resultado da sua simulação.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Info Card */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    Informações Importantes
                  </h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Os valores apresentados são uma simulação e podem variar na contratação final.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>A aprovação está sujeita à análise de crédito pela instituição financeira.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Empréstimo consignado disponível para aposentados, pensionistas e servidores públicos.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-8">
        <div className="container text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} DS PROMOTORA Correspondente Bancário. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/politica-privacidade" className="text-primary-foreground/60 hover:text-accent transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-servico" className="text-primary-foreground/60 hover:text-accent transition-colors">
              Termos de Serviço
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
