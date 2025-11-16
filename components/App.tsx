import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SelectUserType from "./pages/SelectUserType";
import Dashboard from "./pages/Dashboard";
import DashboardMorador from "./pages/dashboards/DashboardMorador";
import DashboardAdministradora from "./pages/dashboards/DashboardAdministradora";
import DashboardPrestador from "./pages/dashboards/DashboardPrestador";
import Marketplace from "./pages/Marketplace";
import PrestadorProfile from "./pages/PrestadorProfile";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/select-user-type"} component={SelectUserType} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/dashboard/morador"} component={DashboardMorador} />
      <Route path={"/dashboard/administradora"} component={DashboardAdministradora} />
      <Route path={"/dashboard/prestador"} component={DashboardPrestador} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/prestador/:id"} component={PrestadorProfile} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
