import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Briefcase,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  ChevronLeft,
  Send,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Download,
  Check
} from "lucide-react";

export const ProjectDetailsPage: React.FC = () => {
  const { nav, navigate, projects, proposals, currentUser, submitProposal, showToast } = useApp();
  const projectId = nav.params?.projectId || "proj-1";
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposedAmount, setProposedAmount] = useState<number>(project ? project.budgetMin + Math.round((project.budgetMax - project.budgetMin) / 2) : 50000);
  const [estimatedDays, setEstimatedDays] = useState<number>(21);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementNotes, setEnhancementNotes] = useState<string | null>(null);
  const [winScore, setWinScore] = useState<number>(92);
  const [submitting, setSubmitting] = useState(false);

  // Check if current user already submitted a proposal
  const existingProposal = proposals.find(
    (pr) => pr.projectId === project.id && pr.freelancerId === currentUser?.id
  );

  // AI Proposal Enhancer
  const handleEnhanceWithAI = async () => {
    if (!coverLetter.trim()) {
      showToast("Please write a draft cover letter first before enhancing.");
      return;
    }
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/gemini/enhance-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: project.title,
          projectDescription: project.description,
          freelancerDraft: coverLetter,
          freelancerSkills: currentUser?.skills || ["React", "TypeScript", "Node.js"]
        })
      });
      const data = await res.json();
      if (data.success) {
        setCoverLetter(data.enhancedProposal);
        setWinScore(data.winScore || 94);
        setEnhancementNotes(`Gemini AI added structured milestone breakdown and reinforced technical delivery confidence.`);
        showToast("Proposal enhanced with Gemini AI!");
      }
    } catch (e) {
      console.error(e);
      showToast("Could not enhance proposal with AI at this moment.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      showToast("Please provide a cover letter detailing your approach.");
      return;
    }
    setSubmitting(true);
    submitProposal({
      projectId: project.id,
      projectTitle: project.title,
      proposedAmount,
      estimatedDays,
      coverLetter,
      winScore,
      highlights: ["Clear technical architecture", "Guaranteed milestone timeline", "Daily asynchronous demos"]
    });
    setSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate("find-work")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Project Listings
      </button>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Project Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {project.category}
                </span>
                <span className="text-xs text-slate-400">
                  Posted {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Status: {project.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {project.title}
              </h1>
            </div>

            {/* Overview & Description */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Project Specification</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Required Features */}
            {project.requiredFeatures && project.requiredFeatures.length > 0 && (
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Required Deliverables & Features</h3>
                <ul className="space-y-2">
                  {project.requiredFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills & Tech Stack */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Required Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {project.attachments && project.attachments.length > 0 && (
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Project Documents & Wireframes</h3>
                <div className="space-y-2">
                  {project.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-semibold text-slate-900">{att.name}</p>
                          <span className="text-[10px] text-slate-400">{att.size}</span>
                        </div>
                      </div>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Budget & Actions */}
        <aside className="space-y-6">
          {/* Budget & Timeline Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Client Budget</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                ₹{project.budgetMin.toLocaleString("en-IN")} - ₹{project.budgetMax.toLocaleString("en-IN")}
              </p>
              <span className="text-xs text-slate-500 font-medium capitalize">
                {project.projectType} price {project.isNegotiable ? "• Negotiable" : ""}
              </span>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Expected Timeline</span>
                <span className="font-semibold text-slate-900">{project.expectedTimeline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Proposals Received</span>
                <span className="font-semibold text-blue-600">{project.proposalsCount} proposals</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Security</span>
                <span className="font-semibold text-emerald-600">Razorpay Escrow</span>
              </div>
            </div>

            <div className="pt-3">
              {existingProposal ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-800">Proposal Submitted</p>
                  <p className="text-[11px] text-emerald-700">You offered ₹{existingProposal.proposedAmount.toLocaleString("en-IN")}</p>
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit a Proposal</span>
                </button>
              )}
            </div>
          </div>

          {/* Client Bio Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">About the Client</h4>

            <div className="flex items-center gap-3">
              <img
                src={project.clientAvatar}
                alt={project.clientName}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">{project.clientName}</p>
                <p className="text-xs text-slate-500">{project.clientCompany}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Client Rating</span>
                <span className="font-semibold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {project.clientRating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location</span>
                <span className="font-semibold text-slate-900">{project.clientLocation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">History</span>
                <span className="font-semibold text-slate-900">{project.clientProjectsPosted} projects posted</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Proposal Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Submit Proposal for Project</h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">{project.title}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Bid Amount & Days */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Proposed Total Amount (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min={5000}
                      step={1000}
                      value={proposedAmount}
                      onChange={(e) => setProposedAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Client budget: ₹{project.budgetMin.toLocaleString("en-IN")} - ₹{project.budgetMax.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Estimated Delivery Time (Days)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={180}
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Client expected: {project.expectedTimeline}
                  </span>
                </div>
              </div>

              {/* Cover Letter with Gemini AI Enhancer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Cover Letter & Technical Approach</label>
                  <button
                    type="button"
                    onClick={handleEnhanceWithAI}
                    disabled={isEnhancing}
                    className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    {isEnhancing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Enhance with Gemini AI
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  rows={6}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Describe your technical architecture, relevant portfolio projects, milestone delivery schedule, and testing methodology..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600 leading-relaxed font-sans"
                />

                {enhancementNotes && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{enhancementNotes}</span>
                  </p>
                )}
              </div>

              {/* Estimated Payout Breakdown */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <span className="font-semibold text-slate-700 block">Earnings Breakdown</span>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Gross Contract Value</span>
                  <span>₹{proposedAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>WebLancer Platform Fee (10%)</span>
                  <span className="text-rose-600">- ₹{Math.round(proposedAmount * 0.1).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>TDS Withholding (1%)</span>
                  <span className="text-rose-600">- ₹{Math.round(proposedAmount * 0.01).toLocaleString("en-IN")}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                  <span>Net Estimated Freelancer Payout</span>
                  <span className="text-emerald-700 font-extrabold text-sm">
                    ₹{Math.round(proposedAmount * 0.89).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit Proposal Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
