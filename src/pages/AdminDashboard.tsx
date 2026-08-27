import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Scale,
  Building2,
  Check,
  RefreshCw
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const {
    projects,
    allUsers,
    disputes,
    settlements,
    payments,
    resolveDispute,
    verifyUserKyc,
    releaseSettlement,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<"disputes" | "users" | "settlements" | "projects">("disputes");

  // Metrics
  const totalEscrowVolume = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const platformRevenue = Math.round(totalEscrowVolume * 0.1);
  const unverifiedCount = allUsers.filter((u) => !u.isVerified).length;
  const pendingSettlements = settlements.filter((s) => s.status === "eligible_for_settlement" || s.status === "processing");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
              WebLancer Master Admin
            </span>
            <span className="text-xs text-slate-500">Superuser Ops Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Platform Control & Trust Operations
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Razorpay Webhook Live
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Escrow Volume</span>
          <p className="text-2xl font-extrabold text-slate-900">₹{totalEscrowVolume.toLocaleString("en-IN")}</p>
          <span className="text-[11px] text-emerald-600 font-medium">100% Razorpay verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Platform Revenue (10%)</span>
          <p className="text-2xl font-extrabold text-blue-600">₹{platformRevenue.toLocaleString("en-IN")}</p>
          <span className="text-[11px] text-slate-500 font-medium">Net platform commission</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Open Dispute Cases</span>
          <p className="text-2xl font-extrabold text-rose-600">{disputes.filter((d) => d.status !== "resolved").length}</p>
          <span className="text-[11px] text-rose-500 font-medium">Requiring mediation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">KYC Approvals Queue</span>
          <p className="text-2xl font-extrabold text-slate-900">{unverifiedCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">Freelancer badges</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: "disputes", label: `Dispute Mediation (${disputes.length})` },
            { id: "users", label: `Users & KYC Verification (${allUsers.length})` },
            { id: "settlements", label: `Bank Settlements Queue (${pendingSettlements.length})` },
            { id: "projects", label: `Marketplace Projects (${projects.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 border-b-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DISPUTE MEDIATION */}
        {activeTab === "disputes" && (
          <div className="p-6 space-y-4">
            {disputes.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Zero open dispute tickets.
              </div>
            ) : (
              disputes.map((d) => (
                <div key={d.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-rose-600" />
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{d.projectTitle}</h3>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        d.status === "resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {d.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Claim Details</span>
                      <p><strong>Reason:</strong> {d.reason}</p>
                      <p><strong>Claimant Statement:</strong> "{d.description}"</p>
                      <p className="text-[10px] text-slate-400">Opened by: {d.claimantName} ({d.claimantRole})</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Respondent & Contract</span>
                      <p><strong>Respondent:</strong> {d.respondentName}</p>
                      <p><strong>Disputed Amount:</strong> ₹{d.contractAmount.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-slate-400">Project ID: #{d.projectId}</p>
                    </div>
                  </div>

                  {d.status !== "resolved" && (
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-500">Admin Resolution Action:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => resolveDispute(d.id, "refund_client", "Full refund authorized to client.")}
                          className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-xl border border-blue-200"
                        >
                          Refund Client
                        </button>
                        <button
                          onClick={() => resolveDispute(d.id, "release_freelancer", "Deliverables verified according to contract.")}
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl border border-emerald-200"
                        >
                          Release to Freelancer
                        </button>
                        <button
                          onClick={() => resolveDispute(d.id, "split", "50-50 mediation split executed.")}
                          className="px-3.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded-xl border border-purple-200"
                        >
                          50/50 Split Resolution
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: USERS & KYC */}
        {activeTab === "users" && (
          <div className="p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Specialization</th>
                    <th className="pb-3 font-semibold">KYC Badge</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[10px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{u.title}</td>
                      <td className="py-3">
                        {u.isVerified ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified Pro
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-semibold text-[10px]">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {!u.isVerified ? (
                          <button
                            onClick={() => verifyUserKyc(u.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs"
                          >
                            Approve KYC
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SETTLEMENTS */}
        {activeTab === "settlements" && (
          <div className="p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Freelancer</th>
                    <th className="pb-3 font-semibold">Milestone Contract</th>
                    <th className="pb-3 font-semibold">Gross</th>
                    <th className="pb-3 font-semibold">Net Payout</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {settlements.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{s.freelancerName}</td>
                      <td className="py-3 text-slate-600">{s.milestoneTitle}</td>
                      <td className="py-3 font-medium">₹{s.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3 font-bold text-emerald-700">₹{s.netPayout.toLocaleString("en-IN")}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            s.status === "settled"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {s.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {s.status !== "settled" ? (
                          <button
                            onClick={() => releaseSettlement(s.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-xs"
                          >
                            Release Payout
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold">Settled ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PROJECTS */}
        {activeTab === "projects" && (
          <div className="p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Client</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Budget</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{p.title}</td>
                      <td className="py-3 text-slate-600">{p.clientName}</td>
                      <td className="py-3 text-slate-500">{p.category}</td>
                      <td className="py-3 font-medium">₹{p.budgetMin.toLocaleString("en-IN")} - ₹{p.budgetMax.toLocaleString("en-IN")}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold uppercase">
                          {p.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
