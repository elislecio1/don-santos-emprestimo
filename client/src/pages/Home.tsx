import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  CreditCard,
  Shield,
  Users,
  Building2,
  ChevronRight,
  CheckCircle2,
  Calculator,
  FileText,
  Handshake,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">DS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold leading-tight">Don Santos</h1>
                <p className="text-xs text-primary-foreground/80">Correspondente Bancário</p>
              </div>
            </Link>

            {/* Contact Info */}
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:08008802525" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-5 h-5" />
                <span className="font-semibold">0800 880 2525</span>
              </a>
            </div>

            {/* CTA Button */}
            <Link href="/simulador">
              <Button className="btn-gold">
                <Calculator className="w-4 h-4 mr-2" />
                Simular Agora
              </Button>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="border-t border-primary-foreground/20">
            <ul className="flex items-center gap-1 py-2 overflow-x-auto">
              <li>
                <Link href="/" className="px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors inline-block text-sm font-medium">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/quem-somos" className="px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors inline-block text-sm font-medium">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/simulador" className="px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors inline-block text-sm font-medium">
                  Simulador
                </Link>
              </li>
              <li>
                <Link href="/seja-parceiro" className="px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors inline-block text-sm font-medium">
                  Seja Parceiro
                </Link>
              </li>
              <li>
                <Link href="/contato" className="px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors inline-block text-sm font-medium">
                  Contato
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
                + de 13 anos de experiência
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Especialistas em{" "}
                <span className="text-gold">Empréstimo Consignado</span>
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                A Don Santos Correspondente Bancário oferece as melhores condições do mercado para você realizar seus sonhos. Simule agora e descubra quanto você pode contratar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/simulador">
                  <Button size="lg" className="btn-gold w-full sm:w-auto">
                    <Calculator className="w-5 h-5 mr-2" />
                    Fazer Simulação
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="tel:08008802525">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                    <Phone className="w-5 h-5 mr-2" />
                    0800 880 2525
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl"></div>
                <Card className="relative bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-white">Por que escolher a Don Santos?</h3>
                    <ul className="space-y-4">
                      {[
                        "Atendimento personalizado",
                        "Melhores taxas do mercado",
                        "Processo 100% digital",
                        "Aprovação rápida",
                        "Sem consulta ao SPC/Serasa",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-white/90">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Áreas de Atuação
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oferecemos soluções financeiras completas para atender todas as suas necessidades
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CreditCard,
                title: "Empréstimo Consignado",
                description: "As melhores taxas para aposentados, pensionistas e servidores públicos.",
              },
              {
                icon: CreditCard,
                title: "Cartão de Crédito",
                description: "Cartões com benefícios exclusivos e condições especiais.",
              },
              {
                icon: Shield,
                title: "Seguros",
                description: "Proteção completa para você e sua família com os melhores planos.",
              },
              {
                icon: Users,
                title: "Associações",
                description: "Parcerias com associações para benefícios exclusivos aos membros.",
              },
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Processo simples e rápido para você conseguir seu empréstimo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                step: "01",
                title: "Faça sua Simulação",
                description: "Use nosso simulador online para descobrir o valor que você pode contratar e as parcelas.",
              },
              {
                icon: FileText,
                step: "02",
                title: "Envie seus Documentos",
                description: "Preencha o formulário com seus dados e envie as fotos dos documentos necessários.",
              },
              {
                icon: Handshake,
                step: "03",
                title: "Receba seu Crédito",
                description: "Após a análise, o valor é depositado diretamente na sua conta bancária.",
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
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-muted-foreground/30"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/simulador">
              <Button size="lg" className="btn-gold">
                Começar Simulação
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Sobre a <span className="text-gold">Don Santos</span>
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                Com mais de 13 anos de experiência no mercado, a Don Santos Correspondente Bancário se consolidou como referência em operações de empréstimos consignados no Nordeste brasileiro.
              </p>
              <p className="text-primary-foreground/80 mb-8">
                Nossa equipe possui conhecimento e capacidade para estar sempre disposta a atender as necessidades de nossos clientes e parceiros, trazendo a experiência e a exigência de quem busca ser a primeira em excelência.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold text-gold mb-2">13+</div>
                  <div className="text-primary-foreground/70">Anos de Experiência</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gold mb-2">10k+</div>
                  <div className="text-primary-foreground/70">Clientes Atendidos</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Building2 className="w-10 h-10 mx-auto mb-3 text-accent" />
                  <h4 className="font-semibold mb-1">Paulo Afonso</h4>
                  <p className="text-sm text-primary-foreground/70">Bahia</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-6 text-center">
                  <Building2 className="w-10 h-10 mx-auto mb-3 text-accent" />
                  <h4 className="font-semibold mb-1">Delmiro Gouveia</h4>
                  <p className="text-sm text-primary-foreground/70">Alagoas</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-gold">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Pronto para realizar seus sonhos?
          </h2>
          <p className="text-navy/80 mb-8 max-w-2xl mx-auto">
            Faça agora sua simulação e descubra quanto você pode contratar com as melhores condições do mercado.
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
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & About */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-xl">DS</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Don Santos</h3>
                  <p className="text-xs text-primary-foreground/70">Correspondente Bancário</p>
                </div>
              </div>
              <p className="text-primary-foreground/70 text-sm mb-4">
                DS CORRESPONDENTE BANCARIOS LTDA - Especialistas em empréstimo consignado com mais de 13 anos de experiência no mercado.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/quem-somos" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Quem Somos
                  </Link>
                </li>
                <li>
                  <Link href="/simulador" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Simulador
                  </Link>
                </li>
                <li>
                  <Link href="/seja-parceiro" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Seja Parceiro
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-primary-foreground/70">
                  <Phone className="w-4 h-4 text-accent" />
                  <a href="tel:08008802525" className="hover:text-accent transition-colors">0800 880 2525</a>
                </li>
                <li className="flex items-center gap-2 text-primary-foreground/70">
                  <Mail className="w-4 h-4 text-accent" />
                  <a href="mailto:contato@donsantosba.com.br" className="hover:text-accent transition-colors">contato@donsantosba.com.br</a>
                </li>
                <li className="flex items-start gap-2 text-primary-foreground/70">
                  <MapPin className="w-4 h-4 text-accent mt-0.5" />
                  <span>Paulo Afonso - BA / Delmiro Gouveia - AL</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-primary-foreground/60">
                © {new Date().getFullYear()} Don Santos Correspondente Bancário. Todos os direitos reservados.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="/politica-privacidade" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  Política de Privacidade
                </Link>
                <Link href="/termos-servico" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  Termos de Serviço
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
