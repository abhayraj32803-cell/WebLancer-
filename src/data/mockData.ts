import {
  User,
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
  PlatformCategory
} from "../types";

export const initialCategories: PlatformCategory[] = [
  {
    id: "cat-1",
    name: "Website Development",
    slug: "website-development",
    iconName: "Globe",
    description: "Custom corporate portals, landing pages, responsive business websites, and SPAs.",
    projectCount: 42,
    freelancerCount: 128,
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vue.js", "HTML5/CSS3"]
  },
  {
    id: "cat-2",
    name: "Web Application Development",
    slug: "web-applications",
    iconName: "LayoutGrid",
    description: "Complex SaaS platforms, client portals, real-time dashboards, and full-stack systems.",
    projectCount: 38,
    freelancerCount: 94,
    skills: ["Node.js", "Express", "PostgreSQL", "GraphQL", "Docker", "Redis", "TypeScript"]
  },
  {
    id: "cat-3",
    name: "E-commerce Development",
    slug: "ecommerce",
    iconName: "ShoppingBag",
    description: "High-converting online stores, multi-vendor marketplaces, Razorpay/Stripe checkouts.",
    projectCount: 29,
    freelancerCount: 76,
    skills: ["Shopify", "WooCommerce", "Razorpay", "Payment Gateways", "Next.js Commerce", "Inventory APIs"]
  },
  {
    id: "cat-4",
    name: "Mobile App Development",
    slug: "mobile-apps",
    iconName: "Smartphone",
    description: "Cross-platform iOS and Android mobile apps with smooth gestures and offline sync.",
    projectCount: 34,
    freelancerCount: 82,
    skills: ["React Native", "Flutter", "iOS Swift", "Android Kotlin", "Firebase", "Push Notifications"]
  },
  {
    id: "cat-5",
    name: "Frontend Development",
    slug: "frontend-development",
    iconName: "Code2",
    description: "Pixel-perfect component architectures, motion animations, and accessible web UI.",
    projectCount: 51,
    freelancerCount: 160,
    skills: ["React", "Tailwind CSS", "Framer Motion", "Shadcn UI", "Accessibility (a11y)", "Vite"]
  },
  {
    id: "cat-6",
    name: "Backend Development",
    slug: "backend-development",
    iconName: "Server",
    description: "Scalable REST & GraphQL microservices, database tuning, auth, and caching layers.",
    projectCount: 31,
    freelancerCount: 70,
    skills: ["Node.js", "Python / FastAPI", "PostgreSQL", "Prisma", "Redis", "Security / JWT", "Docker"]
  },
  {
    id: "cat-7",
    name: "UI/UX Design",
    slug: "ui-ux-design",
    iconName: "Palette",
    description: "User research, wireframing, high-fidelity design systems, and clickable Figma prototypes.",
    projectCount: 46,
    freelancerCount: 115,
    skills: ["Figma", "Design Systems", "User Research", "Wireframing", "Prototyping", "UX Copywriting"]
  },
  {
    id: "cat-8",
    name: "WordPress / CMS",
    slug: "wordpress-cms",
    iconName: "Layers",
    description: "Custom headless CMS integrations, WordPress theme customization, and speed optimization.",
    projectCount: 24,
    freelancerCount: 65,
    skills: ["WordPress", "Headless CMS", "Sanity.io", "Strapi", "PHP", "SEO Optimization"]
  }
];

