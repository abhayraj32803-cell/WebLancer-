import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Briefcase,
  Layers,
  DollarSign,
  Clock,
  CheckCircle2,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  Building2,
  Sparkles,
  ExternalLink,
  Loader2,
  Trash2,
  FileCheck
} from "lucide-react";

export const FreelancerDashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    proposals,
    settlements,
    portfolios,
    navigate,
    requestSettlement,
    addPortfolioItem,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<"jobs" | "proposals" | "earnings" | "portfolio">("jobs");

  // Portfolio Form State
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [portTitle, setPortTitle] = useState("");
  const [portDesc, setPortDesc] = useState("");
  const [portTech, setPortTech] = useState("React, Tailwind CSS, TypeScript");
  const [portImg, setPortImg] = useState("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800");
  const [portUrl, setPortUrl] = useState("https://github.com/example");

  // Freelancer's data
  const myProjects = projects.filter((p) => p.hiredFreelancerId === currentUser?.id);
  const myProposals = proposals.filter((pr) => pr.freelancerId === currentUser?.id);
  const mySettlements = settlements.filter((s) => s.freelancerId === currentUser?.id);
  const myPortfolios = portfolios.filter((p) => p.userId === currentUser?.id);

  // Financial calculations
  const totalEarned = mySettlements
    .filter((s) => s.status === "settled" || s.status === "eligible_for_settlement")
    .reduce((acc, curr) => acc + curr.netPayout, 0);

  const eligibleForSettlement = mySettlements
    .filter((s) => s.status === "eligible_for_settlement")
    .reduce((acc, curr) => acc + curr.netPayout, 0);

  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle.trim()) return;
    addPortfolioItem({
      title: portTitle,
      description: portDesc,
      coverImage: portImg,
      technologies: portTech.split(",").map((t) => t.trim()),
      liveUrl: portUrl
    });
    setShowAddPortfolio(false);
    setPortTitle("");
    setPortDesc("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
              Freelancer Pro Portal
            </span>
            <span className="text-xs text-slate-500">{currentUser?.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, {currentUser?.name || "Sophia"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("freelancer-profile", { username: currentUser?.username })}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            View Public Profile
          </button>
          <button
            onClick={() => navigate("find-work")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Find More Projects
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Workspaces</span>
          <p className="text-2xl font-extrabold text-slate-900">
            {myProjects.filter((p) => p.status === "in_progress").length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">In progress contracts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Available For Payout</span>
          <p className="text-2xl font-extrabold text-emerald-600">₹{eligibleForSettlement.toLocaleString("en-IN")}</p>
          <span className="text-[11px] text-slate-500 font-medium">Approved milestones</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Lifetime Net Earnings</span>
          <p className="text-2xl font-extrabold text-slate-900">₹{totalEarned.toLocaleString("en-IN")}</p>
          <span className="text-[11px] text-blue-600 font-medium">10% WebLancer fee deducted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Job Success Score</span>
          <p className="text-2xl font-extrabold text-slate-900">100%</p>
          <span className="text-[11px] text-amber-600 font-medium">Top Rated Status</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: "jobs", label: `Active Jobs (${myProjects.length})` },
            { id: "proposals", label: `My Proposals (${myProposals.length})` },
            { id: "earnings", label: `Earnings & Bank Settlements (${mySettlements.length})` },
            { id: "portfolio", label: `Portfolio Projects (${myPortfolios.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 border-b-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ACTIVE JOBS */}
        {activeTab === "jobs" && (
          <div className="p-6 space-y-4">
            {myProjects.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs space-y-3">
                <p>You do not have any active contract jobs yet.</p>
                <button
                  onClick={() => navigate("find-work")}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Browse Open Work
                </button>
              </div>
            ) : (
              myProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {p.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-500">Client: {p.clientName}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{p.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>Contract Value: ₹{p.agreedPrice?.toLocaleString("en-IN")}</span>
                      <span>•</span>
                      <span>Timeline: {p.expectedTimeline}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("project-workspace", { projectId: p.id })}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Open Workspace</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: MY PROPOSALS */}
        {activeTab === "proposals" && (
          <div className="p-6 space-y-4">
            {myProposals.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                You haven't submitted any proposals yet.
              </div>
            ) : (
              myProposals.map((pr) => (
                <div key={pr.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{pr.projectTitle}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Submitted {new Date(pr.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 block">
                        ₹{pr.proposedAmount.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${
                          pr.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : pr.status === "shortlisted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {pr.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 line-clamp-2 italic bg-slate-50 p-3 rounded-xl">
                    "{pr.coverLetter}"
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500">Estimated delivery: {pr.estimatedDays} Days</span>
                    <button
                      onClick={() => navigate("project-details", { projectId: pr.projectId })}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View Project RFP →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: EARNINGS & SETTLEMENTS */}
        {activeTab === "earnings" && (
          <div className="p-6 space-y-6">
            {/* Balance Payout Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-700 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">
                  Available for Bank Transfer
                </span>
                <p className="text-3xl font-black">₹{eligibleForSettlement.toLocaleString("en-IN")}</p>
                <p className="text-xs text-emerald-100">
                  Primary Bank: HDFC Bank (•••• 4912) • IFSC: HDFC0001284
                </p>
              </div>

              <button
                onClick={() => {
                  if (eligibleForSettlement <= 0) {
                    showToast("No eligible balance available for payout right now.");
                    return;
                  }
                  requestSettlement(currentUser?.id || "usr-free-1", eligibleForSettlement);
                }}
                disabled={eligibleForSettlement <= 0}
                className="px-6 py-3 bg-white text-emerald-800 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:bg-emerald-50 transition-all disabled:opacity-50"
              >
                Withdraw Funds to Bank
              </button>
            </div>

            {/* Settlements History */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Settlements & Payout Ledger</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-semibold">Milestone / Contract</th>
                      <th className="pb-3 font-semibold">Gross</th>
                      <th className="pb-3 font-semibold">Fee (10%)</th>
                      <th className="pb-3 font-semibold">TDS (1%)</th>
                      <th className="pb-3 font-semibold">Net Payout</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {mySettlements.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">
                          No settlement records yet.
                        </td>
                      </tr>
                    ) : (
                      mySettlements.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3">
                            <span className="font-semibold text-slate-900 block">{s.milestoneTitle}</span>
                            <span className="text-[10px] text-slate-400">{s.projectTitle}</span>
                          </td>
                          <td className="py-3 font-medium">₹{s.amount.toLocaleString("en-IN")}</td>
                          <td className="py-3 text-rose-600">-₹{s.platformCommission.toLocaleString("en-IN")}</td>
                          <td className="py-3 text-rose-600">-₹{s.tdsDeduction.toLocaleString("en-IN")}</td>
                          <td className="py-3 font-bold text-emerald-700">₹{s.netPayout.toLocaleString("en-IN")}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                s.status === "settled"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : s.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {s.status.replace("_", " ")}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PORTFOLIO SHOWCASE */}
        {activeTab === "portfolio" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Portfolio Projects Showcase</h4>
                <p className="text-xs text-slate-500">Showcase past work to increase your proposal win rate.</p>
              </div>
              <button
                onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Portfolio Project</span>
              </button>
            </div>

            {/* Add Portfolio Form */}
            {showAddPortfolio && (
              <form onSubmit={handleCreatePortfolio} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={portTitle}
                      onChange={(e) => setPortTitle(e.target.value)}
                      placeholder="e.g. Next.js SaaS Analytics Dashboard"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={portTech}
                      onChange={(e) => setPortTech(e.target.value)}
                      placeholder="React, TypeScript, GraphQL"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Overview & Architecture</label>
                  <textarea
                    rows={3}
                    required
                    value={portDesc}
                    onChange={(e) => setPortDesc(e.target.value)}
                    placeholder="Describe your role, problems solved, and tech stack details..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={portImg}
                      onChange={(e) => setPortImg(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-blue-600 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Live URL / Repo</label>
                    <input
                      type="url"
                      value={portUrl}
                      onChange={(e) => setPortUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-blue-600 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPortfolio(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs"
                  >
                    Save Portfolio Item
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myPortfolios.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-36 object-cover rounded-xl border border-slate-100"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{item.title}</h5>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
