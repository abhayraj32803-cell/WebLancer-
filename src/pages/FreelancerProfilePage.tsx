import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Award,
  Globe,
  Calendar,
  Layers,
  Sparkles,
  MessageSquare,
  ChevronLeft,
  X,
  Share2
} from "lucide-react";
import { PortfolioItem } from "../types";

export const FreelancerProfilePage: React.FC = () => {
  const { nav, navigate, allUsers, portfolios, reviews, showToast } = useApp();
  const username = nav.params?.username || "sophia_chen";

  const freelancer = allUsers.find((u) => u.username === username || u.id === nav.params?.freelancerId) || allUsers.find((u) => u.role === "freelancer")!;

  const [activeTab, setActiveTab] = useState<"portfolio" | "skills" | "reviews" | "about">("portfolio");
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);

  // Freelancer's portfolios and reviews
  const userPortfolios = portfolios.filter((p) => p.userId === freelancer.id);
  const userReviews = reviews.filter((r) => r.targetUserId === freelancer.id || r.targetUserName === freelancer.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("find-freelancers")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Freelancers
      </button>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Cover banner */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast("Profile link copied to clipboard!");
              }}
              className="px-3 py-1.5 bg-slate-900/60 backdrop-blur-sm hover:bg-slate-900 text-white rounded-xl text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-5">
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
              />
              <div className="pb-2 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{freelancer.name}</h1>
                  {freelancer.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-blue-100" /> Verified Pro
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-700">{freelancer.title}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {freelancer.rating} ({userReviews.length || freelancer.reviewsCount} reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {freelancer.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member since {freelancer.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Hire / Quote Action */}
            <div className="flex items-center gap-3 pb-2">
              <div className="text-right hidden md:block mr-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Standard Rate</span>
                <span className="text-lg font-bold text-slate-900">₹{freelancer.hourlyRate.toLocaleString("en-IN")}/hr</span>
              </div>

              <button
                onClick={() => navigate("post-project", { directHireFreelancerId: freelancer.id })}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Hire {freelancer.name.split(" ")[0]}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-200 px-6 sm:px-8 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: "portfolio", label: `Portfolios (${userPortfolios.length})` },
            { id: "skills", label: `Skills & Expertise (${freelancer.skills.length})` },
            { id: "reviews", label: `Client Reviews (${userReviews.length})` },
            { id: "about", label: "Overview & Bio" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content + Sidebar Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: PORTFOLIO */}
          {activeTab === "portfolio" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Showcase Projects</h3>
                <span className="text-xs text-slate-500">Click any project to view technical details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userPortfolios.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPortfolio(item)}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                  >
                    <div className="h-44 overflow-hidden relative bg-slate-100">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-xl shadow">
                          View Project Details
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.technologies.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === "skills" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-3">Core Technical Proficiencies</h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-100 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Languages & Communication</h3>
                <div className="flex gap-2">
                  {freelancer.languages.map((l) => (
                    <span key={l} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                      {l} (Fluent Professional)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Client Feedback</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Based on completed milestone contracts</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-slate-900">{freelancer.rating}</span>
                    <span className="text-xs text-slate-400"> / 5.0</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {userReviews.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                  No verified client reviews recorded yet.
                </div>
              ) : (
                userReviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.reviewerName}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-xs">{rev.projectTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Verified Contract on WebLancer</span>
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: ABOUT */}
          {activeTab === "about" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Professional Summary</h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {freelancer.bio}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized in building scalable production applications with meticulous type-safety, responsive UI design systems, and seamless payment flows. Dedicated to clear milestone communication, daily progress demos, and zero-defect deployments.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Trust & Hiring Card */}
        <aside className="space-y-6">
          {/* Quick Metrics */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Performance Metrics</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Job Success Score</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">On-Time Milestone Delivery</span>
                <span className="font-bold text-slate-900">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Average Response Time</span>
                <span className="font-bold text-slate-900">&lt; 1 hour</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Completed Contracts</span>
                <span className="font-bold text-slate-900">{freelancer.completedProjects} Projects</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Availability</span>
                <span className="font-bold text-emerald-600">{freelancer.availability}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => navigate("post-project", { directHireFreelancerId: freelancer.id })}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Request Project Proposal</span>
              </button>
            </div>
          </div>

          {/* Escrow Guarantee Badge */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Razorpay Escrow Guard</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When working with {freelancer.name}, your project funds remain in escrow. You only release payments when each milestone deliverable is completely tested and approved.
            </p>
          </div>
        </aside>
      </div>

      {/* Portfolio Item Detail Modal */}
      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm truncate">{selectedPortfolio.title}</h3>
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72">
                <img
                  src={selectedPortfolio.coverImage}
                  alt={selectedPortfolio.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">Project Overview</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedPortfolio.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPortfolio.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {selectedPortfolio.liveUrl && (
                <div className="pt-2">
                  <a
                    href={selectedPortfolio.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <span>View Live Production Deployment</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Delivered by {freelancer.name}</span>
              <button
                onClick={() => {
                  setSelectedPortfolio(null);
                  navigate("post-project", { directHireFreelancerId: freelancer.id });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Hire For Similar Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