export const initialUsers: User[] = [
  // Super Admin
  {
    id: "usr-admin-1",
    username: "admin_sarah",
    name: "Sarah Croft",
    email: "sarah.croft@weblancer.internal",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    title: "Super Admin & Head of Trust & Safety",
    bio: "Chief platform administrator overseeing marketplace integrity, verification workflows, disputes mediation, and payment settlements.",
    hourlyRate: 0,
    rating: 5.0,
    reviewsCount: 180,
    completedProjects: 450,
    skills: ["Platform Governance", "Dispute Resolution", "Escrow Auditing", "Risk Management"],
    isVerified: true,
    location: "Bengaluru, India",
    languages: ["English", "Hindi"],
    joinedDate: "Jan 2024",
    availability: "Available"
  },
  // Clients
  {
    id: "usr-client-1",
    username: "alex_vance",
    name: "Alex Vance",
    email: "alex@apexventures.io",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    title: "Founder & Product Lead",
    bio: "Building next-gen fintech and e-commerce tools. Hiring seasoned engineers and designers for long-term contract engagements.",
    companyName: "Apex Ventures Tech",
    website: "https://apexventures.io",
    hourlyRate: 0,
    rating: 4.95,
    reviewsCount: 14,
    completedProjects: 8,
    skills: ["Product Strategy", "FinTech", "SaaS"],
    isVerified: true,
    location: "Mumbai, India",
    languages: ["English", "Hindi"],
    joinedDate: "Feb 2024",
    availability: "Available",
    walletBalance: 245000,
    escrowBalance: 45000
  },
  {
    id: "usr-client-2",
    username: "rohit_mehta",
    name: "Rohit Mehta",
    email: "rohit@zenithhealth.in",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    title: "VP of Engineering at Zenith Health",
    bio: "Scaling digital healthcare teleconsultation platforms across South Asia. We value clean code, strong security, and punctual milestones.",
    companyName: "Zenith Health AI",
    website: "https://zenithhealth.in",
    hourlyRate: 0,
    rating: 4.88,
    reviewsCount: 9,
    completedProjects: 6,
    skills: ["Healthcare Tech", "Mobile Health", "HIPAA/Consent"],
    isVerified: true,
    location: "Hyderabad, India",
    languages: ["English", "Telugu", "Hindi"],
    joinedDate: "May 2024",
    availability: "Available",
    walletBalance: 180000,
    escrowBalance: 25000
  },
  // Freelancers
  {
    id: "usr-free-1",
    username: "sophia_chen",
    name: "Sophia Chen",
    email: "sophia.chen@devmail.com",
    role: "freelancer",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    title: "Staff Full-Stack React & Node.js Architect",
    bio: "8+ years crafting high-traffic web applications, SaaS dashboards, and modern component systems. Ex-Senior Architect with an obsession for clean architecture, TypeScript safety, and fast APIs.",
    hourlyRate: 2400,
    rating: 4.98,
    reviewsCount: 42,
    completedProjects: 38,
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Next.js", "Tailwind CSS", "Docker"],
    isVerified: true,
    location: "Bengaluru, India",
    languages: ["English", "Mandarin"],
    joinedDate: "Mar 2024",
    availability: "Available",
    earningsTotal: 840000,
    walletBalance: 68000
  },
  {
    id: "usr-free-2",
    username: "arjun_sharma",
    name: "Arjun Sharma",
    email: "arjun.mobile@devmail.com",
    role: "freelancer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    title: "Senior Cross-Platform Mobile Engineer (Flutter / React Native)",
    bio: "Specialized in delivering butter-smooth iOS and Android applications with 60fps animations, robust offline caching, and Razorpay in-app payment integration.",
    hourlyRate: 2100,
    rating: 4.92,
    reviewsCount: 31,
    completedProjects: 26,
    skills: ["Flutter", "React Native", "iOS Swift", "Android", "Firebase", "REST APIs", "Redux"],
    isVerified: true,
    location: "Pune, India",
    languages: ["English", "Hindi", "Marathi"],
    joinedDate: "Apr 2024",
    availability: "Available",
    earningsTotal: 620000,
    walletBalance: 42000
  },
  {
    id: "usr-free-3",
    username: "elena_rostova",
    name: "Elena Rostova",
    email: "elena.design@studiocraft.io",
    role: "freelancer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    title: "Principal UI/UX Product Designer & Design Systems Lead",
    bio: "Translating complex functional workflows into effortless, visually arresting user interfaces. Creator of design systems used by 50k+ developers. Figma power user.",
    hourlyRate: 2800,
    rating: 5.0,
    reviewsCount: 29,
    completedProjects: 25,
    skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research", "Wireframing"],
    isVerified: true,
    location: "New Delhi, India",
    languages: ["English", "Russian"],
    joinedDate: "Jan 2024",
    availability: "Part-time",
    earningsTotal: 710000,
    walletBalance: 55000
  },
  {
    id: "usr-free-4",
    username: "vikram_nair",
    name: "Vikram Nair",
    email: "vikram.nair@backendlab.in",
    role: "freelancer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
    title: "Cloud Backend & Database Performance Engineer",
    bio: "Designing resilient microservices in Go, Python, and Node.js. PostgreSQL optimization, query profiling, distributed caching, and zero-downtime database migrations.",
    hourlyRate: 2600,
    rating: 4.89,
    reviewsCount: 19,
    completedProjects: 17,
    skills: ["PostgreSQL", "Python", "FastAPI", "Go", "Docker", "Redis", "Kafka", "AWS"],
    isVerified: true,
    location: "Chennai, India",
    languages: ["English", "Tamil", "Hindi"],
    joinedDate: "Jun 2024",
    availability: "Available",
    earningsTotal: 490000,
    walletBalance: 31000
  },
  {
    id: "usr-free-5",
    username: "priya_deshmukh",
    name: "Priya Deshmukh",
    email: "priya.frontend@craftweb.in",
    role: "freelancer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    title: "Creative Frontend Engineer & Animation Specialist",
    bio: "Bridging the gap between design and high-performance code. Motion physics, Three.js 3D web experiences, dynamic data visualizers, and responsive layout polish.",
    hourlyRate: 1900,
    rating: 4.95,
    reviewsCount: 22,
    completedProjects: 20,
    skills: ["React", "Tailwind CSS", "Motion", "Three.js", "TypeScript", "Next.js", "Web Performance"],
    isVerified: true,
    location: "Goa, India",
    languages: ["English", "Hindi"],
    joinedDate: "Feb 2024",
    availability: "Available",
    earningsTotal: 380000,
    walletBalance: 24000
  }
];

