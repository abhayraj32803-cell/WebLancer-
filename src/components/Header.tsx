import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Layers,
  Bell,
  Search,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  UserCheck,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  FileText,
  DollarSign
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    nav,
    navigate,
    currentUser,
    currentRole,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    projects
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Check if current user is part of an active project workspace
  const activeWorkspaceProject = projects.find((p) =>
    p.status === "in_progress" && (p.clientId === currentUser?.id || p.hiredFreelancerId === currentUser?.id)
  );

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[31px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("home")}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-600 transition-colors">
                <Layers className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  Web<span className="text-blue-600">Lancer</span>
                </span>
                <span className="block text-[10px] text-slate-500 font-medium tracking-wider -mt-1 uppercase">
                  Post. Hire. Build.
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => navigate("find-freelancers")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  nav.page === "find-freelancers"
                    ? "text-blue-600 bg-blue-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Find Freelancers
              </button>
              <button
                onClick={() => navigate("find-work")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  nav.page === "find-work"
                    ? "text-blue-600 bg-blue-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Find Work
              </button>
              <button
                onClick={() => navigate("how-it-works")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  nav.page === "how-it-works"
                    ? "text-blue-600 bg-blue-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => navigate("about")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  nav.page === "about"
                    ? "text-blue-600 bg-blue-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                About
              </button>
              <button
                onClick={() => navigate("contact")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  nav.page === "contact"
                    ? "text-blue-600 bg-blue-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Active Workspace Quick Link */}
            {activeWorkspaceProject && (
              <button
                onClick={() => navigate("project-workspace", { projectId: activeWorkspaceProject.id })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                title="Open current active project workspace"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Workspace
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">Notifications</h4>
                      {unreadNotifs.length > 0 && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                          {unreadNotifs.length} new
                        </span>
                      )}
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead()}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.link) {
                              if (n.link.startsWith("workspace/")) {
                                const pid = n.link.split("/")[1];
                                navigate("project-workspace", { projectId: pid });
                              } else if (n.link === "freelancer/earnings") {
                                navigate("freelancer-dashboard");
                              } else if (n.link === "admin-dashboard") {
                                navigate("admin-dashboard");
                              }
                            }
                            setNotifOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                            !n.read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg mt-0.5 ${
                              n.type === "payment"
                                ? "bg-emerald-100 text-emerald-700"
                                : n.type === "milestone"
                                ? "bg-purple-100 text-purple-700"
                                : n.type === "dispute"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {n.type === "payment" ? (
                              <DollarSign className="w-4 h-4" />
                            ) : n.type === "milestone" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : n.type === "message" ? (
                              <MessageSquare className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5"></div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role / User Button or Auth buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="hidden xl:block">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile dropdown menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 capitalize border border-blue-100">
                        {currentUser.role} Account
                      </span>
                    </div>

                    <div className="py-1">
                      {currentUser.role === "client" && (
                        <button
                          onClick={() => {
                            navigate("client-dashboard");
                            setProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                        >
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          Client Dashboard
                        </button>
                      )}

                      {currentUser.role === "freelancer" && (
                        <>
                          <button
                            onClick={() => {
                              navigate("freelancer-dashboard");
                              setProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                          >
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            Freelancer Dashboard
                          </button>
                          <button
                            onClick={() => {
                              navigate("freelancer-profile", { username: currentUser.username });
                              setProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                          >
                            <UserIcon className="w-4 h-4 text-slate-500" />
                            Public Profile View
                          </button>
                        </>
                      )}

                      {currentUser.role === "admin" && (
                        <button
                          onClick={() => {
                            navigate("admin-dashboard");
                            setProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-600" />
                          Super Admin Portal
                        </button>
                      )}

                      {activeWorkspaceProject && (
                        <button
                          onClick={() => {
                            navigate("project-workspace", { projectId: activeWorkspaceProject.id });
                            setProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                        >
                          <Layers className="w-4 h-4 text-emerald-600" />
                          Active Project Workspace
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("auth", { mode: "login" })}
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("auth", { mode: "register" })}
                  className="px-3.5 py-2 text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Primary Action Button: Post a Project */}
            <button
              onClick={() => {
                if (currentUser && currentUser.role === "freelancer") {
                  navigate("find-work");
                } else {
                  navigate("post-project");
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              {currentUser?.role === "freelancer" ? "Browse Projects" : "Post a Project"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                if (currentUser && currentUser.role === "freelancer") {
                  navigate("find-work");
                } else {
                  navigate("post-project");
                }
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              Post Project
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            <button
              onClick={() => {
                navigate("home");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("find-freelancers");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Find Freelancers
            </button>
            <button
              onClick={() => {
                navigate("find-work");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Find Work
            </button>
            <button
              onClick={() => {
                navigate("how-it-works");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                navigate("about");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              About
            </button>
            <button
              onClick={() => {
                navigate("contact");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Contact
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                </div>
                {currentUser.role === "client" && (
                  <button
                    onClick={() => {
                      navigate("client-dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
                  >
                    Client Dashboard
                  </button>
                )}
                {currentUser.role === "freelancer" && (
                  <button
                    onClick={() => {
                      navigate("freelancer-dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg"
                  >
                    Freelancer Dashboard
                  </button>
                )}
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("admin-dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
                  >
                    Admin Dashboard
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigate("auth", { mode: "login" });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-medium border border-slate-300 rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate("auth", { mode: "register" });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-medium bg-slate-900 text-white rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
