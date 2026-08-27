import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Briefcase,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  DollarSign,
  ArrowUpDown,
  Filter,
  Layers,
  ChevronRight
} from "lucide-react";

export const FindWorkPage: React.FC = () => {
  const { navigate, projects, categories } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minBudget, setMinBudget] = useState(10000);
  const [selectedTimeline, setSelectedTimeline] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "budget_desc" | "proposals_asc">("newest");

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (p.status !== "open" && p.status !== "hiring") return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSkill = p.requiredSkills.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchSkill) return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
          const cat = categories.find((c) => c.slug === selectedCategory);
          if (cat && p.category !== cat.name) return false;
        }

        // Budget
        if (p.budgetMax < minBudget) return false;

        // Timeline
        if (selectedTimeline !== "all" && !p.expectedTimeline.includes(selectedTimeline)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "budget_desc") return b.budgetMax - a.budgetMax;
        if (sortBy === "proposals_asc") return a.proposalsCount - b.proposalsCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [projects, searchQuery, selectedCategory, minBudget, selectedTimeline, sortBy, categories]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMinBudget(10000);
    setSelectedTimeline("all");
    setSortBy("newest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Work & Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified client requests with guaranteed Razorpay milestone escrow funding.
          </p>
        </div>

        <button
          onClick={() => navigate("post-project")}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
        >
          Post a Job Request
        </button>
      </div>

      {/* Main Grid: Filters + Project Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filter */}
        <aside className="space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filter Projects
            </span>
            <button onClick={resetFilters} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              Reset
            </button>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keywords & Tech</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Next.js, Stripe, Flutter..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Min Budget Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Minimum Budget</span>
              <span className="text-blue-600">₹{minBudget.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="10000"
              value={minBudget}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹10,000</span>
              <span>₹2,00,000+</span>
            </div>
          </div>

          {/* Timeline Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Delivery Timeline</label>
            <select
              value={selectedTimeline}
              onChange={(e) => setSelectedTimeline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
            >
              <option value="all">Any Timeline</option>
              <option value="1-2 Weeks">1-2 Weeks</option>
              <option value="3-4 Weeks">3-4 Weeks</option>
              <option value="2-3 Months">2-3 Months</option>
            </select>
          </div>
        </aside>

        {/* Right Projects Feed */}
        <main className="lg:col-span-3 space-y-4">
          {/* Sorting Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-600">
              Showing <strong className="text-slate-900">{filteredProjects.length}</strong> available jobs
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-blue-600"
              >
                <option value="newest">Newest First</option>
                <option value="budget_desc">Highest Budget</option>
                <option value="proposals_asc">Fewest Proposals</option>
              </select>
            </div>
          </div>

          {/* List */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <p className="text-slate-500 text-sm">No open projects match your current filters.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate("project-details", { projectId: p.id })}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-4"
                >
                  {/* Top line */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {p.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          Posted {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {p.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-slate-900 block">
                        ₹{p.budgetMin.toLocaleString("en-IN")} - ₹{p.budgetMax.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium capitalize">
                        {p.projectType} price {p.isNegotiable ? "(Negotiable)" : ""}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Bottom client info & CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <img src={p.clientAvatar} alt={p.clientName} className="w-6 h-6 rounded-full" />
                        <span className="font-semibold text-slate-900">{p.clientName}</span>
                      </div>
                      <span className="text-slate-400 hidden sm:inline">•</span>
                      <span className="text-slate-500 hidden sm:flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {p.clientRating} ({p.clientProjectsPosted} jobs posted)
                      </span>
                      <span className="text-slate-400 hidden sm:inline">•</span>
                      <span className="text-slate-500 hidden sm:inline">{p.clientLocation}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-blue-600">
                        {p.proposalsCount} proposals
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("project-details", { projectId: p.id });
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-blue-600 text-xs font-bold rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