export const initialPortfolios: PortfolioItem[] = [
  {
    id: "port-1",
    userId: "usr-free-1",
    title: "NovaFlow - Real-Time Collaborative Project Management SaaS",
    description: "Built an enterprise Kanban and sprint planning suite supporting real-time collaborative state, optimistic UI mutations, drag-drop timelines, and role-based permissions.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "WebSockets"],
    liveUrl: "https://example.com/novaflow",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    ],
    completedAt: "Dec 2025"
  },
  {
    id: "port-2",
    userId: "usr-free-1",
    title: "AuraPay - Multi-Currency Merchant Checkout Engine",
    description: "Designed and implemented an ultra-low-latency payment portal integrating Razorpay, webhooks reconciliation, and automated invoice PDF generation.",
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800",
    technologies: ["Next.js", "Razorpay SDK", "Express", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://example.com/aurapay",
    completedAt: "Nov 2025"
  },
  {
    id: "port-3",
    userId: "usr-free-2",
    title: "PulseHealth - Patient Consultation & Vitals Mobile App",
    description: "Production iOS and Android telemedicine app with instant video consultations, prescription vault, biometric login, and Bluetooth smart-band integration.",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    technologies: ["Flutter", "Dart", "Firebase", "WebRTC", "Node.js"],
    liveUrl: "https://example.com/pulsehealth",
    completedAt: "Jan 2026"
  },
  {
    id: "port-4",
    userId: "usr-free-3",
    title: "OmniStore - Luxury Apparel Design System & E-Commerce Flow",
    description: "End-to-end design from research to 140+ component design tokens in Figma, high-fidelity micro-interactions, mobile cart slide-over, and checkout usability audit.",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    technologies: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Usability Testing"],
    liveUrl: "https://figma.com/@elena_omni",
    completedAt: "Jan 2026"
  }
];

