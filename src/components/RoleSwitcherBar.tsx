import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ShieldCheck, UserCheck, Briefcase, Eye, Flame, RefreshCw, Zap } from "lucide-react";
import { RazorpayVerificationModal } from "./RazorpayVerificationModal";

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, currentRole, switchUser, allUsers, navigate, isFirebaseReady, firebaseSyncStatus, seedFirestoreData } = useApp();
  const [showRazorpayTestModal, setShowRazorpayTestModal] = useState(false);

  const clients = allUsers.filter((u) => u.role === "client");
  const freelancers = allUsers.filter((u) => u.role === "freelancer");
  const admins = allUsers.filter((u) => u.role === "admin");

  return (
    <>
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-2">
            {/* Firebase Live Cloud Status */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-[10px]">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Firebase:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {isFirebaseReady ? "Connected (Live)" : firebaseSyncStatus}
              </span>
            </div>

            {/* Razorpay Gateway Status & QA Suite Trigger */}
            <button
              onClick={() => setShowRazorpayTestModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-semibold text-[10px] cursor-pointer transition-colors"
              title="Open Razorpay Payment Verification & Diagnostic Suite"
            >
              <Zap className="w-3 h-3 text-blue-400" />
              <span>Razorpay Verified</span>
              <span className="px-1 py-0.2 bg-blue-600 text-white rounded text-[9px] font-bold">QA Suite</span>
            </button>

            <span className="text-slate-400 hidden md:inline">|</span>

            <span className="text-slate-400 hidden sm:inline">Role:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium bg-slate-800 text-white border border-slate-700">
              {currentRole === "admin" && <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />}
              {currentRole === "client" && <Briefcase className="w-3.5 h-3.5 text-blue-400" />}
              {currentRole === "freelancer" && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
              {currentRole === "guest" && <Eye className="w-3.5 h-3.5 text-amber-400" />}
              <span className="capitalize">{currentRole}</span>
              {currentUser && ` — ${currentUser.name}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {/* Guest Button */}
            <button
              onClick={() => {
                switchUser(null);
                navigate("home");
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                currentRole === "guest"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
              title="Browse marketplace as Guest"
            >
              <Eye className="w-3 h-3" />
              Guest
            </button>

            {/* Client Selection */}
            <button
              onClick={() => {
                switchUser(clients[0]?.id || null);
                navigate("client-dashboard");
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                currentUser?.id === clients[0]?.id
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
              title="Switch to Client (Alex Vance)"
            >
              <Briefcase className="w-3 h-3" />
              Client ({clients[0]?.name.split(" ")[0] || "Alex"})
            </button>

            {/* Freelancer Selection */}
            <button
              onClick={() => {
                switchUser(freelancers[0]?.id || null);
                navigate("freelancer-dashboard");
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                currentUser?.id === freelancers[0]?.id
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
              title="Switch to Freelancer (Sophia Chen)"
            >
              <UserCheck className="w-3 h-3" />
              Freelancer ({freelancers[0]?.name.split(" ")[0] || "Sophia"})
            </button>

            {/* Admin Selection */}
            <button
              onClick={() => {
                switchUser(admins[0]?.id || null);
                navigate("admin-dashboard");
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                currentUser?.id === admins[0]?.id
                  ? "bg-rose-600 text-white font-bold"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
              title="Switch to Super Admin (Sarah Croft)"
            >
              <ShieldCheck className="w-3 h-3" />
              Admin ({admins[0]?.name.split(" ")[0] || "Sarah"})
            </button>

            {/* Cloud Re-sync Trigger */}
            <button
              onClick={() => seedFirestoreData()}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Re-sync initial Firestore database"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <RazorpayVerificationModal
        isOpen={showRazorpayTestModal}
        onClose={() => setShowRazorpayTestModal(false)}
      />
    </>
  );
};

