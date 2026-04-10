// src/types/index.ts

export type UserRole = "owner" | "admin" | "recruiter" | "viewer";

export type OrgPlan = "starter" | "professional" | "business" | "enterprise";

export type JobStatus = "draft" | "active" | "paused" | "closed";

export type SourcingStatus = "pending" | "running" | "complete" | "failed";

export type PipelineStage =
  | "sourced"
  | "shortlisted"
  | "contacted"
  | "interviewing"
  | "offered"
  | "hired"
  | "declined";

export type IntegrationType =
  | "google"
  | "microsoft"
  | "linkedin"
  | "ats_greenhouse"
  | "ats_lever"
  | "ats_ashby"
  | "ats_bullhorn"
  | "nylas"
  | "merge";

export type IntegrationStatus = "connected" | "disconnected" | "error";

export interface Organization {
  id: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  teamSize: "1-2" | "3-10" | "10+" | null;
  plan: OrgPlan;
  creditsRemaining: number;
  creditsLimit: number;
  stripeCustomerId: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  orgId: string | null;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  orgId: string;
  createdBy: string;
  title: string;
  description: string | null;
  location: string | null;
  remote: boolean;
  skills: string[];
  minYearsExp: number | null;
  maxYearsExp: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  industry: string | null;
  status: JobStatus;
  sourcingStatus: SourcingStatus;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  location: string;
  summary: string | null;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  graduationYear: number;
}

export interface FitCriterion {
  criterion: string;
  met: boolean;
  evidence: string;
}

export interface CandidateProfile {
  id: string;
  pdlId: string | null;
  fullName: string;
  headline: string | null;
  currentRole: string | null;
  currentCompany: string | null;
  location: string | null;
  linkedinUrl: string | null;
  email: string | null;
  emailRevealed: boolean;
  skills: string[];
  yearsExperience: number | null;
  workHistory: WorkExperience[];
  education: Education[];
  fitScore: number | null;
  fitCriteria: FitCriterion[];
  aiSummary: string | null;
  avatarInitials: string;
  avatarColor: string;
  source: "pdl" | "apollo" | "linkedin" | "manual";
}

export interface SourcingResult {
  id: string;
  jobId: string;
  orgId: string;
  candidateId: string;
  candidate: CandidateProfile;
  fitScore: number | null;
  stage: PipelineStage;
  recruiterNote: string | null;
  actionedAt: string | null;
  actionedBy: string | null;
  createdAt: string;
}

export interface Integration {
  id: string;
  orgId: string;
  type: IntegrationType;
  status: IntegrationStatus;
  connectedAt: string | null;
  meta: Record<string, unknown> | null;
}

export interface CreditUsageSummary {
  creditsRemaining: number;
  creditsLimit: number;
  creditsUsedThisMonth: number;
  videoScreensUsed: number;
  videoScreensLimit: number;
  plan: OrgPlan;
  renewalDate: string;
}

export interface DashboardStats {
  totalSourced: number;
  avgFitScore: number;
  totalShortlisted: number;
  creditsRemaining: number;
  activeSearches: number;
}

export interface PipelineColumn {
  stage: PipelineStage;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  results: SourcingResult[];
}