export const initialProjects: Project[] = [
  // 1. Active In-Progress Project with Workspace & Milestones
  {
    id: "proj-101",
    title: "Next.js SaaS Analytics Dashboard & Razorpay Subscription Flow",
    category: "Web Application Development",
    projectType: "fixed",
    description: "We are building an analytics platform for DTC brands to track customer retention, attribution, and LTV. We need a staff full-stack engineer to build the frontend dashboard and integrate Razorpay recurring subscriptions with automated invoices.",
    requiredFeatures: [
      "Dynamic interactive metric charts and cohort retention tables",
      "Razorpay checkout integration for Monthly/Annual subscription plans",
      "Role-based organization team management and audit trails",
      "Secure webhook listener with idempotent payment reconciliation",
      "Dark/Light theme toggle with accessible contrast"
    ],
    requiredSkills: ["React", "TypeScript", "Node.js", "Razorpay", "Tailwind CSS", "PostgreSQL"],
    budgetMin: 60000,
    budgetMax: 90000,
    isNegotiable: true,
    expectedTimeline: "4-5 Weeks",
    status: "in_progress",
    clientId: "usr-client-1",
    clientName: "Alex Vance",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    clientCompany: "Apex Ventures Tech",
    clientRating: 4.95,
    clientProjectsPosted: 8,
    clientLocation: "Mumbai, India",
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-08-25T14:30:00Z",
    attachments: [
      {
        id: "att-1",
        name: "Apex_Analytics_Wireframes_v2.pdf",
        size: "3.4 MB",
        url: "#",
        type: "application/pdf",
        uploadedAt: "2026-08-10"
      },
      {
        id: "att-2",
        name: "Subscription_Tiers_Spec.docx",
        size: "820 KB",
        url: "#",
        type: "application/docx",
        uploadedAt: "2026-08-10"
      }
    ],
    proposalsCount: 6,
    hiredFreelancerId: "usr-free-1",
    hiredFreelancerName: "Sophia Chen",
    hiredFreelancerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    agreedPrice: 75000,
    contractCreatedAt: "2026-08-15T09:00:00Z"
  },
  // 2. Open Project for Bidding
  {
    id: "proj-102",
    title: "Healthcare Teleconsultation Cross-Platform Mobile App (Flutter)",
    category: "Mobile App Development",
    projectType: "fixed",
    description: "Looking for an experienced mobile engineer to develop a patient-doctor consultation app. Features include appointment booking, encrypted chat, Razorpay consultation fee payments, and automated prescription downloads.",
    requiredFeatures: [
      "Doctor directory with availability calendar booking",
      "In-app Razorpay payment checkout before consultation slot confirmation",
      "Real-time text chat with audio/image attachment support",
      "Push notifications for appointment reminders and doctor arrivals",
      "Biometric PIN/Fingerprint login authentication"
    ],
    requiredSkills: ["Flutter", "Dart", "Firebase", "Razorpay", "REST APIs"],
    budgetMin: 80000,
    budgetMax: 120000,
    isNegotiable: true,
    expectedTimeline: "6-8 Weeks",
    status: "open",
    clientId: "usr-client-2",
    clientName: "Rohit Mehta",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    clientCompany: "Zenith Health AI",
    clientRating: 4.88,
    clientProjectsPosted: 6,
    clientLocation: "Hyderabad, India",
    createdAt: "2026-08-20T11:00:00Z",
    updatedAt: "2026-08-26T18:00:00Z",
    attachments: [
      {
        id: "att-3",
        name: "Zenith_App_UserStories.pdf",
        size: "2.1 MB",
        url: "#",
        type: "application/pdf",
        uploadedAt: "2026-08-20"
      }
    ],
    proposalsCount: 4
  },
  // 3. Project in Hiring Review stage
  {
    id: "proj-103",
    title: "E-Commerce Luxury Watch Marketplace UI/UX Redesign in Figma",
    category: "UI/UX Design",
    projectType: "fixed",
    description: "Complete design overhaul for an online luxury horology marketplace. We need desktop & mobile wireframes, high-fidelity prototypes, micro-animations, and a comprehensive Figma design system with components and auto-layout.",
    requiredFeatures: [
      "Interactive 3D product view layout and high-res gallery",
      "Faceted filter sidebar for movements, case size, and brand heritage",
      "Frictionless 3-step checkout UX with payment method selection",
      "Design tokens documentation for engineering handoff"
    ],
    requiredSkills: ["Figma", "UI/UX Design", "Design Systems", "E-commerce UX", "Prototyping"],
    budgetMin: 45000,
    budgetMax: 65000,
    isNegotiable: false,
    expectedTimeline: "3 Weeks",
    status: "hiring",
    clientId: "usr-client-1",
    clientName: "Alex Vance",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    clientCompany: "Apex Ventures Tech",
    clientRating: 4.95,
    clientProjectsPosted: 8,
    clientLocation: "Mumbai, India",
    createdAt: "2026-08-22T08:30:00Z",
    updatedAt: "2026-08-26T12:00:00Z",
    attachments: [],
    proposalsCount: 5
  },
  // 4. Completed Project with Reviews
  {
    id: "proj-104",
    title: "High-Performance Corporate Website with Headless CMS & Tailwind",
    category: "Website Development",
    projectType: "fixed",
    description: "Created a lightning-fast marketing website with dynamic blog, case study showcases, SEO optimization, and 99+ Google Lighthouse score across mobile and desktop.",
    requiredFeatures: [
      "Custom responsive components with subtle entrance animations",
      "Headless CMS integration for easy marketing content publishing",
      "Structured SEO Schema metadata and automated sitemap generation"
    ],
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "SEO", "Vite"],
    budgetMin: 35000,
    budgetMax: 45000,
    isNegotiable: false,
    expectedTimeline: "2 Weeks",
    status: "completed",
    clientId: "usr-client-2",
    clientName: "Rohit Mehta",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    clientCompany: "Zenith Health AI",
    clientRating: 4.88,
    clientProjectsPosted: 6,
    clientLocation: "Hyderabad, India",
    createdAt: "2026-07-01T09:00:00Z",
    updatedAt: "2026-07-20T16:00:00Z",
    attachments: [],
    proposalsCount: 8,
    hiredFreelancerId: "usr-free-1",
    hiredFreelancerName: "Sophia Chen",
    hiredFreelancerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    agreedPrice: 40000,
    contractCreatedAt: "2026-07-03T10:00:00Z",
    contractCompletedAt: "2026-07-18T18:00:00Z"
  }
];

