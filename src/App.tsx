
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuerifyProvider } from "./context/QuerifyContext";
import RootLayout from "./components/RootLayout";
import Index from "./pages/Index";
import AskPage from "./pages/AskPage";
import About from "./pages/About";
import BlogPage from "./pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QuerifyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/ask" element={<AskPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<BlogPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QuerifyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
