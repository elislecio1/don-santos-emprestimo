import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, Mail, Phone } from "lucide-react";

export default function PoliticaPrivacidade() {
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
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Política de Privacidade</h1>
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
                A <strong>DS CORRESPONDENTE BANCARIOS LTDA</strong> ("Don Santos", "nós", "nosso" ou "nossa"), inscrita no CNPJ sob o nº XX.XXX.XXX/0001-XX, com sede em Paulo Afonso - BA, está comprometida em proteger a privacidade e os dados pessoais de nossos clientes, parceiros e visitantes do nosso site.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais legislações aplicáveis.
              </p>
            </section>

            {/* Seção 1 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">1. Dados que Coletamos</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Coletamos os seguintes tipos de dados pessoais para a prestação de nossos serviços:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Dados de Identificação:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Nome completo</li>
                    <li>CPF</li>
                    <li>RG ou CNH</li>
                    <li>Data de nascimento</li>
                    <li>Filiação (nome da mãe)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Dados de Contato:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Endereço completo</li>
                    <li>Telefone</li>
                    <li>E-mail</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Dados Bancários:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Banco</li>
                    <li>Agência</li>
                    <li>Número da conta</li>
                    <li>Tipo de conta</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Documentos:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Imagem do RG (frente e verso)</li>
                    <li>Comprovante de residência</li>
                    <li>Foto (selfie) para validação de identidade</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seção 2 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">2. Finalidade do Tratamento</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Utilizamos seus dados pessoais para as seguintes finalidades:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Análise de crédito:</strong> Avaliar sua elegibilidade para produtos de empréstimo consignado</li>
                <li><strong>Formalização de contratos:</strong> Elaborar e processar contratos de empréstimo</li>
                <li><strong>Comunicação:</strong> Entrar em contato sobre sua proposta, enviar atualizações e informações relevantes</li>
                <li><strong>Cumprimento legal:</strong> Atender obrigações legais e regulatórias</li>
                <li><strong>Prevenção a fraudes:</strong> Verificar sua identidade e prevenir atividades fraudulentas</li>
                <li><strong>Melhoria de serviços:</strong> Aprimorar nossos produtos e atendimento</li>
              </ul>
            </section>

            {/* Seção 3 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">3. Base Legal para o Tratamento</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                O tratamento de seus dados pessoais é realizado com base nas seguintes hipóteses legais previstas na LGPD:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Execução de contrato:</strong> Para a prestação dos serviços solicitados (Art. 7º, V)</li>
                <li><strong>Cumprimento de obrigação legal:</strong> Para atender exigências regulatórias (Art. 7º, II)</li>
                <li><strong>Legítimo interesse:</strong> Para prevenção a fraudes e melhoria de serviços (Art. 7º, IX)</li>
                <li><strong>Consentimento:</strong> Quando aplicável, para finalidades específicas (Art. 7º, I)</li>
              </ul>
            </section>

            {/* Seção 4 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">4. Compartilhamento de Dados</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Seus dados pessoais podem ser compartilhados com:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Instituições financeiras parceiras:</strong> Para análise e concessão de crédito</li>
                <li><strong>Órgãos reguladores:</strong> Quando exigido por lei ou regulamentação</li>
                <li><strong>Prestadores de serviços:</strong> Empresas que nos auxiliam na operação (armazenamento em nuvem, comunicação)</li>
                <li><strong>Autoridades públicas:</strong> Quando houver determinação legal ou judicial</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Todos os terceiros com quem compartilhamos dados estão obrigados a manter a confidencialidade e segurança das informações.
              </p>
            </section>

            {/* Seção 5 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">5. Segurança dos Dados</h2>
              </div>
              <p className="text-muted-foreground">
                Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso restritos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Treinamento de colaboradores em proteção de dados</li>
                <li>Armazenamento seguro em servidores protegidos</li>
              </ul>
            </section>

            {/* Seção 6 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">6. Seus Direitos</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                De acordo com a LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Solicitar a correção de dados incompletos ou desatualizados</li>
                <li><strong>Anonimização ou eliminação:</strong> Solicitar a anonimização ou exclusão de dados desnecessários</li>
                <li><strong>Portabilidade:</strong> Solicitar a transferência de seus dados para outro fornecedor</li>
                <li><strong>Revogação do consentimento:</strong> Retirar seu consentimento a qualquer momento</li>
                <li><strong>Informação sobre compartilhamento:</strong> Saber com quem seus dados são compartilhados</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento em determinadas situações</li>
              </ul>
            </section>

            {/* Seção 7 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">7. Retenção de Dados</h2>
              </div>
              <p className="text-muted-foreground">
                Seus dados pessoais serão mantidos pelo tempo necessário para cumprir as finalidades para as quais foram coletados, incluindo obrigações legais, contratuais, de prestação de contas ou requisição de autoridades competentes. Após esse período, os dados serão eliminados ou anonimizados de forma segura.
              </p>
            </section>

            {/* Seção 8 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">8. Contato e Encarregado de Dados</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato conosco:
              </p>
              <div className="bg-background p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-foreground">privacidade@donsantosba.com.br</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-foreground">0800 880 2525</span>
                </div>
              </div>
            </section>

            {/* Seção 9 */}
            <section className="mb-10 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground m-0">9. Alterações nesta Política</h2>
              </div>
              <p className="text-muted-foreground">
                Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou em requisitos legais. Recomendamos que você revise esta página regularmente. A data da última atualização está indicada no início deste documento.
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Don Santos Correspondente Bancário. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/politica-privacidade" className="text-accent hover:underline">
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