export const initialProposals: Proposal[] = [
  {
    id: "prop-201",
    projectId: "proj-101",
    projectTitle: "Next.js SaaS Analytics Dashboard & Razorpay Subscription Flow",
    freelancerId: "usr-free-1",
    freelancerName: "Sophia Chen",
    freelancerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    freelancerTitle: "Staff Full-Stack React & Node.js Architect",
    freelancerRating: 4.98,
    freelancerReviewsCount: 42,
    proposedAmount: 75000,
    estimatedDays: 28,
    coverLetter: "Hi Alex,\n\nI have extensive experience building scalable SaaS dashboards and deeply integrating Razorpay recurring subscription engines. In my previous project AuraPay, I implemented idempotent webhook reconciliation and automated PDF invoice generation.\n\nMy proposed execution plan:\n1. Architecture, schema, and UI component system (Week 1)\n2. Interactive analytics views & charts (Week 2)\n3. Razorpay integration & webhook listener (Week 3)\n4. Rigorous QA, load testing, and production deployment (Week 4)\n\nLooking forward to collaborating with Apex Ventures!",
    relevantPortfolioIds: ["port-1", "port-2"],
    status: "accepted",
    createdAt: "2026-08-12T14:20:00Z",
    winScore: 96,
    highlights: ["Proven Razorpay integration track record", "Staff-level TypeScript modular architecture", "Active communication guarantee"]
  },
  {
    id: "prop-202",
    projectId: "proj-102",
    projectTitle: "Healthcare Teleconsultation Cross-Platform Mobile App (Flutter)",
    freelancerId: "usr-free-2",
    freelancerName: "Arjun Sharma",
    freelancerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    freelancerTitle: "Senior Cross-Platform Mobile Engineer",
    freelancerRating: 4.92,
    freelancerReviewsCount: 31,
    proposedAmount: 95000,
    estimatedDays: 45,
    coverLetter: "Hello Rohit,\n\nI recently completed PulseHealth, a comprehensive telemedicine mobile application featuring encrypted doctor chat and Razorpay integration. I understand the compliance and security nuances required for healthcare platforms.\n\nI will deliver a clean Flutter codebase with 100% native performance on iOS & Android.",
    relevantPortfolioIds: ["port-3"],
    status: "shortlisted",
    createdAt: "2026-08-21T09:15:00Z",
    winScore: 94,
    highlights: ["Direct domain experience in Telemedicine", "Flutter native performance expertise", "Razorpay in-app SDK familiarity"]
  },
  {
    id: "prop-203",
    projectId: "proj-103",
    projectTitle: "E-Commerce Luxury Watch Marketplace UI/UX Redesign in Figma",
    freelancerId: "usr-free-3",
    freelancerName: "Elena Rostova",
    freelancerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    freelancerTitle: "Principal UI/UX Product Designer",
    freelancerRating: 5.0,
    freelancerReviewsCount: 29,
    proposedAmount: 55000,
    estimatedDays: 20,
    coverLetter: "Hi Alex,\n\nLuxury commerce demands unmatched typographic refinement, generous white space, and frictionless conversion psychology. Having crafted OmniStore's high-end e-commerce flow, I will build an immaculate Figma design system complete with auto-layout v5 components, interactive micro-states, and token variables.",
    relevantPortfolioIds: ["port-4"],
    status: "submitted",
    createdAt: "2026-08-23T11:45:00Z",
    winScore: 98,
    highlights: ["Luxury e-commerce domain authority", "Comprehensive Figma tokens & developer spec", "5.0 rating across all projects"]
  }
];

