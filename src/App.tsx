
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateStory from "./pages/CreateStory";
import ViewStory from "./pages/ViewStory";
import CartoonConverter from "./pages/CartoonConverter";
import SmsSettings from "./pages/SmsSettings";
import Priceing from "./pages/Pricing";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateStory />} />
          <Route path="/story/:id" element={<ViewStory />} />
          <Route path="/cartoon" element={<CartoonConverter />} />
          <Route path="/how-it-works" element={<CartoonConverter />} />
          <Route path="/settings/sms" element={<SmsSettings />} />
          <Route path="/pricing" element={<Priceing />} />

          {/* For API routes, in a real application, these would be handled by a backend server */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
