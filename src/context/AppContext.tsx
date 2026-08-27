import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  User,
  UserRole,
  Project,
  Proposal,
  Milestone,
  ProjectMessage,
  ProjectFile,
  Review,
  Dispute,
  PaymentTransaction,
  Settlement,
  AppNotification,
  AuditLog,
  PortfolioItem,
  PlatformCategory,
} from "../types";
import {
  initialUsers,
  initialProjects,
  initialProposals,
  initialMilestones,
  initialMessages,
  initialProjectFiles,
  initialReviews,
  initialDisputes,
  initialPayments,
  initialSettlements,
  initialNotifications,
  initialAuditLogs,
  initialCategories,
  initialPortfolios
} from "../data/mockData";
import { db, auth, googleProvider } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

export interface NavigationState {
  page: string;
  params?: Record<string, any>;
}

interface AppContextType {
  // Navigation
  nav: NavigationState;
  navigate: (page: string, params?: Record<string, any>) => void;

  // Firebase Status
  isFirebaseReady: boolean;
  firebaseSyncStatus: string;
  seedFirestoreData: () => Promise<void>;

  // Auth / Role Management
  currentUser: User | null;
  currentRole: UserRole;
  allUsers: User[];
  switchUser: (userId: string | null, roleOverride?: UserRole) => void;
  login: (email: string, role: UserRole) => boolean;
  register: (userData: Partial<User>) => boolean;
  logout: () => void;
  signInWithGoogleAuth: () => Promise<boolean>;
  signInWithEmailAuth: (email: string, pass: string, role: UserRole) => Promise<boolean>;
  registerWithEmailAuth: (email: string, pass: string, userData: Partial<User>) => Promise<boolean>;

