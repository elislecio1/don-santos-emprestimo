import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, Users, Mail, Phone } from "lucide-react";
import { Brand } from "@/components/Brand";

export default function TermosServico() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-50 shadow-lg">
        <div className="container">
          <div className="flex items-center justify-between">
            <Brand variant="light" />
            <Link href="/">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient text-white py-12 md:py-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
              <Scale className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Termos de Serviço</h1>
              <p className="text-white/70">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            {/* Introdução */}
            <section className="mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Bem-vindo aos Termos de Serviço da <strong>DS PROMOTORA DE VENDAS LTDA</strong> ("DS PROMOTORA", "nós", "nosso" ou "nossa"), inscrita no CNPJ sob o nº 54.419.054/0001-15. Ao acessar ou utilizar nosso site e serviços, você concorda em cumprir e estar vinculado a estes Termos de Serviço.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Por favor, leia atentamente estes termos antes de utilizar nossos serviços. Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site ou serviços.
              </p>
            </section>

            {/* Seção 1 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">1. Definições</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>"Site":</strong> O website www.donsantosba.com.br e todas as suas páginas e funcionalidades</li>
                <li><strong>"Serviços":</strong> Todos os serviços oferecidos pela DS PROMOTORA, incluindo simulação de empréstimo, intermediação de crédito consignado e serviços correlatos</li>
                <li><strong>"Usuário":</strong> Qualquer pessoa que acesse ou utilize o Site e/ou os Serviços</li>
                <li><strong>"Proposta":</strong> Solicitação de empréstimo submetida pelo Usuário através do Site</li>
                <li><strong>"Instituição Financeira":</strong> Bancos e instituições financeiras parceiras que concedem o crédito</li>
              </ul>
            </section>

            {/* Seção 2 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">2. Descrição dos Serviços</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                A DS PROMOTORA atua como <strong>correspondente bancário</strong>, intermediando operações de crédito entre os Usuários e as Instituições Financeiras parceiras. Nossos serviços incluem:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Simulação de empréstimo consignado</li>
                <li>Coleta e encaminhamento de propostas de crédito</li>
                <li>Orientação sobre produtos e condições de crédito</li>
                <li>Acompanhamento do processo de contratação</li>
              </ul>
              <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-foreground">
                  <strong>Importante:</strong> A DS PROMOTORA não é uma instituição financeira e não concede crédito diretamente. A aprovação do crédito está sujeita à análise e decisão exclusiva das Instituições Financeiras parceiras.
                </p>
              </div>
            </section>

            {/* Seção 3 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">3. Elegibilidade e Cadastro</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Para utilizar nossos Serviços, o Usuário deve:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Ter no mínimo 18 (dezoito) anos de idade</li>
                <li>Possuir capacidade civil plena</li>
                <li>Fornecer informações verdadeiras, precisas e completas</li>
                <li>Ser aposentado, pensionista do INSS ou servidor público (para empréstimo consignado)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                O Usuário é responsável pela veracidade de todas as informações fornecidas. A prestação de informações falsas ou incompletas pode resultar na recusa da proposta e em medidas legais cabíveis.
              </p>
            </section>

            {/* Seção 4 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">4. Processo de Contratação</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground">4.1 Simulação</h4>
                  <p>A simulação realizada no Site tem caráter meramente informativo e não constitui oferta de crédito. Os valores apresentados podem variar de acordo com a análise da Instituição Financeira.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">4.2 Envio de Proposta</h4>
                  <p>Ao enviar uma proposta, o Usuário autoriza a DS PROMOTORA a encaminhar seus dados às Instituições Financeiras parceiras para análise de crédito.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">4.3 Análise e Aprovação</h4>
                  <p>A aprovação do crédito é de responsabilidade exclusiva da Instituição Financeira, que realizará análise cadastral e de crédito conforme suas políticas internas.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">4.4 Formalização</h4>
                  <p>Após aprovação, o contrato será formalizado diretamente com a Instituição Financeira, que estabelecerá as condições definitivas do empréstimo.</p>
                </div>
              </div>
            </section>

            {/* Seção 5 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">5. Obrigações do Usuário</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                O Usuário se compromete a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Não utilizar o Site para fins ilícitos ou não autorizados</li>
                <li>Não tentar acessar áreas restritas do Site</li>
                <li>Não interferir no funcionamento do Site</li>
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Comunicar imediatamente qualquer uso não autorizado de sua conta</li>
              </ul>
            </section>

            {/* Seção 6 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">6. Limitação de Responsabilidade</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                A DS PROMOTORA não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Decisões de crédito tomadas pelas Instituições Financeiras</li>
                <li>Atrasos ou falhas na análise de propostas pelas Instituições Financeiras</li>
                <li>Diferenças entre valores simulados e valores efetivamente contratados</li>
                <li>Indisponibilidade temporária do Site por motivos técnicos</li>
                <li>Danos decorrentes de informações incorretas fornecidas pelo Usuário</li>
                <li>Atos de terceiros que possam afetar o serviço</li>
              </ul>
            </section>

            {/* Seção 7 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">7. Propriedade Intelectual</h2>
              </div>
              <p className="text-muted-foreground">
                Todo o conteúdo do Site, incluindo textos, imagens, logotipos, marcas, layout e software, é de propriedade da DS PROMOTORA ou de seus licenciadores e está protegido pelas leis de propriedade intelectual. É proibida a reprodução, distribuição ou modificação de qualquer conteúdo sem autorização prévia e expressa.
              </p>
            </section>

            {/* Seção 8 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">8. Comunicações via WhatsApp</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Ao fornecer seu número de telefone, o Usuário autoriza a DS PROMOTORA a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Enviar mensagens via WhatsApp relacionadas à sua proposta de empréstimo</li>
                <li>Enviar notificações sobre o status da análise de crédito</li>
                <li>Solicitar documentos ou informações adicionais</li>
                <li>Enviar comunicações de atendimento ao cliente</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                O Usuário pode solicitar a interrupção das comunicações a qualquer momento, entrando em contato conosco pelos canais disponíveis.
              </p>
            </section>

            {/* Seção 9 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">9. Alterações nos Termos</h2>
              </div>
              <p className="text-muted-foreground">
                A DS PROMOTORA reserva-se o direito de modificar estes Termos de Serviço a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no Site. O uso continuado dos Serviços após a publicação de alterações constitui aceitação dos novos termos.
              </p>
            </section>

            {/* Seção 10 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">10. Legislação Aplicável e Foro</h2>
              </div>
              <p className="text-muted-foreground">
                Estes Termos de Serviço são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Paulo Afonso, Estado da Bahia, para dirimir quaisquer controvérsias decorrentes destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            {/* Seção 11 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">11. Contato</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Para dúvidas, sugestões ou reclamações sobre estes Termos de Serviço, entre em contato:
              </p>
              <div className="bg-background p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-foreground">donsantosba@donsantosba.com.br</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-foreground">0800 880 2525</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} DS PROMOTORA Correspondente Bancário. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/politica-privacidade" className="text-primary-foreground/60 hover:text-accent transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-servico" className="text-accent hover:underline">
              Termos de Serviço
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