export const initialMilestones: Milestone[] = [
  {
    id: "ms-301",
    projectId: "proj-101",
    title: "Milestone 1: Database Models, Authentication & Wireframe Layout",
    description: "Deliver complete TypeScript data schemas, user authentication with role guards, and responsive dashboard shell components.",
    amount: 25000,
    dueDate: "2026-08-22",
    deliverables: "Git repository access, schema migrations, working auth flow, responsive sidebar layout",
    status: "approved",
    orderNumber: 1,
    fundedAt: "2026-08-15T10:00:00Z",
    submittedAt: "2026-08-21T16:00:00Z",
    submissionNote: "Milestone 1 completed. All database schemas, JWT token handlers, and responsive sidebar navigation are merged to main branch.",
    revisionCount: 0,
    approvedAt: "2026-08-22T11:30:00Z",
    paymentId: "pay_APEX_MS1_9921"
  },
  {
    id: "ms-302",
    projectId: "proj-101",
    title: "Milestone 2: Analytics Charts, Metrics Aggregation & Filters",
    description: "Implement interactive retention curves, MRR breakdown charts, cohort tables, and date range filters with real-time recalculation.",
    amount: 25000,
    dueDate: "2026-08-29",
    deliverables: "Interactive analytics UI, optimized SQL queries, export to CSV/JSON affordance",
    status: "submitted",
    orderNumber: 2,
    fundedAt: "2026-08-22T12:00:00Z",
    submittedAt: "2026-08-26T17:30:00Z",
    submissionNote: "Milestone 2 ready for review! Built cohort retention matrix and MRR charts using Recharts with 60fps animations. Deployed to staging URL.",
    submissionFiles: [
      {
        id: "sub-1",
        name: "Analytics_Module_Demo_Walkthrough.mp4",
        size: "14.2 MB",
        url: "#",
        type: "video/mp4",
        uploadedAt: "2026-08-26"
      }
    ],
    revisionCount: 0,
    paymentId: "pay_APEX_MS2_8812"
  },
  {
    id: "ms-303",
    projectId: "proj-101",
    title: "Milestone 3: Razorpay Recurring Billing, Invoicing & Final Handover",
    description: "Complete Razorpay subscription checkout flow, webhook signature validation, PDF invoice download, and production deployment handoff.",
    amount: 25000,
    dueDate: "2026-09-08",
    deliverables: "Razorpay webhooks listener, subscription management portal, documentation, prod deployment",
    status: "awaiting_payment",
    orderNumber: 3,
    revisionCount: 0
  }
];

export const initialMessages: ProjectMessage[] = [
  {
    id: "msg-401",
    projectId: "proj-101",
    senderId: "usr-client-1",
    senderName: "Alex Vance",
    senderRole: "client",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    content: "Hi Sophia! Excited to kick off this project with you. I have funded Milestone 1 and uploaded the updated Figma spec in the files tab.",
    timestamp: "2026-08-15T10:05:00Z",
    isRead: true
  },
  {
    id: "msg-402",
    projectId: "proj-101",
    senderId: "usr-free-1",
    senderName: "Sophia Chen",
    senderRole: "freelancer",
    senderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    content: "Thanks Alex! Got the specs. I have set up the project repository with TypeScript, Tailwind, and Express backend. Will share the staging link by Friday.",
    timestamp: "2026-08-15T10:15:00Z",
    isRead: true
  },
  {
    id: "msg-403",
    projectId: "proj-101",
    senderId: "usr-free-1",
    senderName: "Sophia Chen",
    senderRole: "freelancer",
    senderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    content: "Hey Alex, Milestone 2 has been submitted for your review. You can test the interactive cohort matrix and MRR charts live on the staging build. Looking forward to your feedback!",
    timestamp: "2026-08-26T17:35:00Z",
    isRead: false
  }
];

