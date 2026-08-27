import React from "react";
import { useApp } from "../context/AppContext";
import { Layers, ShieldCheck, Heart, Users, Target, Lock, Award, CheckCircle2 } from "lucide-react";

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <Layers className="w-4 h-4" />
          <span>Our Vision & Values</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Empowering the World's Digital Builders
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          WebLancer was founded with a singular conviction: high-stakes digital projects deserve transparent milestone escrow, verified talent standards, and respectful collaboration.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Absolute Financial Safety</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminating payment uncertainty through Razorpay escrow. Clients only pay for approved deliverables, and freelancers are guaranteed payout upon completion.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Craftsmanship Standards</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We reject low-quality bid spam. Every freelancer profile is structured around verified GitHub repos, live production links, and honest client reviews.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Long-Term Partnerships</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Beyond one-off gigs, our workspaces foster continuous product collaboration between ambitious companies and world-class engineers.
          </p>
        </div>
      </div>

      {/* Brand & Stats */}
      <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Built for Reliability & Speed</h2>
          <p className="text-xs text-slate-400">Trusted by founders, scale-ups, and elite independent contractors across India and globally.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-slate-800/80 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 block">₹4.2 Cr+</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Milestones Escrowed</span>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">99.2%</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Contract Completion</span>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 block">100%</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Razorpay Protected</span>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-2xl">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block">&lt; 2 hrs</span>
            <span className="text-[11px] text-slate-400 mt-1 block">First Proposal Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
