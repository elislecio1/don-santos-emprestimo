import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Phone,
  Calculator,
  Handshake,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  Send,
  Building2,
  Briefcase,
  DollarSign,
  HeadphonesIcon,
} from "lucide-react";

export default function SejaParceiro() {
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    cnpj: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Cadastro enviado com sucesso! Nossa equipe entrará em contato em breve.");
    setFormData({ nome: "", empresa: "", cnpj: "", email: "", telefone: "", cidade: "", estado: "", mensagem: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            <div className="flex items-center gap-4">
              <a href="tel:08008802525" className="hidden md:flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-5 h-5" />
                <span className="font-semibold">0800 880 2525</span>
              </a>
              <Link href="/simulador">
                <Button className="btn-gold">
                  <Calculator className="w-4 h-4 mr-2" />
                  Simular
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="container relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
                Oportunidade de Negócio
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Seja um <span className="text-gold">Parceiro</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Torne-se um subestabelecido Don Santos e faça parte de uma rede de sucesso no mercado de crédito consignado.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Comissões atrativas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Suporte completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Treinamento gratuito</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                      <Handshake className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Parceria de Sucesso</h3>
                      <p className="text-white/70">Cresça conosco</p>
                    </div>
                  </div>
                  <p className="text-white/80">
                    Junte-se a uma empresa com mais de 13 anos de experiência e construa uma carreira sólida no mercado financeiro.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vantagens de ser Parceiro
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça os benefícios exclusivos para nossos subestabelecidos
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Comissões Atrativas",
                description: "Ganhos competitivos por cada operação realizada com pagamento pontual.",
              },
              {
                icon: HeadphonesIcon,
                title: "Suporte Dedicado",
                description: "Equipe especializada para auxiliar em todas as etapas do processo.",
              },
              {
                icon: Award,
                title: "Treinamento Completo",
                description: "Capacitação gratuita sobre produtos, sistemas e técnicas de venda.",
              },
              {
                icon: TrendingUp,
                title: "Crescimento",
                description: "Oportunidade de expandir seus negócios com uma marca consolidada.",
              },
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como se tornar Parceiro
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Processo simples e rápido para começar sua parceria
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: Send,
                title: "Cadastre-se",
                description: "Preencha o formulário com seus dados e informações da empresa.",
              },
              {
                step: "02",
                icon: Users,
                title: "Análise",
                description: "Nossa equipe analisará seu cadastro e entrará em contato.",
              },
              {
                step: "03",
                icon: Briefcase,
                title: "Treinamento",
                description: "Receba capacitação completa sobre nossos produtos e sistemas.",
              },
              {
                step: "04",
                icon: TrendingUp,
                title: "Comece a Vender",
                description: "Inicie suas operações e comece a faturar com a Don Santos.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                      <item.icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-muted-foreground/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Cadastre-se como Parceiro
              </h2>
              <p className="text-muted-foreground mb-8">
                Preencha o formulário abaixo para iniciar sua jornada como parceiro Don Santos. Nossa equipe entrará em contato para dar continuidade ao processo.
              </p>

              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Pessoa Jurídica</h4>
                        <p className="text-sm text-muted-foreground">CNPJ ativo e regularizado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Experiência no Mercado</h4>
                        <p className="text-sm text-muted-foreground">Desejável experiência em crédito</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Comprometimento</h4>
                        <p className="text-sm text-muted-foreground">Dedicação e ética nos negócios</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6">Formulário de Cadastro</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        placeholder="Seu nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Nome da empresa *</Label>
                      <Input
                        id="empresa"
                        name="empresa"
                        placeholder="Razão social"
                        value={formData.empresa}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        placeholder="Sua cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado *</Label>
                      <Input
                        id="estado"
                        name="estado"
                        placeholder="UF"
                        maxLength={2}
                        value={formData.estado}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem (opcional)</Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      placeholder="Conte-nos sobre sua experiência no mercado..."
                      rows={4}
                      value={formData.mensagem}
                      onChange={handleChange}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full btn-gold" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Cadastro
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Don Santos Correspondente Bancário. Todos os direitos reservados.
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
