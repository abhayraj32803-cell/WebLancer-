import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Layers,
  CheckCircle2,
  Clock,
  DollarSign,
  Lock,
  MessageSquare,
  FileText,
  ShieldCheck,
  Send,
  Plus,
  Star,
  AlertTriangle,
  UploadCloud,
  ChevronLeft,
  Download,
  Check,
  RefreshCw,
  Sparkles,
  Paperclip,
  X
} from "lucide-react";
import { Milestone } from "../types";
import { RazorpayModal } from "../components/RazorpayModal";

export const ProjectWorkspacePage: React.FC = () => {
  const {
    nav,
    navigate,
    projects,
    milestones,
    messages,
    projectFiles,
    currentUser,
    currentRole,
    fundMilestone,
    submitMilestoneWork,
    requestMilestoneRevision,
    approveMilestone,
    sendProjectMessage,
    uploadProjectFile,
    createMilestone,
    openDispute,
    submitReview,
    showToast
  } = useApp();

  const projectId = nav.params?.projectId || "proj-1";
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const projectMilestones = milestones.filter((m) => m.projectId === project.id);
  const projectMessages = messages.filter((m) => m.projectId === project.id);
  const files = projectFiles.filter((f) => f.projectId === project.id);

  // Tabs
  const [activeTab, setActiveTab] = useState<"milestones" | "chat" | "files" | "reviews" | "dispute">("milestones");

  // Razorpay Checkout Modal
  const [razorpayModalMs, setRazorpayModalMs] = useState<Milestone | null>(null);

  // Deliverable Submission Modal
  const [submitMsModal, setSubmitMsModal] = useState<Milestone | null>(null);
  const [submissionNote, setSubmissionNote] = useState("");
  const [submissionFileUrl, setSubmissionFileUrl] = useState("https://github.com/client/weblancer-build-v1.zip");

  // Revision Request Modal
  const [revisionMsModal, setRevisionMsModal] = useState<Milestone | null>(null);
  const [revisionNote, setRevisionNote] = useState("");

  // New Milestone Modal
  const [showAddMsModal, setShowAddMsModal] = useState(false);
  const [newMsTitle, setNewMsTitle] = useState("");
  const [newMsDesc, setNewMsDesc] = useState("");
  const [newMsAmount, setNewMsAmount] = useState<number>(20000);
  const [newMsDue, setNewMsDue] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);

  // Chat message input
  const [chatInput, setChatInput] = useState("");

  // Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("Outstanding collaboration, punctuality, and code quality!");

  // Dispute Modal
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState("Unresolved milestone scope mismatch");
  const [disputeDesc, setDisputeDesc] = useState("");

  // Upload File Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileCat, setUploadFileCat] = useState<"client_asset" | "freelancer_work" | "invoice">("freelancer_work");

  const isClient = currentUser?.id === project.clientId || currentRole === "client" || currentRole === "admin";
  const isFreelancer = currentUser?.id === project.hiredFreelancerId || currentRole === "freelancer";

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendProjectMessage(project.id, chatInput);
    setChatInput("");
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    uploadProjectFile(project.id, {
      name: uploadFileName,
      category: uploadFileCat,
      size: "2.4 MB",
      url: "#"
    });
    setShowUploadModal(false);
    setUploadFileName("");
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsTitle.trim()) return;
    createMilestone(project.id, {
      title: newMsTitle,
      description: newMsDesc,
      amount: newMsAmount,
      dueDate: newMsDue
    });
    setShowAddMsModal(false);
    setNewMsTitle("");
    setNewMsDesc("");
  };

  const handleSendWorkSubmission = () => {
    if (!submitMsModal) return;
    submitMilestoneWork(submitMsModal.id, submissionNote, [
      { name: "Production_Artifacts.zip", url: submissionFileUrl, size: "14.2 MB" }
    ]);
    setSubmitMsModal(null);
    setSubmissionNote("");
  };

  const handleSendRevision = () => {
    if (!revisionMsModal || !revisionNote.trim()) return;
    requestMilestoneRevision(revisionMsModal.id, revisionNote);
    setRevisionMsModal(null);
    setRevisionNote("");
  };

  const handleSubmitReviewForm = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUserId = isClient ? project.hiredFreelancerId : project.clientId;
    const targetUserName = isClient ? project.hiredFreelancerName : project.clientName;
    submitReview({
      projectId: project.id,
      projectTitle: project.title,
      targetUserId: targetUserId || "usr-1",
      targetUserName: targetUserName || "Counterpart",
      rating,
      comment: reviewComment
    });
    setShowReviewModal(false);
  };

  const handleOpenDisputeForm = (e: React.FormEvent) => {
    e.preventDefault();
    const respondentId = isClient ? project.hiredFreelancerId : project.clientId;
    const respondentName = isClient ? project.hiredFreelancerName : project.clientName;
    openDispute({
      projectId: project.id,
      projectTitle: project.title,
      contractAmount: project.agreedPrice || project.budgetMax,
      respondentId: respondentId || "usr-1",
      respondentName: respondentName || "Counterpart",
      reason: disputeReason,
      description: disputeDesc
    });
    setShowDisputeModal(false);
    setActiveTab("dispute");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(isClient ? "client-dashboard" : "freelancer-dashboard")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDisputeModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          >
            Dispute Support
          </button>
          {project.status === "completed" && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Leave Verified Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Contract Banner Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                {project.status.replace("_", " ")}
              </span>
              <span className="text-xs text-slate-400">Workspace ID: #{project.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{project.title}</h1>
            <p className="text-xs text-slate-400 line-clamp-1">{project.description}</p>
          </div>

          <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Contract Value</span>
              <span className="text-2xl font-black text-emerald-400">
                ₹{(project.agreedPrice || project.budgetMax).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 block">Razorpay Escrow Guarded</span>
            </div>
          </div>
        </div>

        {/* Counterpart badges */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <img src={project.clientAvatar} alt={project.clientName} className="w-7 h-7 rounded-full" />
              <div>
                <span className="text-[10px] text-slate-400 block">Project Client</span>
                <span className="font-bold text-slate-200">{project.clientName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <img
                src={project.hiredFreelancerAvatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"}
                alt={project.hiredFreelancerName || "Freelancer"}
                className="w-7 h-7 rounded-full"
              />
              <div>
                <span className="text-[10px] text-slate-400 block">Assigned Freelancer</span>
                <span className="font-bold text-slate-200">{project.hiredFreelancerName || "Sophia Chen"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Funds released only upon milestone approval</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="border-b border-slate-200 px-6 flex items-center justify-between gap-4 overflow-x-auto text-xs font-semibold">
          <div className="flex items-center gap-6">
            {[
              { id: "milestones", label: `Milestones (${projectMilestones.length})` },
              { id: "chat", label: `Project Messages (${projectMessages.length})` },
              { id: "files", label: `File Vault (${files.length})` }
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

          {activeTab === "milestones" && (
            <button
              onClick={() => setShowAddMsModal(true)}
              className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          )}

          {activeTab === "files" && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          )}
        </div>

        {/* TAB 1: MILESTONES LIFECYCLE */}
        {activeTab === "milestones" && (
          <div className="p-6 space-y-4">
            {projectMilestones.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No milestones defined. Click "Add Milestone" to establish the deliverable schedule.
              </div>
            ) : (
              projectMilestones.map((ms, idx) => (
                <div
                  key={ms.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 ${
                    ms.status === "approved"
                      ? "border-emerald-200 bg-emerald-50/20"
                      : ms.status === "funded" || ms.status === "submitted"
                      ? "border-blue-200 bg-blue-50/20"
                      : ms.status === "revision_requested"
                      ? "border-amber-200 bg-amber-50/20"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {/* Top line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{ms.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ms.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : ms.status === "funded"
                              ? "bg-blue-100 text-blue-800"
                              : ms.status === "submitted"
                              ? "bg-purple-100 text-purple-800"
                              : ms.status === "revision_requested"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {ms.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{ms.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-extrabold text-slate-900 block">
                        ₹{ms.amount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-400">Due: {ms.dueDate}</span>
                    </div>
                  </div>

                  {/* Submission note or revision history */}
                  {ms.submissionNote && (
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Submitted Deliverable Note
                      </span>
                      <p className="text-slate-600 italic">"{ms.submissionNote}"</p>
                    </div>
                  )}

                  {ms.revisionNotes && ms.revisionNotes.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                      <span className="font-bold text-amber-800">Client Revision Notes</span>
                      {ms.revisionNotes.map((rn, i) => (
                        <p key={i} className="text-amber-700">{rn}</p>
                      ))}
                    </div>
                  )}

                  {/* Action Triggers based on status */}
                  <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] text-slate-500">
                      {ms.status === "awaiting_payment" && "Awaiting client Razorpay deposit to start work"}
                      {ms.status === "funded" && "Escrow funded. Freelancer is actively developing"}
                      {ms.status === "submitted" && "Deliverables submitted. Client review required"}
                      {ms.status === "approved" && "Milestone approved! Funds disbursed to freelancer earnings"}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Client: Fund milestone */}
                      {ms.status === "awaiting_payment" && (
                        <button
                          onClick={() => setRazorpayModalMs(ms)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Fund ₹{ms.amount.toLocaleString("en-IN")} via Razorpay</span>
                        </button>
                      )}

                      {/* Freelancer: Submit work */}
                      {(ms.status === "funded" || ms.status === "revision_requested") && (
                        <button
                          onClick={() => setSubmitMsModal(ms)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Submit Deliverables</span>
                        </button>
                      )}

                      {/* Client: Review submitted work */}
                      {ms.status === "submitted" && (
                        <>
                          <button
                            onClick={() => setRevisionMsModal(ms)}
                            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-xl border border-amber-200 flex items-center gap-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Request Revision</span>
                          </button>
                          <button
                            onClick={() => approveMilestone(ms.id)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Release Payment</span>
                          </button>
                        </>
                      )}

                      {ms.status === "approved" && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: CHAT & MESSAGES */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-[520px]">
            {/* Messages Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {projectMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No messages yet. Send a message to coordinate with your counterpart.
                </div>
              ) : (
                projectMessages.map((m) => {
                  const isMine = m.senderId === currentUser?.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex items-start gap-3 max-w-lg ${isMine ? "ml-auto flex-row-reverse" : ""}`}
                    >
                      <img
                        src={m.senderAvatar}
                        alt={m.senderName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className={`flex items-center gap-2 ${isMine ? "justify-end" : ""}`}>
                          <span className="text-[11px] font-bold text-slate-900">{m.senderName}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isMine
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message or share an update..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: FILE VAULT */}
        {activeTab === "files" && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {files.map((file) => (
                <div key={file.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-slate-900 truncate">{file.name}</h5>
                      <span className="text-[10px] text-slate-400 block">{file.size} • {file.uploadedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500 capitalize">{file.category.replace("_", " ")}</span>
                    <a
                      href={file.url}
                      className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Escrow Modal */}
      {razorpayModalMs && (
        <RazorpayModal
          milestone={razorpayModalMs}
          projectTitle={project.title}
          isOpen={Boolean(razorpayModalMs)}
          onClose={() => setRazorpayModalMs(null)}
          onSuccess={(paymentResult) => {
            fundMilestone(razorpayModalMs.id, paymentResult);
          }}
        />
      )}

      {/* Submit Work Modal */}
      {submitMsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Submit Milestone Deliverables</h3>
            <p className="text-xs text-slate-500">For {submitMsModal.title}</p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deliverable Notes & Summary</label>
                <textarea
                  rows={4}
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="Detail the completed features, commit hashes, test results, and staging credentials..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deliverable URL or Git Repo link</label>
                <input
                  type="text"
                  value={submissionFileUrl}
                  onChange={(e) => setSubmissionFileUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSubmitMsModal(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button
                onClick={handleSendWorkSubmission}
                className="px-5 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Submit For Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {revisionMsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Request Milestone Revision</h3>
            <p className="text-xs text-slate-500">For {revisionMsModal.title}</p>
            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-slate-700">Specific Fixes & Adjustments Required</label>
              <textarea
                rows={4}
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="Point out the specific bugs or missing items according to original scope..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setRevisionMsModal(null)} className="px-4 py-2 text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button
                onClick={handleSendRevision}
                className="px-5 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Milestone Modal */}
      {showAddMsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form onSubmit={handleCreateMilestone} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl text-xs">
            <h3 className="font-bold text-slate-900 text-base">Create New Milestone</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Milestone Title</label>
              <input
                type="text"
                required
                value={newMsTitle}
                onChange={(e) => setNewMsTitle(e.target.value)}
                placeholder="e.g. Milestone 3: Search Grounding & Polish"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deliverables</label>
              <textarea
                rows={2}
                value={newMsDesc}
                onChange={(e) => setNewMsDesc(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={newMsAmount}
                  onChange={(e) => setNewMsAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newMsDue}
                  onChange={(e) => setNewMsDue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddMsModal(false)} className="px-4 py-2 font-semibold text-slate-600">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl">
                Add Milestone
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form onSubmit={handleSubmitReviewForm} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl text-xs">
            <h3 className="font-bold text-slate-900 text-base">Leave a Verified Review</h3>
            <p className="text-slate-500">Your review will be permanently displayed on their verified public profile.</p>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Star Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? "fill-amber-400" : "text-slate-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Review Feedback</label>
              <textarea
                rows={4}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowReviewModal(false)} className="px-4 py-2 font-semibold text-slate-600">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form onSubmit={handleOpenDisputeForm} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl text-xs">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-base">Escalate to WebLancer Mediation</h3>
            </div>
            <p className="text-slate-500">
              If an amicable agreement cannot be reached, the WebLancer Trust & Safety team will analyze workspace records and milestones to issue a legally binding resolution.
            </p>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dispute Reason</label>
              <input
                type="text"
                required
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Explanation & Evidence</label>
              <textarea
                rows={4}
                required
                value={disputeDesc}
                onChange={(e) => setDisputeDesc(e.target.value)}
                placeholder="Explain the divergence from contract specs..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowDisputeModal(false)} className="px-4 py-2 font-semibold text-slate-600">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-xs">
                Open Dispute Case
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form onSubmit={handleFileUpload} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl text-xs">
            <h3 className="font-bold text-slate-900 text-base">Upload Document to Vault</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document Name</label>
              <input
                type="text"
                required
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                placeholder="e.g. Design_Tokens_v2.json"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vault Category</label>
              <select
                value={uploadFileCat}
                onChange={(e: any) => setUploadFileCat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="freelancer_work">Freelancer Deliverable Code/Asset</option>
                <option value="client_asset">Client Specification / Brand Asset</option>
                <option value="invoice">Contract / Tax Document</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 font-semibold text-slate-600">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl">
                Upload
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
