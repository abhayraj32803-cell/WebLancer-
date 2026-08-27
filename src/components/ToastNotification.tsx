import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, X } from "lucide-react";

export const ToastNotification: React.FC = () => {
  const { activeToast } = useApp();

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs max-w-md">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <span className="font-medium leading-tight">{activeToast}</span>
      </div>
    </div>
  );
};
