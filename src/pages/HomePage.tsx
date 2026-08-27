import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  Lock,
  Zap,
  Globe,
  LayoutGrid,
  ShoppingBag,
  Smartphone,
  Code2,
  Server,
  Palette,
  Layers,
  ChevronRight,
  UserCheck,
  TrendingUp,
  Award,
  Sparkles,
  Users,
  Briefcase
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { navigate, categories, allUsers, projects } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const freelancers = allUsers.filter((u) => u.role === "freelancer");
  const openProjects = projects.filter((p) => p.status === "open" || p.status === "hiring" || p.status === "in_progress");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("find-freelancers", { query: searchQuery, category: selectedCategory });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe": return <Globe className="w-5 h-5" />;
      case "LayoutGrid": return <LayoutGrid className="w-5 h-5" />;
      case "ShoppingBag": return <ShoppingBag className="w-5 h-5" />;
      case "Smartphone": return <Smartphone className="w-5 h-5" />;
      case "Code2": return <Code2 className="w-5 h-5" />;
      case "Server": return <Server className="w-5 h-5" />;
      case "Palette": return <Palette className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle background mesh grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>The Premier Marketplace for Digital Craftsmanship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Hire the Right Freelancer. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Build Something Great.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Post your project, connect with verified professionals, compare structured milestone proposals, and build your next website, application, or digital product with total confidence.
          </p>

          {/* Quick Search & Find Talent Form */}
          <form
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-slate-900"
          >
            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try 'React Next.js Architect', 'Flutter Telehealth', 'Figma UI/UX'..."
                className="w-full text-xs sm:text-sm bg-transparent placeholder:text-slate-400 focus:outline-none text-slate-900"
              />
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48 text-xs sm:text-sm px-3 py-2 bg-slate-50 rounded-xl text-slate-700 border-0 focus:ring-0 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate("post-project")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <PlusCircleIcon />
              <span>Post a Project (Free)</span>
            </button>

            <button
              onClick={() => navigate("find-freelancers")}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Find Freelancers</span>
            </button>
          </div>

          {/* Core Concept Visual Representation */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 p-4 sm:p-6 shadow-xl">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 block mb-4">
                The WebLancer Guaranteed Workflow
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/50 flex flex-col items-center">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2">1</span>
                  <p className="text-xs font-bold text-white">Client Posts</p>
                  <span className="text-[10px] text-slate-400 mt-0.5">Defines scope & budget</span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/50 flex flex-col items-center">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2">2</span>
                  <p className="text-xs font-bold text-white">Talent Proposes</p>
                  <span className="text-[10px] text-slate-400 mt-0.5">Vetted bids submitted</span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/50 flex flex-col items-center">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2">3</span>
                  <p className="text-xs font-bold text-white">Razorpay Escrow</p>
                  <span className="text-[10px] text-slate-400 mt-0.5">Milestone locked safe</span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/50 flex flex-col items-center">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mb-2">4</span>
                  <p className="text-xs font-bold text-white">Build & Workspace</p>
                  <span className="text-[10px] text-slate-400 mt-0.5">Code, chat & review</span>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3 bg-slate-900/90 rounded-xl border border-slate-700/50 flex flex-col items-center">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-2">5</span>
                  <p className="text-xs font-bold text-white">Delivery & Review</p>
                  <span className="text-[10px] text-slate-400 mt-0.5">Approve & release</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Expertise Fields</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Browse Specialized Categories</h2>
          </div>
          <button
            onClick={() => navigate("find-freelancers")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Explore all skills <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate("find-freelancers", { category: cat.slug })}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                  {getCategoryIcon(cat.iconName)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{cat.projectCount} active projects</span>
                <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Top Freelancers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 py-12 rounded-3xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Top-Rated Talent</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Featured Vetted Freelancers</h2>
            <p className="text-xs text-slate-500 mt-1">Verified background, documented portfolios, and proven client satisfaction.</p>
          </div>
          <button
            onClick={() => navigate("find-freelancers")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View all {freelancers.length}+ talent <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.slice(0, 3).map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{f.name}</h4>
                      {f.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100 shrink-0" title="Verified Pro" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{f.title}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {f.rating}
                      </span>
                      <span>•</span>
                      <span>{f.completedProjects} jobs completed</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3.5 line-clamp-2 leading-relaxed">
                  {f.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {f.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                  {f.skills.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                      +{f.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting Rate</span>
                  <span className="text-sm font-bold text-slate-900">₹{f.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("freelancer-profile", { username: f.username })}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate("post-project", { directHireFreelancerId: f.id })}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                  >
                    Hire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Seeking Talent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Active Market</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Featured Open Projects</h2>
            <p className="text-xs text-slate-500 mt-1">Clients ready with verified budgets and detailed requirements.</p>
          </div>
          <button
            onClick={() => navigate("find-work")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Browse all open RFPs <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openProjects.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() => navigate("project-details", { projectId: p.id })}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {p.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {p.proposalsCount} proposals submitted
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.requiredSkills.slice(0, 4).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img src={p.clientAvatar} alt={p.clientName} className="w-5 h-5 rounded-full" />
                  <span className="text-slate-600 font-medium">{p.clientName}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">
                    ₹{p.budgetMin.toLocaleString("en-IN")} - ₹{p.budgetMax.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{p.expectedTimeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose WebLancer & Trust Architecture */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Zero-Risk Marketplace</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why Top Clients & Freelancers Choose WebLancer</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built from the ground up for transparency, security, and exceptional craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Razorpay Escrow Vault</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clients pay per milestone. Funds remain protected in escrow and are only released upon deliverable sign-off.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Vetted Pro Profiles</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manual identity checks, authenticated GitHub/Figma portfolio showcases, and genuine project reviews.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Dedicated Workspace</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Isolated project workspace with real-time messaging, file vault, deliverable submissions, and revision audit logs.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Impartial Dispute Mediation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated WebLancer trust panel equipped with AI scope verification to protect both clients and freelancers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Reviews Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Marketplace Trust</span>
          <h2 className="text-2xl font-bold text-slate-900">Verified Project Reviews</h2>
          <p className="text-xs text-slate-500">Every rating is tied to completed contracts and verified payments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "Sophia Chen delivered our corporate marketing site 4 days ahead of schedule. Pristine TypeScript code, 99+ Lighthouse performance, and seamless Razorpay milestone handling."
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
                  alt="Rohit Mehta"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Rohit Mehta</p>
                  <p className="text-[10px] text-slate-500">VP of Engineering at Zenith Health</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Client
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "As a senior engineer, WebLancer gives me the security of guaranteed milestone payments through Razorpay escrow. Clear specs, zero payment delays, and great clients."
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
                  alt="Sophia Chen"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Sophia Chen</p>
                  <p className="text-[10px] text-slate-500">Staff Full-Stack Architect</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Top Rated Pro
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom High-Impact CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to build your next digital product?</h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Post your requirements in under 2 minutes. Receive structured milestone proposals from top-rated professionals today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => navigate("post-project")}
              className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Post a Project Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("find-freelancers")}
              className="px-6 py-3 bg-blue-800/80 hover:bg-blue-900 text-white font-semibold text-xs sm:text-sm rounded-xl border border-blue-400/30 transition-all"
            >
              Explore Talent
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const PlusCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
