import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Briefcase,
  ChevronDown,
  ArrowUpDown,
  Filter,
  X
} from "lucide-react";

export const FindFreelancersPage: React.FC = () => {
  const { nav, navigate, allUsers, categories } = useApp();

  const [searchQuery, setSearchQuery] = useState(nav.params?.query || "");
  const [selectedCategory, setSelectedCategory] = useState(nav.params?.category || "all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "jobs" | "price_asc" | "price_desc">("recommended");

  const freelancers = useMemo(() => {
    return allUsers.filter((u) => u.role === "freelancer");
  }, [allUsers]);

  // Extract all distinct skills
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    freelancers.forEach((f) => f.skills.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [freelancers]);

  // Filtered & Sorted Freelancers
  const filteredFreelancers = useMemo(() => {
    return freelancers
      .filter((f) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = f.name.toLowerCase().includes(q);
          const matchTitle = f.title.toLowerCase().includes(q);
          const matchBio = f.bio.toLowerCase().includes(q);
          const matchSkill = f.skills.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchTitle && !matchBio && !matchSkill) return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
          const cat = categories.find((c) => c.slug === selectedCategory);
          if (cat) {
            const matchesCatSkill = cat.popularSkills.some((ps) =>
              f.skills.some((fs) => fs.toLowerCase().includes(ps.toLowerCase()))
            );
            if (!matchesCatSkill && !f.title.toLowerCase().includes(cat.name.toLowerCase())) {
              return false;
            }
          }
        }

        // Specific skill
        if (selectedSkill !== "all" && !f.skills.includes(selectedSkill)) {
          return false;
        }

        // Verified
        if (onlyVerified && !f.isVerified) return false;

        // Min rating
        if (minRating > 0 && f.rating < minRating) return false;

        // Max hourly rate
        if (f.hourlyRate > maxRate) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "jobs") return b.completedProjects - a.completedProjects;
        if (sortBy === "price_asc") return a.hourlyRate - b.hourlyRate;
        if (sortBy === "price_desc") return b.hourlyRate - a.hourlyRate;
        return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0) || b.rating - a.rating;
      });
  }, [freelancers, searchQuery, selectedCategory, selectedSkill, onlyVerified, minRating, maxRate, sortBy, categories]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSkill("all");
    setOnlyVerified(false);
    setMinRating(0);
    setMaxRate(5000);
    setSortBy("recommended");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Top Freelancers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified web developers, mobile architects, and UI/UX designers ready for contract or milestone work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("post-project")}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Post a Project Instead</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Filters */}
        <aside className="space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filter Freelancers
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset
            </button>
          </div>

          {/* Search by Keyword */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keywords & Tech</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Next.js, Flutter, AWS..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specialization Category</label>
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

          {/* Specific Skill Tag */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Core Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-600"
            >
              <option value="all">Any Skill</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Max Hourly Rate */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Max Hourly Rate</span>
              <span className="text-blue-600">₹{maxRate}/hr</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="250"
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹500/hr</span>
              <span>₹5,000/hr</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum Rating</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { label: "Any", val: 0 },
                { label: "4.5+ ★", val: 4.5 },
                { label: "4.8+ ★", val: 4.8 }
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setMinRating(r.val)}
                  className={`py-1.5 rounded-lg border text-center font-medium transition-all ${
                    minRating === r.val
                      ? "bg-blue-50 border-blue-600 text-blue-700 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Badge Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 rounded-sm"
              />
              <span className="flex items-center gap-1">
                Verified Pro Badges only
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
              </span>
            </label>
          </div>
        </aside>

        {/* Right Column: Results & Sorting */}
        <main className="lg:col-span-3 space-y-4">
          {/* Bar with result count & sort dropdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-600">
              Showing <strong className="text-slate-900">{filteredFreelancers.length}</strong> vetted freelancers
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-slate-500 shrink-0 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-blue-600"
              >
                <option value="recommended">Best Recommended</option>
                <option value="rating">Highest Rating</option>
                <option value="jobs">Most Completed Projects</option>
                <option value="price_asc">Rate: Low to High</option>
                <option value="price_desc">Rate: High to Low</option>
              </select>
            </div>
          </div>

          {/* List of Freelancers */}
          {filteredFreelancers.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <p className="text-slate-500 text-sm">No freelancers matched your filter criteria.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl hover:bg-blue-100"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFreelancers.map((f) => (
                <div
                  key={f.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Left info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          onClick={() => navigate("freelancer-profile", { username: f.username })}
                          className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {f.name}
                        </h3>
                        {f.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-blue-100" />
                            Verified Pro
                          </span>
                        )}
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                          {f.availability}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-700">{f.title}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {f.rating} ({f.reviewsCount} reviews)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {f.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {f.completedProjects} jobs completed
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                        {f.bio}
                      </p>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {f.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Rate */}
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hourly Rate</span>
                      <span className="text-lg font-bold text-slate-900">₹{f.hourlyRate.toLocaleString("en-IN")}/hr</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate("freelancer-profile", { username: f.username })}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate("post-project", { directHireFreelancerId: f.id })}
                        className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                      >
                        Hire Pro
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
