import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@client/components/ui/toaster";
import NotFound from "@client/pages/not-found";
import HomePage from "@client/pages/home-page";
import AuthPage from "@client/pages/auth-page";
import ProfilePage from "@client/pages/profile-page";
import { AuthProvider } from "@client/hooks/use-auth";
import { Navbar } from "@client/components/navbar";
import { queryClient } from "./lib/queryClient";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
