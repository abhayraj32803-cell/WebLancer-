import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { RoleSwitcherBar } from "./components/RoleSwitcherBar";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ToastNotification } from "./components/ToastNotification";

// Pages
import { HomePage } from "./pages/HomePage";
import { FindFreelancersPage } from "./pages/FindFreelancersPage";
import { FreelancerProfilePage } from "./pages/FreelancerProfilePage";
import { FindWorkPage } from "./pages/FindWorkPage";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import { PostProjectPage } from "./pages/PostProjectPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AuthPage } from "./pages/AuthPage";
import { ClientDashboard } from "./pages/ClientDashboard";
import { FreelancerDashboard } from "./pages/FreelancerDashboard";
import { ProjectWorkspacePage } from "./pages/ProjectWorkspacePage";
import { AdminDashboard } from "./pages/AdminDashboard";

const MainRouter: React.FC = () => {
  const { nav } = useApp();

  const renderCurrentPage = () => {
    switch (nav.page) {
      case "home":
        return <HomePage />;
      case "find-freelancers":
        return <FindFreelancersPage />;
      case "freelancer-profile":
        return <FreelancerProfilePage />;
      case "find-work":
        return <FindWorkPage />;
      case "project-details":
        return <ProjectDetailsPage />;
      case "post-project":
        return <PostProjectPage />;
      case "how-it-works":
        return <HowItWorksPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "auth":
        return <AuthPage />;
      case "client-dashboard":
        return <ClientDashboard />;
      case "freelancer-dashboard":
        return <FreelancerDashboard />;
      case "project-workspace":
        return <ProjectWorkspacePage />;
      case "admin-dashboard":
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white font-sans antialiased">
      {/* Top Testing & Role Switcher Bar */}
      <RoleSwitcherBar />

      {/* Main App Navigation Bar */}
      <Header />

      {/* Dynamic Main View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Main App Footer */}
      <Footer />

      {/* Toast Feedback Notification */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
