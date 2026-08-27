import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  DollarSign,
  UserCheck,
  Briefcase,
  HelpCircle
} from "lucide-react";

export const HowItWorksPage: React.FC = () => {
  const { navigate } = useApp();
  const [activeRole, setActiveRole] = useState<"client" | "freelancer">("client");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The WebLancer Standard</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How WebLancer Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          A secure, milestone-driven freelance marketplace designed to eliminate project risk, align expectations, and guarantee on-time payment delivery.
        </p>

        {/* Role Toggle Switch */}
        <div className="pt-4 flex justify-center">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveRole("client")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === "client"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              I am a Client (Hiring)
            </button>
            <button
              onClick={() => setActiveRole("freelancer")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeRole === "freelancer"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              I am a Freelancer (Looking for Work)
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Walkthrough based on selected role */}
      {activeRole === "client" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Post Your Brief</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Describe your requirements or use the Gemini AI Brief Generator to automatically formulate feature lists, technical scopes, and timeline benchmarks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Compare Proposals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review structured proposals from vetted freelancers. Examine live portfolios, verified client ratings, and proposed milestone breakdowns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Fund Milestones</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fund the active milestone securely through Razorpay escrow. The freelancer starts work knowing funds are safely committed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base">Approve & Release</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect deliverable submissions and code inside the Dedicated Workspace. Request revisions or approve to release payout instantly.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigate("post-project")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Post Your Project Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Complete Pro Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your technical proficiencies, showcase live projects with live URLs, and complete identity verification for the Verified Pro badge.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Submit Win Proposals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse open client projects. Use our AI proposal enhancer to refine your cover letter and articulate clear milestone deliverables.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Work in Workspace</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Build with confidence. Receive notifications when milestones are funded in escrow. Chat, share files, and submit deliverables.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base">Guaranteed Payout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upon milestone approval, earnings are credited immediately with transparent 10% platform fee and automated TDS settlement into your bank.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigate("find-work")}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Explore Open Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Escrow Deep-Dive Details */}
      <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">The WebLancer Escrow Guarantee</h2>
            <p className="text-xs sm:text-sm text-slate-400">Powered by Razorpay Verified Signature Workflows</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">1. Protected Milestone Deposits</h4>
            <p className="text-slate-400 leading-relaxed">
              Clients do not pay freelancers upfront blindly. Instead, funds for each specific milestone are deposited into a secure escrow hold.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">2. Inspect Before Releasing</h4>
            <p className="text-slate-400 leading-relaxed">
              Clients have full authority to review deliverables, test staging URLs, and request revisions before approving release of payment.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">3. Fair Dispute Arbitration</h4>
            <p className="text-slate-400 leading-relaxed">
              In case of scope disagreements, WebLancer's mediation team steps in with AI contract analysis to provide impartial dispute resolutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