export const initialProjectFiles: ProjectFile[] = [
  {
    id: "file-501",
    projectId: "proj-101",
    name: "Apex_Analytics_Design_Spec_v3.pdf",
    size: "4.2 MB",
    type: "application/pdf",
    category: "client_reference",
    uploadedById: "usr-client-1",
    uploadedByName: "Alex Vance",
    uploadedAt: "2026-08-15",
    url: "#"
  },
  {
    id: "file-502",
    projectId: "proj-101",
    name: "Database_ERD_Architecture.png",
    size: "1.8 MB",
    type: "image/png",
    category: "freelancer_work",
    uploadedById: "usr-free-1",
    uploadedByName: "Sophia Chen",
    uploadedAt: "2026-08-18",
    url: "#"
  },
  {
    id: "file-503",
    projectId: "proj-101",
    name: "Staging_Build_Deployment_Notes.md",
    size: "45 KB",
    type: "text/markdown",
    category: "freelancer_work",
    uploadedById: "usr-free-1",
    uploadedByName: "Sophia Chen",
    uploadedAt: "2026-08-26",
    url: "#"
  }
];

export const initialReviews: Review[] = [
  {
    id: "rev-601",
    projectId: "proj-104",
    projectTitle: "High-Performance Corporate Website with Headless CMS & Tailwind",
    reviewerId: "usr-client-2",
    reviewerName: "Rohit Mehta",
    reviewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    reviewerRole: "client",
    targetUserId: "usr-free-1",
    targetUserName: "Sophia Chen",
    rating: 5.0,
    communicationRating: 5.0,
    qualityRating: 5.0,
    deliveryRating: 5.0,
    comment: "Sophia delivered a phenomenal corporate website well ahead of our launch deadline. Her code is pristine, modular, and our Lighthouse performance score is 99. Top-tier engineering talent!",
    createdAt: "2026-07-19T10:00:00Z"
  },
  {
    id: "rev-602",
    projectId: "proj-104",
    projectTitle: "High-Performance Corporate Website with Headless CMS & Tailwind",
    reviewerId: "usr-free-1",
    reviewerName: "Sophia Chen",
    reviewerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    reviewerRole: "freelancer",
    targetUserId: "usr-client-2",
    targetUserName: "Rohit Mehta",
    rating: 5.0,
    communicationRating: 5.0,
    qualityRating: 5.0,
    deliveryRating: 5.0,
    comment: "Working with Rohit was an absolute pleasure. Crystal clear specifications, immediate feedback on staging previews, and prompt milestone releases.",
    createdAt: "2026-07-19T11:15:00Z"
  }
];

export const initialDisputes: Dispute[] = [
  {
    id: "disp-701",
    projectId: "proj-101",
    projectTitle: "Next.js SaaS Analytics Dashboard & Razorpay Subscription Flow",
    milestoneId: "ms-302",
    milestoneTitle: "Milestone 2: Analytics Charts, Metrics Aggregation & Filters",
    contractAmount: 25000,
    initiatorId: "usr-client-1",
    initiatorName: "Alex Vance",
    initiatorRole: "client",
    respondentId: "usr-free-1",
    respondentName: "Sophia Chen",
    reason: "Scope Alignment & Additional Chart Variants",
    description: "The current build contains 3 chart types, but we requested 2 additional breakdown filters for cohort churn rate. Requesting mediation to adjust scope or timeline before final release.",
    evidenceFiles: [
      {
        id: "ev-1",
        name: "Scope_Difference_Log.pdf",
        size: "1.1 MB",
        url: "#",
        type: "application/pdf",
        uploadedAt: "2026-08-26"
      }
    ],
    status: "under_review",
    createdAt: "2026-08-26T19:00:00Z",
    adminNotes: "Mediation initialized. Reviewing milestone deliverables against original project brief."
  }
];

export const initialPayments: PaymentTransaction[] = [
  {
    id: "tx-801",
    paymentId: "pay_APEX_MS1_9921",
    orderId: "order_6641ab9921e1",
    projectId: "proj-101",
    projectTitle: "Next.js SaaS Analytics Dashboard & Razorpay Subscription Flow",
    milestoneId: "ms-301",
    milestoneTitle: "Milestone 1: Database Models, Authentication & Wireframe Layout",
    clientId: "usr-client-1",
    clientName: "Alex Vance",
    freelancerId: "usr-free-1",
    freelancerName: "Sophia Chen",
    amount: 25000,
    fee: 2500, // 10% platform commission
    netAmount: 22500,
    currency: "INR",
    status: "captured",
    method: "Razorpay (UPI / NetBanking)",
    createdAt: "2026-08-15T10:00:00Z",
    auditHash: "9a7f3c42810e4a77e1bbcd882"
  },
  {
    id: "tx-802",
    paymentId: "pay_APEX_MS2_8812",
    orderId: "order_7718cc8812d4",
    projectId: "proj-101",
    projectTitle: "Next.js SaaS Analytics Dashboard & Razorpay Subscription Flow",
    milestoneId: "ms-302",
    milestoneTitle: "Milestone 2: Analytics Charts, Metrics Aggregation & Filters",
    clientId: "usr-client-1",
    clientName: "Alex Vance",
    freelancerId: "usr-free-1",
    freelancerName: "Sophia Chen",
    amount: 25000,
    fee: 2500,
    netAmount: 22500,
    currency: "INR",
    status: "captured",
    method: "Razorpay (Corporate Cards)",
    createdAt: "2026-08-22T12:00:00Z",
    auditHash: "44b82ca17ff88902eead0192b"
  }
];

