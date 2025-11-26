export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium'
}

export enum FileFormat {
  PDF = 'pdf',
  DOCX = 'docx'
}

export enum Platform {
  CHATGPT = 'chatgpt',
  CLAUDE = 'claude',
  GROK = 'grok',
  UNKNOWN = 'unknown'
}

export enum ConversionStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface UserPreferences {
  defaultFormat: FileFormat;
  autoDelete: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string; // ISO timestamp
  subscription: SubscriptionTier;
  conversionCount: number;
  preferences: UserPreferences;
}

export interface ConversionMetadata {
  messageCount: number;
  wordCount: number;
  processingTime: number; // in milliseconds
}

export interface ConversionDocument {
  conversionId: string;
  userId: string;
  originalFilename: string;
  platform: Platform;
  status: ConversionStatus;
  inputFile: string; // storage path
  outputFiles?: {
    pdf?: string;
    docx?: string;
  };
  createdAt: string;
  completedAt?: string;
  metadata?: ConversionMetadata;
  error?: string;
}

// For UI state management
export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}