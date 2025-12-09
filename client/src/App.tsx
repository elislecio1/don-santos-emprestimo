import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public pages
import Home from "./pages/Home";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import SejaParceiro from "./pages/SejaParceiro";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosServico from "./pages/TermosServico";
import Simulador from "./pages/Simulador";
import Cadastro from "./pages/Cadastro";

// Admin pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPropostas from "./pages/admin/Propostas";
import AdminFatores from "./pages/admin/Fatores";
import AdminExportar from "./pages/admin/Exportar";
import AdminConfiguracoes from "./pages/admin/Configuracoes";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/quem-somos" component={QuemSomos} />
      <Route path="/contato" component={Contato} />
      <Route path="/seja-parceiro" component={SejaParceiro} />
      <Route path="/politica-privacidade" component={PoliticaPrivacidade} />
      <Route path="/termos-servico" component={TermosServico} />
      <Route path="/simulador" component={Simulador} />
      <Route path="/cadastro" component={Cadastro} />

      {/* Admin routes */}
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/propostas">
        <AdminLayout>
          <AdminPropostas />
        </AdminLayout>
      </Route>
      <Route path="/admin/fatores">
        <AdminLayout>
          <AdminFatores />
        </AdminLayout>
      </Route>
      <Route path="/admin/exportar">
        <AdminLayout>
          <AdminExportar />
        </AdminLayout>
      </Route>
      <Route path="/admin/configuracoes">
        <AdminLayout>
          <AdminConfiguracoes />
        </AdminLayout>
      </Route>

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
