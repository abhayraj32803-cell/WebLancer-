import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Layers,
  DollarSign,
  Clock,
  Code2,
  FileText,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export const PostProjectPage: React.FC = () => {
  const { nav, navigate, categories, allUsers, postProject, showToast } = useApp();

  const directHireFreelancer = nav.params?.directHireFreelancerId
    ? allUsers.find((u) => u.id === nav.params.directHireFreelancerId)
    : null;

  const [step, setStep] = useState<number>(1);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Form State
  const [title, setTitle] = useState(directHireFreelancer ? `Custom Contract for ${directHireFreelancer.name}` : "");
  const [category, setCategory] = useState("Website Development");
  const [projectType, setProjectType] = useState<"fixed" | "hourly">("fixed");
  const [description, setDescription] = useState("");
  const [roughIdea, setRoughIdea] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "Responsive Mobile-First Navigation & Design",
    "Razorpay Escrow Payment Gateway Integration",
    "PostgreSQL User Authentication & Protected Routes"
  ]);
  const [newFeature, setNewFeature] = useState("");
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Tailwind CSS", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");
  const [budgetMin, setBudgetMin] = useState<number>(30000);
  const [budgetMax, setBudgetMax] = useState<number>(60000);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [expectedTimeline, setExpectedTimeline] = useState("3-4 Weeks");

  // Gemini AI Brief Generator
  const handleGenerateBriefWithAI = async () => {
    if (!roughIdea.trim()) {
      showToast("Please write a few words about your project idea first.");
      return;
    }
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectCategory: category,
          roughIdea
        })
      });
      const data = await res.json();
      if (data.success && data.brief) {
        setTitle(data.brief.title || title);
        setDescription(data.brief.description || description);
        if (data.brief.features && data.brief.features.length > 0) {
          setFeatures(data.brief.features);
        }
        if (data.brief.suggestedSkills && data.brief.suggestedSkills.length > 0) {
          setSkills(data.brief.suggestedSkills);
        }
        if (data.brief.budgetMin) setBudgetMin(data.brief.budgetMin);
        if (data.brief.budgetMax) setBudgetMax(data.brief.budgetMax);
        if (data.brief.timeline) setExpectedTimeline(data.brief.timeline);
        showToast("Project brief generated with Gemini AI!");
      }
    } catch (err) {
      console.error(err);
      showToast("Could not generate brief with AI at this time.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleFinalPublish = () => {
    if (!title.trim() || !description.trim()) {
      showToast("Please provide a project title and description.");
      return;
    }

    const created = postProject({
      title,
      category,
      projectType,
      description,
      requiredFeatures: features,
      requiredSkills: skills,
      budgetMin,
      budgetMax,
      isNegotiable,
      expectedTimeline
    });

    navigate("project-details", { projectId: created.id });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Client Project Creator</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {directHireFreelancer ? `Hire ${directHireFreelancer.name}` : "Post a New Project on WebLancer"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Specify your requirements, define milestone budgets, and receive proposals with guaranteed Razorpay escrow protection.
        </p>
      </div>

      {/* Wizard Steps Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs font-semibold">
        {[
          { num: 1, label: "Category & Title" },
          { num: 2, label: "Scope & AI Brief" },
          { num: 3, label: "Skills & Deliverables" },
          { num: 4, label: "Budget & Milestones" }
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              step === s.num
                ? "text-blue-600"
                : step > s.num
                ? "text-emerald-600"
                : "text-slate-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s.num
                  ? "bg-blue-600 text-white"
                  : step > s.num
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Wizard Step Cards */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Specialized Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setCategory(c.name)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      category === c.name
                        ? "border-blue-600 bg-blue-50/50 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                2. Project Headline Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next.js SaaS Application with Razorpay Escrow & Custom Dashboard"
                className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Be specific about technology requirements and core end goal.
              </span>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!title.trim()) {
                    showToast("Please enter a title for your project.");
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <span>Continue to Scope & AI Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Gemini AI Project Brief & Scope */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-2xl border border-blue-200 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Gemini AI Scope & Brief Generator
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have a rough idea? Enter a quick sentence or two and let Gemini write a comprehensive, professional project specification with features, skills, and budget benchmarks.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={roughIdea}
                  onChange={(e) => setRoughIdea(e.target.value)}
                  placeholder="e.g. A marketplace for high-end architects to showcase 3D models with stripe/razorpay checkout"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-blue-200 rounded-xl focus:outline-blue-600"
                />
                <button
                  type="button"
                  onClick={handleGenerateBriefWithAI}
                  disabled={isAiGenerating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shrink-0 flex items-center justify-center gap-2 shadow-xs"
                >
                  {isAiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate Specification</span>
                </button>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Detailed Project Description
              </label>
              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the background, target users, technical requirements, integrations, and deliverables..."
                className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600 leading-relaxed font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!description.trim()) {
                    showToast("Please enter a description or generate one with AI.");
                    return;
                  }
                  setStep(3);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <span>Continue to Skills & Deliverables</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Required Features & Skills */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Features List */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Required Project Features & Deliverables
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  placeholder="Add a required feature (e.g. Google OAuth login, Dark mode, PDF invoice download)..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                >
                  Add Feature
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Chips */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Required Skills & Tech Stacks
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="e.g. Next.js, Flutter, Docker..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                >
                  Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-100 flex items-center gap-1.5"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="hover:text-rose-600 text-blue-400"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <span>Continue to Budget & Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Budget & Milestones */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Pricing Model */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Pricing Structure
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setProjectType("fixed")}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    projectType === "fixed"
                      ? "border-blue-600 bg-blue-50/50 shadow-xs"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs">Fixed Price Milestones (Recommended)</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pay structured amounts as specific deliverables are reviewed and verified.
                  </p>
                </div>

                <div
                  onClick={() => setProjectType("hourly")}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    projectType === "hourly"
                      ? "border-blue-600 bg-blue-50/50 shadow-xs"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs">Hourly Rate</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pay per tracked working hour against timesheet logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Budget Range Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Minimum Estimated Budget (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Maximum Budget Ceiling (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Expected Completion Timeline
              </label>
              <select
                value={expectedTimeline}
                onChange={(e) => setExpectedTimeline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600 font-medium"
              >
                <option value="1-2 Weeks">1-2 Weeks (Urgent / MVP)</option>
                <option value="3-4 Weeks">3-4 Weeks (Standard Contract)</option>
                <option value="2-3 Months">2-3 Months (Comprehensive Build)</option>
                <option value="Ongoing">Ongoing Retainer</option>
              </select>
            </div>

            {/* Security Guarantee banner */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Razorpay Escrow Protected Posting</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Publishing a project is 100% free. You only fund milestones when you choose to hire a freelancer.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleFinalPublish}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Project to Marketplace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