  // Data Collections
  categories: PlatformCategory[];
  projects: Project[];
  proposals: Proposal[];
  milestones: Milestone[];
  messages: ProjectMessage[];
  projectFiles: ProjectFile[];
  reviews: Review[];
  disputes: Dispute[];
  payments: PaymentTransaction[];
  settlements: Settlement[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  portfolios: PortfolioItem[];
  platformCommission: number;

  // Actions
  postProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProjectStatus: (projectId: string, status: any) => Promise<void>;
  submitProposal: (proposalData: Partial<Proposal>) => Promise<Proposal>;
  shortlistProposal: (proposalId: string) => Promise<void>;
  hireFreelancer: (projectId: string, proposalId: string, agreedPrice: number) => Promise<void>;
  createMilestone: (projectId: string, milestone: Partial<Milestone>) => Promise<void>;
  fundMilestone: (milestoneId: string, paymentResult: any) => Promise<void>;
  submitMilestoneWork: (milestoneId: string, note: string, files?: any[]) => Promise<void>;
  requestMilestoneRevision: (milestoneId: string, note: string) => Promise<void>;
  approveMilestone: (milestoneId: string) => Promise<void>;
  sendProjectMessage: (projectId: string, content: string, attachments?: any[]) => Promise<void>;
  uploadProjectFile: (projectId: string, fileData: Partial<ProjectFile>) => Promise<void>;
  submitReview: (reviewData: Partial<Review>) => Promise<void>;
  openDispute: (disputeData: Partial<Dispute>) => Promise<void>;
  resolveDispute: (disputeId: string, resolution: any) => Promise<void>;
  requestSettlement: (freelancerId: string, amount: number) => Promise<void>;
  processSettlement: (settlementId: string) => Promise<void>;
  addPortfolioItem: (item: Partial<PortfolioItem>) => Promise<void>;
  
  // Admin Operations
  adminVerifyUser: (userId: string, verify: boolean) => Promise<void>;
  adminSuspendUser: (userId: string, suspend: boolean) => Promise<void>;
  adminUpdateCommission: (rate: number) => void;
  adminModerateProject: (projectId: string, action: "approve" | "reject") => Promise<void>;

  // Notifications & UI
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  activeToast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state
  const [nav, setNav] = useState<NavigationState>({ page: "home", params: {} });
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean>(false);
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<string>("Initializing Firestore...");

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 4000);
  };

  // State collections with LocalStorage fallback
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("weblancer_users");
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem("weblancer_current_user_id");
    return saved !== null ? saved : "usr-client-1";
  });

  const currentUser = allUsers.find((u) => u.id === currentUserId) || null;
  const currentRole: UserRole = currentUser ? currentUser.role : "guest";

  const [categories] = useState<PlatformCategory[]>(initialCategories);
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("weblancer_projects");
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem("weblancer_proposals");
    return saved ? JSON.parse(saved) : initialProposals;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem("weblancer_milestones");
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  const [messages, setMessages] = useState<ProjectMessage[]>(() => {
    const saved = localStorage.getItem("weblancer_messages");
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(() => {
    const saved = localStorage.getItem("weblancer_files");
    return saved ? JSON.parse(saved) : initialProjectFiles;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("weblancer_reviews");
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem("weblancer_disputes");
    return saved ? JSON.parse(saved) : initialDisputes;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem("weblancer_payments");
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [settlements, setSettlements] = useState<Settlement[]>(() => {
    const saved = localStorage.getItem("weblancer_settlements");
    return saved ? JSON.parse(saved) : initialSettlements;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("weblancer_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("weblancer_audit_logs");
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem("weblancer_portfolios");
    return saved ? JSON.parse(saved) : initialPortfolios;
  });

  const [platformCommission, setPlatformCommission] = useState<number>(10);

  // Sync to local storage for instant offline capability
  useEffect(() => {
    localStorage.setItem("weblancer_users", JSON.stringify(allUsers));
    localStorage.setItem("weblancer_current_user_id", currentUserId || "");
    localStorage.setItem("weblancer_projects", JSON.stringify(projects));
    localStorage.setItem("weblancer_proposals", JSON.stringify(proposals));
    localStorage.setItem("weblancer_milestones", JSON.stringify(milestones));
    localStorage.setItem("weblancer_messages", JSON.stringify(messages));
    localStorage.setItem("weblancer_files", JSON.stringify(projectFiles));
    localStorage.setItem("weblancer_reviews", JSON.stringify(reviews));
    localStorage.setItem("weblancer_disputes", JSON.stringify(disputes));
    localStorage.setItem("weblancer_payments", JSON.stringify(payments));
    localStorage.setItem("weblancer_settlements", JSON.stringify(settlements));
    localStorage.setItem("weblancer_notifications", JSON.stringify(notifications));
    localStorage.setItem("weblancer_audit_logs", JSON.stringify(auditLogs));
    localStorage.setItem("weblancer_portfolios", JSON.stringify(portfolios));
  }, [
    allUsers,
    currentUserId,
    projects,
    proposals,
    milestones,
    messages,
    projectFiles,
    reviews,
    disputes,
    payments,
    settlements,
    notifications,
    auditLogs,
    portfolios
  ]);

  // Seed Firestore initial data
  const seedFirestoreData = async () => {
    try {
      setFirebaseSyncStatus("Seeding initial Firestore database collections...");
      const batch = writeBatch(db);

      // Seed Users
      for (const u of initialUsers) {
        batch.set(doc(db, "users", u.id), u);
      }
      // Seed Projects
      for (const p of initialProjects) {
        batch.set(doc(db, "projects", p.id), p);
      }
      // Seed Proposals
      for (const pr of initialProposals) {
        batch.set(doc(db, "proposals", pr.id), pr);
      }
      // Seed Milestones
      for (const m of initialMilestones) {
        batch.set(doc(db, "milestones", m.id), m);
      }
      // Seed Portfolios
      for (const pf of initialPortfolios) {
        batch.set(doc(db, "portfolios", pf.id), pf);
      }
      // Seed Messages
      for (const msg of initialMessages) {
        batch.set(doc(db, "messages", msg.id), msg);
      }
      // Seed Files
      for (const f of initialProjectFiles) {
        batch.set(doc(db, "projectFiles", f.id), f);
      }
      // Seed Reviews
      for (const r of initialReviews) {
        batch.set(doc(db, "reviews", r.id), r);
      }
      // Seed Disputes
      for (const d of initialDisputes) {
        batch.set(doc(db, "disputes", d.id), d);
      }
      // Seed Payments
      for (const py of initialPayments) {
        batch.set(doc(db, "payments", py.id), py);
      }
      // Seed Settlements
      for (const s of initialSettlements) {
        batch.set(doc(db, "settlements", s.id), s);
      }
      // Seed Notifications
      for (const n of initialNotifications) {
        batch.set(doc(db, "notifications", n.id), n);
      }

      await batch.commit();
      setIsFirebaseReady(true);
      setFirebaseSyncStatus("Firestore Cloud Synced (Live)");
      showToast("Firestore database initialized and populated with seed data!");
    } catch (err) {
      console.error("Failed to seed Firestore:", err);
      setFirebaseSyncStatus("Firestore Live Sync Active");
    }
  };

  const isSeedingRef = useRef(false);

  // Firestore Real-Time Listeners (onSnapshot)
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      // 1. Users
      const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        if (!snapshot.empty) {
          const items: User[] = [];
          snapshot.forEach((d) => items.push(d.data() as User));
          setAllUsers(items);
          setIsFirebaseReady(true);
          setFirebaseSyncStatus("Firestore Cloud Synced (Live)");
        } else if (!isSeedingRef.current) {
          isSeedingRef.current = true;
          seedFirestoreData();
        }
      }, (err) => {
        console.warn("Firestore users listener notice:", err);
      });
      unsubs.push(unsubUsers);

      // 2. Projects
      const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
        if (!snapshot.empty) {
          const items: Project[] = [];
          snapshot.forEach((d) => items.push(d.data() as Project));
          // Sort recent first
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setProjects(items);
        }
      }, (err) => console.warn("Projects listener:", err));
      unsubs.push(unsubProjects);

      // 3. Proposals
      const unsubProposals = onSnapshot(collection(db, "proposals"), (snapshot) => {
        if (!snapshot.empty) {
          const items: Proposal[] = [];
          snapshot.forEach((d) => items.push(d.data() as Proposal));
          setProposals(items);
        }
      }, (err) => console.warn("Proposals listener:", err));
      unsubs.push(unsubProposals);

      // 4. Milestones
      const unsubMilestones = onSnapshot(collection(db, "milestones"), (snapshot) => {
        if (!snapshot.empty) {
          const items: Milestone[] = [];
          snapshot.forEach((d) => items.push(d.data() as Milestone));
          setMilestones(items);
        }
      }, (err) => console.warn("Milestones listener:", err));
      unsubs.push(unsubMilestones);

      // 5. Messages
      const unsubMessages = onSnapshot(collection(db, "messages"), (snapshot) => {
        if (!snapshot.empty) {
          const items: ProjectMessage[] = [];
          snapshot.forEach((d) => items.push(d.data() as ProjectMessage));
          setMessages(items);
        }
      }, (err) => console.warn("Messages listener:", err));
      unsubs.push(unsubMessages);

      // 6. Project Files
      const unsubFiles = onSnapshot(collection(db, "projectFiles"), (snapshot) => {
        if (!snapshot.empty) {
          const items: ProjectFile[] = [];
          snapshot.forEach((d) => items.push(d.data() as ProjectFile));
          setProjectFiles(items);
        }
      }, (err) => console.warn("Files listener:", err));
      unsubs.push(unsubFiles);

      // 7. Reviews
      const unsubReviews = onSnapshot(collection(db, "reviews"), (snapshot) => {
        if (!snapshot.empty) {
          const items: Review[] = [];
          snapshot.forEach((d) => items.push(d.data() as Review));
          setReviews(items);
        }
      }, (err) => console.warn("Reviews listener:", err));
      unsubs.push(unsubReviews);

      // 8. Disputes
      const unsubDisputes = onSnapshot(collection(db, "disputes"), (snapshot) => {
        if (!snapshot.empty) {
          const items: Dispute[] = [];
          snapshot.forEach((d) => items.push(d.data() as Dispute));
          setDisputes(items);
        }
      }, (err) => console.warn("Disputes listener:", err));
      unsubs.push(unsubDisputes);

      // 9. Payments
      const unsubPayments = onSnapshot(collection(db, "payments"), (snapshot) => {
        if (!snapshot.empty) {
          const items: PaymentTransaction[] = [];
          snapshot.forEach((d) => items.push(d.data() as PaymentTransaction));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPayments(items);
        }
      }, (err) => console.warn("Payments listener:", err));
      unsubs.push(unsubPayments);

      // 10. Settlements
      const unsubSettlements = onSnapshot(collection(db, "settlements"), (snapshot) => {
        if (!snapshot.empty) {
          const items: Settlement[] = [];
          snapshot.forEach((d) => items.push(d.data() as Settlement));
          setSettlements(items);
        }
      }, (err) => console.warn("Settlements listener:", err));
      unsubs.push(unsubSettlements);

      // 11. Notifications
      const unsubNotifications = onSnapshot(collection(db, "notifications"), (snapshot) => {
        if (!snapshot.empty) {
          const items: AppNotification[] = [];
          snapshot.forEach((d) => items.push(d.data() as AppNotification));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotifications(items);
        }
      }, (err) => console.warn("Notifications listener:", err));
      unsubs.push(unsubNotifications);

      // 12. Portfolios
      const unsubPortfolios = onSnapshot(collection(db, "portfolios"), (snapshot) => {
        if (!snapshot.empty) {
          const items: PortfolioItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as PortfolioItem));
          setPortfolios(items);
        }
      }, (err) => console.warn("Portfolios listener:", err));
      unsubs.push(unsubPortfolios);

      // Auth Listener
      const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // If logged in via Firebase Auth, ensure record exists in allUsers
          setAllUsers((prev) => {
            const existing = prev.find((u) => u.email.toLowerCase() === (firebaseUser.email || "").toLowerCase());
            if (!existing) {
              const newUser: User = {
                id: firebaseUser.uid,
                username: (firebaseUser.displayName || "user").toLowerCase().replace(/\s+/g, "_"),
                name: firebaseUser.displayName || "Authenticated Member",
                email: firebaseUser.email || "",
                role: "client",
                avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
                title: "WebLancer Client",
                bio: "Member on WebLancer marketplace.",
                hourlyRate: 1500,
                rating: 5.0,
                reviewsCount: 0,
                completedProjects: 0,
                skills: ["Product Strategy", "Management"],
                isVerified: true,
                location: "India",
                languages: ["English"],
                joinedDate: "Aug 2026",
                availability: "Available",
                walletBalance: 50000
              };
              setDoc(doc(db, "users", newUser.id), newUser).catch(console.error);
              return [...prev, newUser];
            }
            return prev;
          });
        }
      });
      unsubs.push(unsubAuth);

    } catch (err) {
      console.warn("Firestore initialization notice:", err);
    }

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const navigate = (page: string, params: Record<string, any> = {}) => {
    setNav({ page, params });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addAuditLog = (action: string, resource: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser?.id || "guest",
      userName: currentUser?.name || "Guest Visitor",
      userRole: currentUser?.role || "guest",
      action,
      resource,
      details,
      ip: "127.0.0.1",
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = async (userId: string, title: string, message: string, type: any, link?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      link
    };
    setNotifications((prev) => [newNotif, ...prev]);
    try {
      await setDoc(doc(db, "notifications", newNotif.id), newNotif);
    } catch (err) {
      console.warn("Firestore notification save:", err);
    }
  };

  const switchUser = (userId: string | null) => {
    setCurrentUserId(userId);
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      showToast(`Switched perspective to ${target.name} (${target.role.toUpperCase()})`);
      addAuditLog("USER_SWITCHED_ROLE", `User: ${target.name}`, `Switched to role: ${target.role}`);
    } else {
      showToast("Browsing as Guest Visitor");
    }
  };

  const login = (email: string, role: UserRole): boolean => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (existing) {
      setCurrentUserId(existing.id);
      showToast(`Welcome back, ${existing.name}!`);
      addAuditLog("USER_LOGIN", `User: ${existing.name}`, "Successful login authentication");
      if (role === "client") navigate("client-dashboard");
      else if (role === "freelancer") navigate("freelancer-dashboard");
      else if (role === "admin") navigate("admin-dashboard");
      return true;
    }
    return false;
  };

  const register = (userData: Partial<User>): boolean => {
    const newId = `usr-${userData.role}-${Date.now().toString(36)}`;
    const newUser: User = {
      id: newId,
      username: (userData.name || "user").toLowerCase().replace(/\s+/g, "_") + "_" + Math.floor(Math.random() * 100),
      name: userData.name || "New Member",
      email: userData.email || "",
      role: userData.role || "client",
      avatar: userData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
      title: userData.title || (userData.role === "freelancer" ? "Professional Freelancer" : "Project Client"),
      bio: userData.bio || "Member on WebLancer marketplace.",
      hourlyRate: userData.hourlyRate || 1500,
      rating: 5.0,
      reviewsCount: 0,
      completedProjects: 0,
      skills: userData.skills || ["Web Development", "React"],
      isVerified: false,
      location: userData.location || "India",
      languages: ["English"],
      joinedDate: "Aug 2026",
      availability: "Available",
      companyName: userData.companyName,
      walletBalance: userData.role === "client" ? 50000 : 0
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newId);
    setDoc(doc(db, "users", newId), newUser).catch(console.error);

    showToast(`Account successfully created! Welcome to WebLancer, ${newUser.name}.`);
    addAuditLog("USER_REGISTRATION", `User: ${newUser.name}`, `Created new ${newUser.role} account`);
    
    if (newUser.role === "client") navigate("client-dashboard");
    else if (newUser.role === "freelancer") navigate("freelancer-dashboard");
    else navigate("home");
    return true;
  };

  // Firebase Auth: Google Sign In
  const signInWithGoogleAuth = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      let existing = allUsers.find((u) => u.email.toLowerCase() === (fbUser.email || "").toLowerCase());
      if (!existing) {
        existing = {
          id: fbUser.uid,
          username: (fbUser.displayName || "user").toLowerCase().replace(/\s+/g, "_"),
          name: fbUser.displayName || "Google User",
          email: fbUser.email || "",
          role: "client",
          avatar: fbUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
          title: "Project Client",
          bio: "Verified Google account on WebLancer.",
          hourlyRate: 1500,
          rating: 5.0,
          reviewsCount: 0,
          completedProjects: 0,
          skills: ["Web Strategy"],
          isVerified: true,
          location: "India",
          languages: ["English"],
          joinedDate: "Aug 2026",
          availability: "Available",
          walletBalance: 50000
        };
        await setDoc(doc(db, "users", existing.id), existing);
        setAllUsers((prev) => [...prev, existing!]);
      }
      setCurrentUserId(existing.id);
      showToast(`Signed in with Google as ${existing.name}!`);
      navigate(existing.role === "freelancer" ? "freelancer-dashboard" : "client-dashboard");
      return true;
    } catch (err: any) {
      console.error("Google Auth error:", err);
      showToast(`Google Sign-in failed: ${err.message}`);
      return false;
    }
  };

  // Firebase Auth: Email Login
  const signInWithEmailAuth = async (email: string, pass: string, role: UserRole): Promise<boolean> => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const uid = userCred.user.uid;
      const match = allUsers.find((u) => u.id === uid || u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        setCurrentUserId(match.id);
        showToast(`Firebase Auth Login Successful: Welcome ${match.name}!`);
        navigate(match.role === "freelancer" ? "freelancer-dashboard" : match.role === "admin" ? "admin-dashboard" : "client-dashboard");
        return true;
      }
    } catch (err: any) {
      // Fallback to local user registry if mock password
      const localMatch = login(email, role);
      if (localMatch) return true;
      showToast(`Authentication notice: ${err.message || "Invalid credentials"}`);
    }
    return false;
  };

  // Firebase Auth: Register with Email
  const registerWithEmailAuth = async (email: string, pass: string, userData: Partial<User>): Promise<boolean> => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = userCred.user.uid;
      const newUser: User = {
        id: uid,
        username: (userData.name || "user").toLowerCase().replace(/\s+/g, "_"),
        name: userData.name || "New Member",
        email,
        role: userData.role || "client",
        avatar: userData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
        title: userData.title || (userData.role === "freelancer" ? "Professional Freelancer" : "Project Client"),
        bio: userData.bio || "Member on WebLancer marketplace.",
        hourlyRate: userData.hourlyRate || 1500,
        rating: 5.0,
        reviewsCount: 0,
        completedProjects: 0,
        skills: userData.skills || ["React", "TypeScript"],
        isVerified: true,
        location: userData.location || "India",
        languages: ["English"],
        joinedDate: "Aug 2026",
        availability: "Available",
        companyName: userData.companyName,
        walletBalance: userData.role === "client" ? 50000 : 0
      };

      await setDoc(doc(db, "users", uid), newUser);
      setAllUsers((prev) => [...prev, newUser]);
      setCurrentUserId(uid);
      showToast(`Account registered in Firebase! Welcome ${newUser.name}.`);
      navigate(newUser.role === "freelancer" ? "freelancer-dashboard" : "client-dashboard");
      return true;
    } catch (err: any) {
      console.warn("Firebase Auth Register note:", err);
      return register(userData);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setCurrentUserId(null);
    showToast("You have been signed out.");
    navigate("home");
  };

  // Projects
  const postProject = async (projectData: Partial<Project>): Promise<Project> => {
    const newId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      title: projectData.title || "Untitled Project",
      category: projectData.category || "Website Development",
      projectType: projectData.projectType || "fixed",
      description: projectData.description || "",
      requiredFeatures: projectData.requiredFeatures || [],
      requiredSkills: projectData.requiredSkills || ["React", "TypeScript"],
      budgetMin: projectData.budgetMin || 25000,
      budgetMax: projectData.budgetMax || 50000,
      isNegotiable: projectData.isNegotiable ?? true,
      expectedTimeline: projectData.expectedTimeline || "3-4 Weeks",
      status: "open",
      clientId: currentUser?.id || "usr-client-1",
      clientName: currentUser?.name || "Alex Vance",
      clientAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      clientCompany: currentUser?.companyName || "Client Tech",
      clientRating: currentUser?.rating || 5.0,
      clientProjectsPosted: (currentUser?.completedProjects || 0) + 1,
      clientLocation: currentUser?.location || "Mumbai, India",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: projectData.attachments || [],
      proposalsCount: 0
    };

    setProjects((prev) => [newProject, ...prev]);
    try {
      await setDoc(doc(db, "projects", newId), newProject);
    } catch (err) {
      console.warn("Firestore project save:", err);
    }

    showToast("Project successfully published to Firestore & WebLancer marketplace!");
    addAuditLog("PROJECT_POSTED", `Project: ${newProject.title}`, `Budget: ₹${newProject.budgetMin} - ₹${newProject.budgetMax}`);
    addNotification("usr-admin-1", "New Project Posted", `${newProject.clientName} posted '${newProject.title}'`, "system", `project/${newId}`);
    return newProject;
  };

  const updateProjectStatus = async (projectId: string, status: any) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );
    try {
      await updateDoc(doc(db, "projects", projectId), { status, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn("Firestore update:", err);
    }
    addAuditLog("PROJECT_STATUS_UPDATED", `Project: ${projectId}`, `Status changed to: ${status}`);
  };

  // Proposals
  const submitProposal = async (proposalData: Partial<Proposal>): Promise<Proposal> => {
    const newId = `prop-${Date.now()}`;
    const newProposal: Proposal = {
      id: newId,
      projectId: proposalData.projectId || "",
      projectTitle: proposalData.projectTitle || "",
      freelancerId: currentUser?.id || "usr-free-1",
      freelancerName: currentUser?.name || "Sophia Chen",
      freelancerAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
      freelancerTitle: currentUser?.title || "Staff Engineer",
      freelancerRating: currentUser?.rating || 5.0,
      freelancerReviewsCount: currentUser?.reviewsCount || 0,
      proposedAmount: proposalData.proposedAmount || 50000,
      estimatedDays: proposalData.estimatedDays || 21,
      coverLetter: proposalData.coverLetter || "",
      relevantPortfolioIds: proposalData.relevantPortfolioIds || [],
      status: "submitted",
      createdAt: new Date().toISOString(),
      winScore: proposalData.winScore || 90,
      highlights: proposalData.highlights || ["Clear execution roadmap", "Punctual delivery guarantee"]
    };

    setProposals((prev) => [newProposal, ...prev]);
    setProjects((prev) =>
      prev.map((p) => (p.id === proposalData.projectId ? { ...p, proposalsCount: p.proposalsCount + 1 } : p))
    );

    try {
      await setDoc(doc(db, "proposals", newId), newProposal);
      const proj = projects.find((p) => p.id === proposalData.projectId);
      if (proj) {
        await updateDoc(doc(db, "projects", proj.id), { proposalsCount: proj.proposalsCount + 1 });
      }
    } catch (err) {
      console.warn("Firestore proposal save:", err);
    }

    const proj = projects.find((p) => p.id === proposalData.projectId);
    if (proj) {
      addNotification(proj.clientId, "New Proposal Received", `${newProposal.freelancerName} sent a proposal for '${proj.title}'`, "proposal", `workspace/${proj.id}`);
    }

    showToast("Proposal sent and saved to Firestore database!");
    addAuditLog("PROPOSAL_SUBMITTED", `Proposal: ${newId}`, `Freelancer: ${newProposal.freelancerName} proposed ₹${newProposal.proposedAmount}`);
    return newProposal;
  };

  const shortlistProposal = async (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: "shortlisted" } : p))
    );
    try {
      await updateDoc(doc(db, "proposals", proposalId), { status: "shortlisted" });
    } catch (err) {
      console.warn("Firestore shortlist update:", err);
    }
    showToast("Freelancer shortlisted!");
  };

  const hireFreelancer = async (projectId: string, proposalId: string, agreedPrice: number) => {
    const proposal = proposals.find((p) => p.id === proposalId);
    const project = projects.find((p) => p.id === projectId);
    if (!proposal || !project) return;

    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: "accepted" } : p.projectId === projectId ? { ...p, status: "rejected" } : p))
    );

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: "in_progress",
              hiredFreelancerId: proposal.freelancerId,
              hiredFreelancerName: proposal.freelancerName,
              hiredFreelancerAvatar: proposal.freelancerAvatar,
              agreedPrice,
              contractCreatedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : p
      )
    );

    // Auto-create initial milestones if none exist
    const existingMs = milestones.filter((m) => m.projectId === projectId);
    if (existingMs.length === 0) {
      const halfPrice = Math.round(agreedPrice / 2);
      const ms1: Milestone = {
        id: `ms-${Date.now()}-1`,
        projectId,
        title: "Milestone 1: Core Architecture, DB Schema & Wireframes",
        description: "Initial foundational deliverables, data model, and interactive skeleton view.",
        amount: halfPrice,
        dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
        deliverables: "Git repo setup, DB schemas, Figma wireframe sign-off",
        status: "awaiting_payment",
        orderNumber: 1,
        revisionCount: 0
      };
      const ms2: Milestone = {
        id: `ms-${Date.now()}-2`,
        projectId,
        title: "Milestone 2: Feature Implementation, Razorpay & Final Polish",
        description: "Complete feature set, integration testing, and production deployment handoff.",
        amount: agreedPrice - halfPrice,
        dueDate: new Date(Date.now() + 25 * 86400000).toISOString().split("T")[0],
        deliverables: "Full source code, production deployment, verification documentation",
        status: "draft",
        orderNumber: 2,
        revisionCount: 0
      };
      setMilestones((prev) => [...prev, ms1, ms2]);
      try {
        await setDoc(doc(db, "milestones", ms1.id), ms1);
        await setDoc(doc(db, "milestones", ms2.id), ms2);
      } catch (err) {
        console.warn("Firestore milestone create:", err);
      }
    }

    try {
      await updateDoc(doc(db, "proposals", proposalId), { status: "accepted" });
      await updateDoc(doc(db, "projects", projectId), {
        status: "in_progress",
        hiredFreelancerId: proposal.freelancerId,
        hiredFreelancerName: proposal.freelancerName,
        hiredFreelancerAvatar: proposal.freelancerAvatar,
        agreedPrice,
        contractCreatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Firestore hire update:", err);
    }

    addNotification(proposal.freelancerId, "You're Hired!", `Congratulations! ${project.clientName} hired you for '${project.title}' at ₹${agreedPrice.toLocaleString("en-IN")}.`, "hiring", `workspace/${projectId}`);
    showToast(`Hired ${proposal.freelancerName}! Project workspace is now active in Firestore.`);
    addAuditLog("CONTRACT_ACTIVATED", `Project: ${project.title}`, `Client: ${project.clientName} hired Freelancer: ${proposal.freelancerName} for ₹${agreedPrice}`);
    navigate("project-workspace", { projectId });
  };

  // Milestones
  const createMilestone = async (projectId: string, msData: Partial<Milestone>) => {
    const newMs: Milestone = {
      id: `ms-${Date.now()}`,
      projectId,
      title: msData.title || "New Project Milestone",
      description: msData.description || "Deliverable description",
      amount: msData.amount || 20000,
      dueDate: msData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      deliverables: msData.deliverables || "Specified deliverables",
      status: "awaiting_payment",
      orderNumber: milestones.filter((m) => m.projectId === projectId).length + 1,
      revisionCount: 0
    };

    setMilestones((prev) => [...prev, newMs]);
    try {
      await setDoc(doc(db, "milestones", newMs.id), newMs);
    } catch (err) {
      console.warn("Firestore milestone save:", err);
    }
    showToast("Milestone created successfully!");
    addAuditLog("MILESTONE_CREATED", `Milestone: ${newMs.title}`, `Amount: ₹${newMs.amount}`);
  };

  const fundMilestone = async (milestoneId: string, paymentResult: any) => {
    const ms = milestones.find((m) => m.id === milestoneId);
    if (!ms) return;
    const project = projects.find((p) => p.id === ms.projectId);

    const updatedMs = {
      ...ms,
      status: "funded" as const,
      fundedAt: new Date().toISOString(),
      paymentId: paymentResult.paymentId || `pay_sim_${Date.now()}`
    };

    setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? updatedMs : m)));

    const commissionFee = Math.round(ms.amount * (platformCommission / 100));
    const tx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      paymentId: paymentResult.paymentId || `pay_${Date.now()}`,
      orderId: paymentResult.orderId || `order_${Date.now()}`,
      projectId: ms.projectId,
      projectTitle: project?.title || "WebLancer Project",
      milestoneId: ms.id,
      milestoneTitle: ms.title,
      clientId: project?.clientId || currentUser?.id || "usr-client-1",
      clientName: project?.clientName || currentUser?.name || "Client",
      freelancerId: project?.hiredFreelancerId || "usr-free-1",
      freelancerName: project?.hiredFreelancerName || "Freelancer",
      amount: ms.amount,
      fee: commissionFee,
      netAmount: ms.amount - commissionFee,
      currency: "INR",
      status: "captured",
      method: "Razorpay (Verified Signature)",
      createdAt: new Date().toISOString(),
      auditHash: Math.random().toString(36).substring(2) + Date.now().toString(36)
    };

    setPayments((prev) => [tx, ...prev]);

    try {
      await updateDoc(doc(db, "milestones", milestoneId), {
        status: "funded",
        fundedAt: updatedMs.fundedAt,
        paymentId: updatedMs.paymentId
      });
      await setDoc(doc(db, "payments", tx.id), tx);
    } catch (err) {
      console.warn("Firestore payment update:", err);
    }

    if (project?.hiredFreelancerId) {
      addNotification(project.hiredFreelancerId, "Milestone Funded & In Escrow", `₹${ms.amount.toLocaleString("en-IN")} funded for '${ms.title}'. You can begin work!`, "payment", `workspace/${ms.projectId}`);
    }

    showToast(`Payment of ₹${ms.amount.toLocaleString("en-IN")} verified! Milestone funded.`);
    addAuditLog("RAZORPAY_PAYMENT_VERIFIED", `Milestone: ${ms.title}`, `Amount: ₹${ms.amount}, Payment ID: ${tx.paymentId}`);
  };

  const submitMilestoneWork = async (milestoneId: string, note: string, files: any[] = []) => {
    const ms = milestones.find((m) => m.id === milestoneId);
    if (!ms) return;
    const project = projects.find((p) => p.id === ms.projectId);

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: "submitted",
              submittedAt: new Date().toISOString(),
              submissionNote: note,
              submissionFiles: files.length > 0 ? files : m.submissionFiles
            }
          : m
      )
    );

    try {
      await updateDoc(doc(db, "milestones", milestoneId), {
        status: "submitted",
        submittedAt: new Date().toISOString(),
        submissionNote: note,
        submissionFiles: files.length > 0 ? files : ms.submissionFiles || []
      });
    } catch (err) {
      console.warn("Firestore submit work update:", err);
    }

    if (project?.clientId) {
      addNotification(project.clientId, "Milestone Work Submitted", `${currentUser?.name || "Freelancer"} submitted deliverables for '${ms.title}'.`, "milestone", `workspace/${ms.projectId}`);
    }

    showToast("Deliverables submitted to Firestore for client review!");
    addAuditLog("MILESTONE_WORK_SUBMITTED", `Milestone: ${ms.title}`, `Submission Note: ${note}`);
  };

  const requestMilestoneRevision = async (milestoneId: string, note: string) => {
    const ms = milestones.find((m) => m.id === milestoneId);
    if (!ms) return;
    const project = projects.find((p) => p.id === ms.projectId);

    const updatedNotes = [...(ms.revisionNotes || []), `${new Date().toLocaleDateString()}: ${note}`];

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: "revision_requested",
              revisionCount: m.revisionCount + 1,
              revisionNotes: updatedNotes
            }
          : m
      )
    );

    try {
      await updateDoc(doc(db, "milestones", milestoneId), {
        status: "revision_requested",
        revisionCount: ms.revisionCount + 1,
        revisionNotes: updatedNotes
      });
    } catch (err) {
      console.warn("Firestore revision update:", err);
    }

    if (project?.hiredFreelancerId) {
      addNotification(project.hiredFreelancerId, "Revision Requested", `Client requested a revision for '${ms.title}': "${note}"`, "milestone", `workspace/${ms.projectId}`);
    }

    showToast("Revision request sent to freelancer.");
    addAuditLog("MILESTONE_REVISION_REQUESTED", `Milestone: ${ms.title}`, `Revision Note: ${note}`);
  };

  const approveMilestone = async (milestoneId: string) => {
    const ms = milestones.find((m) => m.id === milestoneId);
    if (!ms) return;
    const project = projects.find((p) => p.id === ms.projectId);

    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: "approved",
              approvedAt: new Date().toISOString()
            }
          : m
      )
    );

    const commission = Math.round(ms.amount * (platformCommission / 100));
    const tds = Math.round(ms.amount * 0.01);
    const netPayout = ms.amount - commission - tds;

    const settlement: Settlement = {
      id: `stl-${Date.now()}`,
      freelancerId: project?.hiredFreelancerId || "usr-free-1",
      freelancerName: project?.hiredFreelancerName || "Sophia Chen",
      amount: ms.amount,
      platformCommission: commission,
      tdsDeduction: tds,
      netPayout,
      status: "eligible_for_settlement",
      bankAccountMasked: "HDFC Bank (•••• 4912)",
      initiatedAt: new Date().toISOString(),
      milestoneTitle: ms.title,
      projectTitle: project?.title || "WebLancer Contract"
    };

    setSettlements((prev) => [settlement, ...prev]);

    try {
      await updateDoc(doc(db, "milestones", milestoneId), {
        status: "approved",
        approvedAt: new Date().toISOString()
      });
      await setDoc(doc(db, "settlements", settlement.id), settlement);
    } catch (err) {
      console.warn("Firestore approve milestone update:", err);
    }

    const projectMilestones = milestones.filter((m) => m.projectId === ms.projectId);
    const allApproved = projectMilestones.every((m) => (m.id === milestoneId ? true : m.status === "approved"));
    if (allApproved && projectMilestones.length > 0) {
      setProjects((prev) =>
        prev.map((p) => (p.id === ms.projectId ? { ...p, status: "completed", contractCompletedAt: new Date().toISOString() } : p))
      );
      updateDoc(doc(db, "projects", ms.projectId), {
        status: "completed",
        contractCompletedAt: new Date().toISOString()
      }).catch(console.warn);
      showToast("All milestones approved! Project marked as Completed in Firestore.");
    } else {
      showToast(`Milestone approved! ₹${netPayout.toLocaleString("en-IN")} released to settlement queue.`);
    }

    if (project?.hiredFreelancerId) {
      addNotification(project.hiredFreelancerId, "Milestone Approved & Earnings Released!", `₹${netPayout.toLocaleString("en-IN")} has been credited to your settlement queue for '${ms.title}'.`, "payment", `freelancer/earnings`);
    }

    addAuditLog("MILESTONE_APPROVED", `Milestone: ${ms.title}`, `Approved by ${currentUser?.name}. Released net ₹${netPayout}`);
  };

  // Messaging & Files
  const sendProjectMessage = async (projectId: string, content: string, attachments: any[] = []) => {
    if (!content.trim()) return;
    const newMsg: ProjectMessage = {
      id: `msg-${Date.now()}`,
      projectId,
      senderId: currentUser?.id || "guest",
      senderName: currentUser?.name || "Guest User",
      senderRole: currentUser?.role || "guest",
      senderAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
      content,
      attachments,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages((prev) => [...prev, newMsg]);
    try {
      await setDoc(doc(db, "messages", newMsg.id), newMsg);
    } catch (err) {
      console.warn("Firestore message save:", err);
    }

    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const recipientId = currentUser?.id === project.clientId ? project.hiredFreelancerId : project.clientId;
      if (recipientId) {
        addNotification(recipientId, "New Project Message", `${currentUser?.name}: "${content.slice(0, 40)}..."`, "message", `workspace/${projectId}`);
      }
    }
  };

  const uploadProjectFile = async (projectId: string, fileData: Partial<ProjectFile>) => {
    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      projectId,
      name: fileData.name || "Untitled_File.pdf",
      size: fileData.size || "1.2 MB",
      type: fileData.type || "application/pdf",
      category: fileData.category || "freelancer_work",
      uploadedById: currentUser?.id || "usr-1",
      uploadedByName: currentUser?.name || "Team Member",
      uploadedAt: new Date().toISOString().split("T")[0],
      url: fileData.url || "#"
    };

    setProjectFiles((prev) => [newFile, ...prev]);
    try {
      await setDoc(doc(db, "projectFiles", newFile.id), newFile);
    } catch (err) {
      console.warn("Firestore file save:", err);
    }
    showToast(`File "${newFile.name}" stored in Firestore vault.`);
    addAuditLog("FILE_UPLOADED", `File: ${newFile.name}`, `Vault: ${newFile.category}`);
  };

  // Reviews
  const submitReview = async (reviewData: Partial<Review>) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      projectId: reviewData.projectId || "",
      projectTitle: reviewData.projectTitle || "",
      reviewerId: currentUser?.id || "usr-1",
      reviewerName: currentUser?.name || "Client",
      reviewerAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      reviewerRole: (currentUser?.role === "freelancer" ? "freelancer" : "client") as "client" | "freelancer",
      targetUserId: reviewData.targetUserId || "",
      targetUserName: reviewData.targetUserName || "",
      rating: reviewData.rating || 5,
      communicationRating: reviewData.communicationRating || 5,
      qualityRating: reviewData.qualityRating || 5,
      deliveryRating: reviewData.deliveryRating || 5,
      comment: reviewData.comment || "Great experience working together!",
      createdAt: new Date().toISOString()
    };

    setReviews((prev) => [newReview, ...prev]);
    try {
      await setDoc(doc(db, "reviews", newReview.id), newReview);
    } catch (err) {
      console.warn("Firestore review save:", err);
    }
    showToast("Review submitted and saved to Firestore!");
    addAuditLog("REVIEW_SUBMITTED", `Review on: ${newReview.targetUserName}`, `Rating: ${newReview.rating} Stars`);
  };

  // Disputes
  const openDispute = async (disputeData: Partial<Dispute>) => {
    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      projectId: disputeData.projectId || "",
      projectTitle: disputeData.projectTitle || "",
      milestoneId: disputeData.milestoneId,
      milestoneTitle: disputeData.milestoneTitle,
      contractAmount: disputeData.contractAmount || 25000,
      initiatorId: currentUser?.id || "usr-1",
      initiatorName: currentUser?.name || "Client",
      initiatorRole: (currentUser?.role === "freelancer" ? "freelancer" : "client") as "client" | "freelancer",
      respondentId: disputeData.respondentId || "usr-free-1",
      respondentName: disputeData.respondentName || "Freelancer",
      reason: disputeData.reason || "Dispute on deliverables",
      description: disputeData.description || "",
      evidenceFiles: disputeData.evidenceFiles || [],
      status: "under_review",
      createdAt: new Date().toISOString(),
      adminNotes: "Dispute opened. WebLancer Trust & Safety panel investigating."
    };

    setDisputes((prev) => [newDispute, ...prev]);
    try {
      await setDoc(doc(db, "disputes", newDispute.id), newDispute);
    } catch (err) {
      console.warn("Firestore dispute save:", err);
    }
    addNotification("usr-admin-1", "New Dispute Case Escalated", `Dispute opened for '${newDispute.projectTitle}' by ${newDispute.initiatorName}`, "dispute", "admin-dashboard");
    showToast("Dispute logged in Firestore mediation database.");
    addAuditLog("DISPUTE_OPENED", `Dispute: ${newDispute.id}`, `Reason: ${newDispute.reason}`);
  };

  const resolveDispute = async (disputeId: string, resolution: any) => {
    const updated = {
      status: "resolved" as const,
      resolutionVerdict: resolution.verdict,
      adminNotes: resolution.notes,
      refundClientAmount: resolution.refundClientAmount,
      payoutFreelancerAmount: resolution.payoutFreelancerAmount,
      resolvedAt: new Date().toISOString()
    };

    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, ...updated } : d))
    );

    try {
      await updateDoc(doc(db, "disputes", disputeId), updated);
    } catch (err) {
      console.warn("Firestore resolve dispute update:", err);
    }

    showToast("Dispute resolved in Firestore and platform audit trail.");
    addAuditLog("DISPUTE_RESOLVED", `Dispute: ${disputeId}`, `Verdict: ${resolution.verdict}`);
  };

  // Settlements
  const requestSettlement = async (freelancerId: string, amount: number) => {
    const newStl: Settlement = {
      id: `stl-${Date.now()}`,
      freelancerId,
      freelancerName: currentUser?.name || "Freelancer",
      amount,
      platformCommission: Math.round(amount * 0.1),
      tdsDeduction: Math.round(amount * 0.01),
      netPayout: Math.round(amount * 0.89),
      status: "processing",
      bankAccountMasked: "HDFC Bank (•••• 4912)",
      initiatedAt: new Date().toISOString(),
      milestoneTitle: "Manual Batch Payout Request",
      projectTitle: "Freelancer Balance Settlement"
    };

    setSettlements((prev) => [newStl, ...prev]);
    try {
      await setDoc(doc(db, "settlements", newStl.id), newStl);
    } catch (err) {
      console.warn("Firestore settlement save:", err);
    }
    showToast(`Settlement request of ₹${newStl.netPayout.toLocaleString("en-IN")} submitted.`);
    addAuditLog("SETTLEMENT_REQUESTED", `Freelancer: ${newStl.freelancerName}`, `Net: ₹${newStl.netPayout}`);
  };

  const processSettlement = async (settlementId: string) => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === settlementId
          ? { ...s, status: "settled", completedAt: new Date().toISOString() }
          : s
      )
    );
    try {
      await updateDoc(doc(db, "settlements", settlementId), {
        status: "settled",
        completedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Firestore process settlement update:", err);
    }
    showToast("Settlement approved and disbursed in Firestore.");
    addAuditLog("SETTLEMENT_PROCESSED", `Settlement: ${settlementId}`, "Bank transfer completed");
  };

  const addPortfolioItem = async (item: Partial<PortfolioItem>) => {
    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      userId: currentUser?.id || "usr-free-1",
      title: item.title || "Featured Project",
      description: item.description || "Project overview",
      coverImage: item.coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      technologies: item.technologies || ["React", "TypeScript"],
      liveUrl: item.liveUrl,
      gallery: item.gallery || [],
      completedAt: item.completedAt || "2026"
    };
    setPortfolios((prev) => [newItem, ...prev]);
    try {
      await setDoc(doc(db, "portfolios", newItem.id), newItem);
    } catch (err) {
      console.warn("Firestore portfolio save:", err);
    }
    showToast("Portfolio project added and saved to Firestore!");
  };

  // Admin Actions
  const adminVerifyUser = async (userId: string, isVerified: boolean) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified } : u))
    );
    try {
      await updateDoc(doc(db, "users", userId), { isVerified });
    } catch (err) {
      console.warn("Firestore admin verify update:", err);
    }
    showToast(`User ${isVerified ? "verified with badge in Firestore" : "verification removed"}.`);
    addAuditLog("ADMIN_USER_VERIFICATION", `User: ${userId}`, `Verified: ${isVerified}`);
  };

  const adminSuspendUser = async (userId: string, isSuspended: boolean) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isSuspended } : u))
    );
    try {
      await updateDoc(doc(db, "users", userId), { isSuspended });
    } catch (err) {
      console.warn("Firestore admin suspend update:", err);
    }
    showToast(`User ${isSuspended ? "suspended in Firestore" : "reactivated"}.`);
    addAuditLog("ADMIN_USER_SUSPEND", `User: ${userId}`, `Suspended: ${isSuspended}`);
  };

  const adminUpdateCommission = (rate: number) => {
    setPlatformCommission(rate);
    showToast(`Platform commission rate updated to ${rate}%.`);
    addAuditLog("ADMIN_COMMISSION_CHANGE", "Platform Settings", `Rate updated to: ${rate}%`);
  };

  const adminModerateProject = async (projectId: string, action: "approve" | "reject") => {
    const newStatus = action === "approve" ? "open" : "cancelled";
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    );
    try {
      await updateDoc(doc(db, "projects", projectId), { status: newStatus });
    } catch (err) {
      console.warn("Firestore moderate project update:", err);
    }
    showToast(`Project ${action === "approve" ? "approved" : "rejected"} in Firestore.`);
    addAuditLog("ADMIN_PROJECT_MODERATION", `Project: ${projectId}`, `Action: ${action}`);
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (err) {
      console.warn("Firestore mark notif read:", err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read.");
  };

  return (
    <AppContext.Provider
      value={{
        nav,
        navigate,
        isFirebaseReady,
        firebaseSyncStatus,
        seedFirestoreData,
        currentUser,
        currentRole,
        allUsers,
        switchUser,
        login,
        register,
        logout,
        signInWithGoogleAuth,
        signInWithEmailAuth,
        registerWithEmailAuth,
        categories,
        projects,
        proposals,
        milestones,
        messages,
        projectFiles,
        reviews,
        disputes,
        payments,
        settlements,
        notifications,
        auditLogs,
        portfolios,
        platformCommission,
        postProject,
        updateProjectStatus,
        submitProposal,
        shortlistProposal,
        hireFreelancer,
        createMilestone,
        fundMilestone,
        submitMilestoneWork,
        requestMilestoneRevision,
        approveMilestone,
        sendProjectMessage,
        uploadProjectFile,
        submitReview,
        openDispute,
        resolveDispute,
        requestSettlement,
        processSettlement,
        addPortfolioItem,
        adminVerifyUser,
        adminSuspendUser,
        adminUpdateCommission,
        adminModerateProject,
        markNotificationRead,
        markAllNotificationsRead,
        activeToast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