export const initialSettlements: Settlement[] = [
  {
    id: "stl-901",
    freelancerId: "usr-free-1",
    freelancerName: "Sophia Chen",
    amount: 25000,
    platformCommission: 2500,
    tdsDeduction: 250, // 1% TDS
    netPayout: 22250,
    status: "settled",
    bankAccountMasked: "HDFC Bank (•••• 4912)",
    initiatedAt: "2026-08-23T10:00:00Z",
    completedAt: "2026-08-24T15:30:00Z",
    milestoneTitle: "Milestone 1: Database Models, Authentication & Wireframe Layout",
    projectTitle: "Next.js SaaS Analytics Dashboard & Razorpay Subscription Flow"
  },
  {
    id: "stl-902",
    freelancerId: "usr-free-1",
    freelancerName: "Sophia Chen",
    amount: 25000,
    platformCommission: 2500,
    tdsDeduction: 250,
    netPayout: 22250,
    status: "eligible_for_settlement",
    bankAccountMasked: "HDFC Bank (•••• 4912)",
    initiatedAt: "2026-08-26T18:00:00Z",
    milestoneTitle: "Milestone 2: Analytics Charts, Metrics Aggregation & Filters",
    projectTitle: "Next.js SaaS Analytics Dashboard & Razorpay Subscription Flow"
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: "notif-1",
    userId: "usr-client-1",
    title: "Milestone 2 Submitted",
    message: "Sophia Chen submitted work for 'Milestone 2: Analytics Charts, Metrics Aggregation & Filters'.",
    type: "milestone",
    read: false,
    createdAt: "2026-08-26T17:30:00Z",
    link: "workspace/proj-101"
  },
  {
    id: "notif-2",
    userId: "usr-free-1",
    title: "Milestone 1 Payment Settled",
    message: "₹22,250 net payout for Milestone 1 has been settled to your verified HDFC Bank account.",
    type: "payment",
    read: true,
    createdAt: "2026-08-24T15:30:00Z",
    link: "freelancer/earnings"
  },
  {
    id: "notif-3",
    userId: "usr-admin-1",
    title: "New Dispute Opened",
    message: "Alex Vance requested mediation for project 'Next.js SaaS Analytics Dashboard'.",
    type: "dispute",
    read: false,
    createdAt: "2026-08-26T19:05:00Z",
    link: "admin/disputes"
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    userId: "usr-client-1",
    userName: "Alex Vance",
    userRole: "client",
    action: "RAZORPAY_PAYMENT_CAPTURED",
    resource: "Milestone: ms-302",
    details: "Funded ₹25,000 via Razorpay Order order_7718cc8812d4. Escrow locked.",
    ip: "103.21.14.88",
    timestamp: "2026-08-22T12:00:00Z"
  },
  {
    id: "log-2",
    userId: "usr-free-1",
    userName: "Sophia Chen",
    userRole: "freelancer",
    action: "WORK_SUBMISSION_UPLOADED",
    resource: "Milestone: ms-302",
    details: "Uploaded Analytics_Module_Demo_Walkthrough.mp4 (14.2MB)",
    ip: "49.207.211.5",
    timestamp: "2026-08-26T17:30:00Z"
  },
  {
    id: "log-3",
    userId: "usr-admin-1",
    userName: "Sarah Croft",
    userRole: "admin",
    action: "PLATFORM_COMMISSION_POLICY_AUDIT",
    resource: "Platform Commission: 10%",
    details: "Verified compliance with standard Razorpay marketplace settlement guidelines.",
    ip: "14.139.12.1",
    timestamp: "2026-08-26T08:00:00Z"
  }
];
