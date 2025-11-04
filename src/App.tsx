
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Materials from "./pages/Materials";
import Production from "./pages/Production";
import Partners from "./pages/Partners";
import VendorDashboard from "./pages/VendorDashboard";
import NotFound from "./pages/NotFound";
import ThreeDPrinting from "./pages/3DPrinting";
import CADModeling from "./pages/CADModeling";
import LaserEngraving from "./pages/LaserEngraving";
import ManufacturingSolutions from "./pages/ManufacturingSolutions";
import CNCMachining from "./pages/CNCMachining";
import SheetMetalFabrication from "./pages/SheetMetalFabrication";
import DatabaseSetup from "./pages/DatabaseSetup";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/production" element={<Production />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/3d-printing" element={<ThreeDPrinting />} />
            <Route path="/cad-modeling" element={<CADModeling />} />
            <Route path="/laser-engraving" element={<LaserEngraving />} />
            <Route path="/manufacturing-solutions" element={<ManufacturingSolutions />} />
            <Route path="/cnc-machining" element={<CNCMachining />} />
            <Route path="/sheet-metal-fabrication" element={<SheetMetalFabrication />} />
            <Route path="/database-setup" element={<DatabaseSetup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vendor-dashboard" 
              element={
                <ProtectedRoute>
                  <VendorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
