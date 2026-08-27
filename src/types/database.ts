import {
  UserRole,
  ProjectStatus,
  ProposalStatus,
  MilestoneStatus,
  DisputeStatus,
  SettlementStatus
} from "../types";

/**
 * Firestore Database Entities & Interfaces
 * Represents the persistent schema stored across Firestore collections.
 */

// Collection: "users"
export interface UserDocument {
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
  createdAt?: string;
  updatedAt?: string;
}

// Collection: "projects"
export interface ProjectDocument {
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
  attachments?: string[];
  proposalsCount: number;
  hiredFreelancerId?: string;
  hiredFreelancerName?: string;
  hiredFreelancerAvatar?: string;
  agreedPrice?: number;
  contractCreatedAt?: string;
  contractCompletedAt?: string;
}

// Collection: "proposals"
export interface ProposalDocument {
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
  relevantPortfolioIds?: string[];
  status: ProposalStatus;
  createdAt: string;
  winScore?: number;
  highlights?: string[];
}

// Collection: "milestones"
export interface MilestoneDocument {
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
  approvedAt?: string;
  revisionCount: number;
  submissionNote?: string;
  submissionFiles?: { name: string; url: string; size: string }[];
  revisionNotes?: string[];
  paymentId?: string;
}

// Collection: "messages"
export interface MessageDocument {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  attachments?: { name: string; url: string; type: string; size: string }[];
  timestamp: string;
  isRead: boolean;
}

// Collection: "projectFiles"
export interface ProjectFileDocument {
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

// Collection: "reviews"
export interface ReviewDocument {
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
  communicationRating?: number;
  qualityRating?: number;
  deliveryRating?: number;
  comment: string;
  createdAt: string;
}

// Collection: "disputes"
export interface DisputeDocument {
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
  evidenceFiles?: string[];
  status: DisputeStatus;
  createdAt: string;
  resolvedAt?: string;
  arbitrationNotes?: string;
  adminDecision?: "refund_client" | "release_freelancer" | "split_50_50";
}

// Collection: "payments"
export interface PaymentTransactionDocument {
  id: string;
  paymentId: string;
  orderId: string;
  projectId: string;
  projectTitle: string;
  milestoneId: string;
  milestoneTitle?: string;
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
  auditHash?: string;
}

// Collection: "settlements"
export interface SettlementDocument {
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
  settledAt?: string;
  milestoneTitle?: string;
  projectTitle?: string;
}

// Collection: "notifications"
export interface NotificationDocument {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "proposal" | "milestone" | "payment" | "message" | "dispute" | "hiring" | "system";
  read: boolean;
  createdAt: string;
  link?: string;
}

// Collection: "portfolios"
export interface PortfolioItemDocument {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage: string;
  technologies: string[];
  liveUrl?: string;
  completedAt: string;
}

/**
 * Firestore Collection Names Constants
 */
export const FIRESTORE_COLLECTIONS = {
  USERS: "users",
  PROJECTS: "projects",
  PROPOSALS: "proposals",
  MILESTONES: "milestones",
  MESSAGES: "messages",
  PROJECT_FILES: "projectFiles",
  REVIEWS: "reviews",
  DISPUTES: "disputes",
  PAYMENTS: "payments",
  SETTLEMENTS: "settlements",
  NOTIFICATIONS: "notifications",
  PORTFOLIOS: "portfolios",
  CATEGORIES: "categories",
} as const;
