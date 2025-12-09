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
  Mail,
  MapPin,
  Clock,
  Send,
  Calculator,
  MessageCircle,
  Building2,
} from "lucide-react";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
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
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Entre em <span className="text-gold">Contato</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Estamos prontos para atender você. Escolha o canal de sua preferência.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Telefone</h3>
                <a href="tel:08008802525" className="text-accent hover:underline font-medium">
                  0800 880 2525
                </a>
                <p className="text-sm text-muted-foreground mt-1">Ligação gratuita</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <a 
                  href="https://wa.me/5575999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline font-medium"
                >
                  (75) 99999-9999
                </a>
                <p className="text-sm text-muted-foreground mt-1">Atendimento rápido</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">E-mail</h3>
                <a href="mailto:contato@donsantosba.com.br" className="text-accent hover:underline font-medium text-sm">
                  contato@donsantosba.com.br
                </a>
                <p className="text-sm text-muted-foreground mt-1">Resposta em até 24h</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Horário</h3>
                <p className="text-foreground font-medium">Seg - Sex</p>
                <p className="text-sm text-muted-foreground">08:00 às 18:00</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Form and Locations */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Envie sua mensagem</h2>
              <p className="text-muted-foreground mb-8">
                Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Digite seu nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
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
                    <Label htmlFor="telefone">Telefone</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem</Label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    placeholder="Como podemos ajudar você?"
                    rows={5}
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full btn-gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Locations */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Nossos Escritórios</h2>
              <p className="text-muted-foreground mb-8">
                Visite um de nossos escritórios para atendimento presencial.
              </p>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">Paulo Afonso - BA</h3>
                        <p className="text-muted-foreground mb-4">Matriz</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-accent mt-0.5" />
                            <span>Centro, Paulo Afonso - BA, CEP 48607-000</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-accent" />
                            <span>0800 880 2525</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" />
                            <span>Seg - Sex: 08:00 às 18:00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-7 h-7 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">Delmiro Gouveia - AL</h3>
                        <p className="text-muted-foreground mb-4">Filial</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-accent mt-0.5" />
                            <span>Centro, Delmiro Gouveia - AL, CEP 57480-000</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-accent" />
                            <span>0800 880 2525</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" />
                            <span>Seg - Sex: 08:00 às 18:00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
