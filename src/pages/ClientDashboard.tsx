import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Briefcase,
  Layers,
  DollarSign,
  Clock,
  CheckCircle2,
  Star,
  Users,
  PlusCircle,
  ChevronRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Zap,
  Lock
} from "lucide-react";
import { RazorpayVerificationModal } from "../components/RazorpayVerificationModal";

export const ClientDashboard: React.FC = () => {
  const {
    currentUser,
    projects,
    proposals,
    payments,
    disputes,
    navigate,
    hireFreelancer,
    shortlistProposal
  } = useApp();

  const [activeTab, setActiveTab] = useState<"projects" | "proposals" | "payments" | "disputes">("projects");
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Client's projects
  const clientProjects = projects.filter((p) => p.clientId === currentUser?.id || currentUser?.role === "admin");
  const activeJobs = clientProjects.filter((p) => p.status === "in_progress");
  const openJobs = clientProjects.filter((p) => p.status === "open" || p.status === "hiring");

  // Proposals for client's projects
  const clientProposals = proposals.filter((pr) =>
    clientProjects.some((cp) => cp.id === pr.projectId)
  );

  // Client's payment transactions
  const clientPayments = payments.filter((py) => py.clientId === currentUser?.id || currentUser?.role === "admin");
  const totalSpent = clientPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              Client Portal
            </span>
            <span className="text-xs text-slate-500">{currentUser?.companyName || "Organization"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, {currentUser?.name || "Client"}
          </h1>
        </div>

        <button
          onClick={() => navigate("post-project")}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Project</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Workspaces</span>
          <p className="text-2xl font-extrabold text-slate-900">{activeJobs.length}</p>
          <span className="text-[11px] text-blue-600 font-medium">In active development</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Escrow Spent</span>
          <p className="text-2xl font-extrabold text-slate-900">₹{totalSpent.toLocaleString("en-IN")}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Razorpay verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Proposals Under Review</span>
          <p className="text-2xl font-extrabold text-slate-900">{clientProposals.length}</p>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting selection</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Completed Contracts</span>
          <p className="text-2xl font-extrabold text-slate-900">
            {clientProjects.filter((p) => p.status === "completed").length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">100% milestone sign-off</span>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: "projects", label: `My Projects (${clientProjects.length})` },
            { id: "proposals", label: `Incoming Proposals (${clientProposals.length})` },
            { id: "payments", label: `Razorpay Invoices (${clientPayments.length})` },
            { id: "disputes", label: `Disputes & Mediation (${disputes.length})` }
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

        {/* TAB 1: MY PROJECTS */}
        {activeTab === "projects" && (
          <div className="p-6 space-y-4">
            {clientProjects.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs space-y-3">
                <p>You have not posted any projects yet.</p>
                <button
                  onClick={() => navigate("post-project")}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Post Your First Project
                </button>
              </div>
            ) : (
              clientProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === "in_progress"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "completed"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-500">Category: {p.category}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{p.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>
                        Budget: ₹{p.budgetMin.toLocaleString("en-IN")} - ₹{p.budgetMax.toLocaleString("en-IN")}
                      </span>
                      <span>•</span>
                      <span>Timeline: {p.expectedTimeline}</span>
                      <span>•</span>
                      <span className="text-blue-600 font-semibold">{p.proposalsCount} proposals received</span>
                    </div>

                    {p.hiredFreelancerName && (
                      <p className="text-xs text-emerald-700 font-medium pt-1">
                        Assigned Freelancer: <strong>{p.hiredFreelancerName}</strong> (Agreed: ₹
                        {p.agreedPrice?.toLocaleString("en-IN")})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.status === "in_progress" || p.status === "completed" ? (
                      <button
                        onClick={() => navigate("project-workspace", { projectId: p.id })}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Open Workspace</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate("project-details", { projectId: p.id })}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setActiveTab("proposals")}
                          className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                        >
                          Compare Proposals ({p.proposalsCount})
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: INCOMING PROPOSALS */}
        {activeTab === "proposals" && (
          <div className="p-6 space-y-4">
            {clientProposals.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No proposals submitted yet. They will appear here when freelancers apply to your listings.
              </div>
            ) : (
              clientProposals.map((pr) => (
                <div
                  key={pr.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={pr.freelancerAvatar}
                        alt={pr.freelancerName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{pr.freelancerName}</h4>
                          <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {pr.freelancerRating}
                          </span>
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                            AI Score: {pr.winScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{pr.freelancerTitle}</p>
                        <span className="text-[11px] text-slate-400">For Project: {pr.projectTitle}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold text-slate-900 block">
                        ₹{pr.proposedAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-500">{pr.estimatedDays} Days Delivery</span>
                    </div>
                  </div>

                  {/* Proposal Cover Letter */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {pr.coverLetter}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => navigate("freelancer-profile", { freelancerId: pr.freelancerId })}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <span>View Freelancer Portfolio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => shortlistProposal(pr.id)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                      >
                        {pr.status === "shortlisted" ? "Shortlisted ★" : "Shortlist"}
                      </button>
                      <button
                        onClick={() => hireFreelancer(pr.projectId, pr.id, pr.proposedAmount)}
                        className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                      >
                        Hire & Create Workspace
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PAYMENTS & INVOICES */}
        {activeTab === "payments" && (
          <div className="p-6 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Razorpay Escrow Gateway</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      HMAC-SHA256 Cryptographically Secured
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Orders created on backend. Signatures verified before milestone status updates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerificationModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Open QA Verification Suite</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Payment / Order ID</th>
                    <th className="pb-3 font-semibold">Project & Milestone</th>
                    <th className="pb-3 font-semibold">Freelancer</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {clientPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No payments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    clientPayments.map((py) => (
                      <tr key={py.id} className="hover:bg-slate-50">
                        <td className="py-3 font-mono font-bold text-slate-900">
                          {py.paymentId}
                          <span className="block text-[9px] font-normal text-slate-400">{py.orderId}</span>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-900 block">{py.projectTitle}</span>
                          <span className="text-[10px] text-slate-500">{py.milestoneTitle}</span>
                        </td>
                        <td className="py-3 font-medium">{py.freelancerName}</td>
                        <td className="py-3 font-bold text-slate-900">₹{py.amount.toLocaleString("en-IN")}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {py.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">{new Date(py.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DISPUTES */}
        {activeTab === "disputes" && (
          <div className="p-6 space-y-4">
            {disputes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active dispute tickets. All contracts are running smoothly.
              </div>
            ) : (
              disputes.map((d) => (
                <div key={d.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{d.projectTitle}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                      {d.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-slate-600">Reason: {d.reason}</p>
                  <p className="text-slate-500 italic">"{d.description}"</p>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 flex justify-between">
                    <span>Opened on {new Date(d.createdAt).toLocaleDateString()}</span>
                    <span>Admin Status: {d.adminNotes}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <RazorpayVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </div>
  );
};

