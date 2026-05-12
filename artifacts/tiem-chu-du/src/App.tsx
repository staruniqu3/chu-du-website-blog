import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import BlogListing from "@/pages/BlogListing";
import BlogDetail from "@/pages/BlogDetail";
import OrderRules from "@/pages/OrderRules";
import Admin from "@/pages/Admin";
import Portfolio from "@/pages/Portfolio";
import SovereignClub from "@/pages/SovereignClub";
import { AdminAuthProvider } from "@/components/AdminAuth";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin">
        <AdminAuthProvider>
          <Admin />
        </AdminAuthProvider>
      </Route>
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/blog" component={BlogListing} />
            <Route path="/blog/:id" component={BlogDetail} />
            <Route path="/order-rules" component={OrderRules} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/sovereign-club" component={SovereignClub} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
