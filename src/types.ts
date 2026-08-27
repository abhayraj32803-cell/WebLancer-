export type UserRole = "guest" | "client" | "freelancer" | "admin";

export type ProjectStatus =
  | "draft"
  | "pending_review"
  | "open"
  | "hiring"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "closed";

export type ProposalStatus =
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "interviewing"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "expired";

export type MilestoneStatus =
  | "draft"
  | "awaiting_payment"
  | "payment_processing"
  | "funded"
  | "in_progress"
  | "submitted"
  | "revision_requested"
  | "approved"
  | "settlement_pending"
  | "settled"
  | "cancelled"
  | "disputed"
  | "refunded";

export type DisputeStatus =
  | "open"
  | "under_review"
  | "awaiting_information"
  | "resolved"
  | "closed";

export type SettlementStatus =
  | "pending"
  | "eligible_for_settlement"
  | "processing"
  | "settled"
  | "failed"
  | "on_hold"
  | "disputed";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  skills: string[];
  isVerified: boolean;
  location: string;
  languages: string[];
  joinedDate: string;
  availability: "Available" | "Part-time" | "Busy";
  companyName?: string;
  website?: string;
  earningsTotal?: number;
  walletBalance?: number;
  escrowBalance?: number;
  isSuspended?: boolean;
}

export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage: string;
  technologies: string[];
  liveUrl?: string;
  gallery?: string[];
  completedAt: string;
}

export interface ProjectAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  projectType: "fixed" | "hourly";
  description: string;
  requiredFeatures: string[];
  requiredSkills: string[];
  budgetMin: number;
  budgetMax: number;
  isNegotiable: boolean;
  expectedTimeline: string;
  preferredCompletionDate?: string;
  status: ProjectStatus;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientCompany?: string;
  clientRating: number;
  clientProjectsPosted: number;
  clientLocation: string;
  createdAt: string;
  updatedAt: string;
  attachments: ProjectAttachment[];
  proposalsCount: number;
  hiredFreelancerId?: string;
  hiredFreelancerName?: string;
  hiredFreelancerAvatar?: string;
  agreedPrice?: number;
  contractCreatedAt?: string;
  contractCompletedAt?: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  projectTitle: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerTitle: string;
  freelancerRating: number;
  freelancerReviewsCount: number;
  proposedAmount: number;
  estimatedDays: number;
  coverLetter: string;
  relevantPortfolioIds: string[];
  status: ProposalStatus;
  createdAt: string;
  winScore?: number;
  highlights?: string[];
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  deliverables: string;
  status: MilestoneStatus;
  orderNumber: number;
  fundedAt?: string;
  submittedAt?: string;
  submissionNote?: string;
  submissionFiles?: ProjectAttachment[];
  revisionCount: number;
  revisionNotes?: string[];
  approvedAt?: string;
  paymentId?: string;
}

export interface ProjectMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  attachments?: ProjectAttachment[];
  timestamp: string;
  isRead: boolean;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: string;
  type: string;
  category: "client_reference" | "freelancer_work" | "final_delivery";
  uploadedById: string;
  uploadedByName: string;
  uploadedAt: string;
  url: string;
}

export interface Review {
  id: string;
  projectId: string;
  projectTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerRole: "client" | "freelancer";
  targetUserId: string;
  targetUserName: string;
  rating: number;
  communicationRating: number;
  qualityRating: number;
  deliveryRating: number;
  comment: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  projectId: string;
  projectTitle: string;
  milestoneId?: string;
  milestoneTitle?: string;
  contractAmount: number;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: "client" | "freelancer";
  respondentId: string;
  respondentName: string;
  reason: string;
  description: string;
  evidenceFiles: ProjectAttachment[];
  status: DisputeStatus;
  createdAt: string;
  adminNotes?: string;
  resolutionVerdict?: string;
  refundClientAmount?: number;
  payoutFreelancerAmount?: number;
  resolvedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  paymentId: string;
  orderId: string;
  projectId: string;
  projectTitle: string;
  milestoneId: string;
  milestoneTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  status: "created" | "captured" | "refunded" | "disputed";
  method: string;
  createdAt: string;
  auditHash: string;
}

export interface Settlement {
  id: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  platformCommission: number;
  tdsDeduction: number;
  netPayout: number;
  status: SettlementStatus;
  bankAccountMasked: string;
  initiatedAt: string;
  completedAt?: string;
  milestoneTitle: string;
  projectTitle: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "proposal" | "milestone" | "payment" | "message" | "hiring" | "dispute" | "system";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
  timestamp: string;
}

export interface PlatformCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  projectCount: number;
  freelancerCount: number;
  skills: string[];
}

export * from "./types/database";
