import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calculator,
  ChevronRight,
} from "lucide-react";

export default function QuemSomos() {
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="container relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quem <span className="text-gold">Somos</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Conheça a história e os valores da Don Santos Correspondente Bancário
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
                Nossa História
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Mais de 13 anos transformando vidas
              </h2>
              <p className="text-muted-foreground mb-4">
                A <strong>DS CORRESPONDENTE BANCARIOS LTDA</strong>, conhecida como Don Santos, nasceu com o propósito de facilitar o acesso ao crédito para aposentados, pensionistas e servidores públicos no Nordeste brasileiro.
              </p>
              <p className="text-muted-foreground mb-4">
                Com mais de 13 anos de experiência no mercado, nos consolidamos como referência em operações de empréstimos consignados, sempre priorizando o atendimento humanizado e as melhores condições para nossos clientes.
              </p>
              <p className="text-muted-foreground">
                Nossa trajetória é marcada pela confiança de milhares de clientes que realizaram seus sonhos através de nossos serviços, seja para quitar dívidas, reformar a casa, investir em educação ou simplesmente ter mais tranquilidade financeira.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-gold mb-2">13+</div>
                  <div className="text-sm text-primary-foreground/70">Anos de Experiência</div>
                </CardContent>
              </Card>
              <Card className="bg-accent text-accent-foreground">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">10k+</div>
                  <div className="text-sm">Clientes Atendidos</div>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">2</div>
                  <div className="text-sm text-muted-foreground">Escritórios</div>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Comprometimento</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Missão, Visão e Valores
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Os pilares que guiam nossa atuação e compromisso com você
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Missão</h3>
                <p className="text-muted-foreground">
                  Facilitar o acesso ao crédito de forma transparente e humanizada, oferecendo as melhores soluções financeiras para nossos clientes realizarem seus sonhos e melhorarem sua qualidade de vida.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4">Visão</h3>
                <p className="text-muted-foreground">
                  Ser reconhecida como a principal referência em correspondência bancária no Nordeste, destacando-se pela excelência no atendimento e pela confiança de nossos clientes e parceiros.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Valores</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Ética e Transparência
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Respeito ao Cliente
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Compromisso com Resultados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Inovação Constante
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que escolher a Don Santos?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossos diferenciais fazem toda a diferença na sua experiência
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Atendimento Personalizado",
                description: "Cada cliente é único. Oferecemos atendimento individualizado para entender suas necessidades.",
              },
              {
                icon: Shield,
                title: "Segurança Total",
                description: "Seus dados são protegidos com as mais avançadas tecnologias de segurança.",
              },
              {
                icon: Clock,
                title: "Agilidade",
                description: "Processo rápido e desburocratizado. Seu tempo é valioso para nós.",
              },
              {
                icon: Award,
                title: "Melhores Taxas",
                description: "Parcerias com os principais bancos para oferecer as melhores condições do mercado.",
              },
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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

      {/* Localização */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos <span className="text-gold">Escritórios</span>
            </h2>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              Estamos presentes em duas cidades estratégicas do Nordeste
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Paulo Afonso</h3>
                    <p className="text-primary-foreground/70">Bahia</p>
                  </div>
                </div>
                <div className="space-y-3 text-primary-foreground/80">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-0.5" />
                    <span>Centro, Paulo Afonso - BA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <span>0800 880 2525</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Delmiro Gouveia</h3>
                    <p className="text-primary-foreground/70">Alagoas</p>
                  </div>
                </div>
                <div className="space-y-3 text-primary-foreground/80">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-0.5" />
                    <span>Centro, Delmiro Gouveia - AL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <span>0800 880 2525</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-gold">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Pronto para conhecer nossas soluções?
          </h2>
          <p className="text-navy/80 mb-8 max-w-2xl mx-auto">
            Faça agora sua simulação e descubra como podemos ajudar você a realizar seus sonhos.
          </p>
          <Link href="/simulador">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Calculator className="w-5 h-5 mr-2" />
              Simular Empréstimo
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
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
