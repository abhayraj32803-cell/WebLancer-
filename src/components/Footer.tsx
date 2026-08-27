import React from "react";
import { useApp } from "../context/AppContext";
import { Layers, ShieldCheck, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 text-sm">
      {/* Top Value Banner */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white text-xs font-semibold uppercase tracking-wider">Razorpay Escrow Security</h5>
              <p className="text-xs text-slate-400 mt-0.5">Funds safely held until you approve milestone deliverables.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white text-xs font-semibold uppercase tracking-wider">Vetted Talent Verification</h5>
              <p className="text-xs text-slate-400 mt-0.5">Manual portfolio inspection & identity verification audits.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-white text-xs font-semibold uppercase tracking-wider">Impartial Dispute Mediation</h5>
              <p className="text-xs text-slate-400 mt-0.5">24/7 dedicated support and transparent arbitration.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Web<span className="text-blue-500">Lancer</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier marketplace connecting forward-thinking clients with elite engineers and designers for Websites, Full-Stack Web Apps, Mobile Solutions, and UI/UX Systems.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              All systems operational • Razorpay live & secure
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3.5">For Clients</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate("post-project")} className="hover:text-white transition-colors">
                  Post a Project
                </button>
              </li>
              <li>
                <button onClick={() => navigate("find-freelancers")} className="hover:text-white transition-colors">
                  Browse Freelancers
                </button>
              </li>
              <li>
                <button onClick={() => navigate("how-it-works")} className="hover:text-white transition-colors">
                  Escrow & Milestones
                </button>
              </li>
              <li>
                <button onClick={() => navigate("client-dashboard")} className="hover:text-white transition-colors">
                  Client Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3.5">For Freelancers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate("find-work")} className="hover:text-white transition-colors">
                  Find Projects
                </button>
              </li>
              <li>
                <button onClick={() => navigate("how-it-works")} className="hover:text-white transition-colors">
                  Earnings & Settlement
                </button>
              </li>
              <li>
                <button onClick={() => navigate("auth", { mode: "register", role: "freelancer" })} className="hover:text-white transition-colors">
                  Apply as Freelancer
                </button>
              </li>
              <li>
                <button onClick={() => navigate("freelancer-dashboard")} className="hover:text-white transition-colors">
                  Freelancer Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3.5">Company & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate("about")} className="hover:text-white transition-colors">
                  About WebLancer
                </button>
              </li>
              <li>
                <button onClick={() => navigate("contact")} className="hover:text-white transition-colors">
                  Support & Help Center
                </button>
              </li>
              <li>
                <button onClick={() => navigate("how-it-works")} className="hover:text-white transition-colors">
                  Trust & Safety Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate("admin-dashboard")} className="hover:text-white transition-colors text-slate-500">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 WebLancer Technologies. All rights reserved. Post. Hire. Build.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => navigate("about")} className="hover:text-slate-400">
              Terms of Service
            </button>
            <button onClick={() => navigate("about")} className="hover:text-slate-400">
              Privacy Policy
            </button>
            <button onClick={() => navigate("contact")} className="hover:text-slate-400">
              Dispute Resolution
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
