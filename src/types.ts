// Core type definitions for Reputation Hub

export type InputType = 'ipv4' | 'ipv6' | 'domain' | 'md5' | 'sha1' | 'sha256' | 'unknown';

export type ProviderName = 
  | 'virustotal' 
  | 'abuseipdb' 
  | 'otx' 
  | 'ipqs' 
  | 'greynoise' 
  | 'urlhaus' 
  | 'shodan' 
  | 'censys';

export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';
export type ReputationStatus = 'clean' | 'suspicious' | 'malicious' | 'unknown';

export interface ProviderCapability {
  ip: boolean;
  domain: boolean;
  hash: boolean;
  requiresKey: boolean;
  hashTypes?: ('md5' | 'sha1' | 'sha256')[];
  description: string;
  registrationUrl?: string;
  freeTier?: string;
}

export interface CheckRequest {
  target: string;
  type?: InputType;
  providers?: ProviderName[];
}

export interface BulkCheckRequest {
  targets: string[];
  providers?: ProviderName[];
}

export interface ProviderResult {
  provider: string;
  status: 'success' | 'error' | 'unsupported' | 'no_key';
  cached?: boolean;
  cachedAt?: string;
  expiresAt?: string;
  reputation?: ReputationStatus;
  score?: number;
  details?: any;
  url?: string;
  error?: string;
}

export interface CheckResponse {
  target: string;
  type: InputType;
  filtered: boolean;
  filterReason?: string;
  timestamp: string;
  results: Record<string, ProviderResult>;
  summary: {
    overallRisk: RiskLevel;
    flaggedBy: number;
    totalProviders: number;
    recommendations: string;
  };
}

export interface BulkCheckResponse {
  totalTargets: number;
  processed: number;
  filtered: number;
  timestamp: string;
  results: CheckResponse[];
}

export interface AnalyticsData {
  totalQueries: number;
  queriesByType: Record<InputType, number>;
  queriesByProvider: Record<ProviderName, number>;
  cacheHitRatio: number;
  topQueriedTargets: Array<{ target: string; count: number; type: InputType }>;
  lastUpdated: string;
}

export interface ThreatIntelProvider {
  name: string;
  supports: {
    ip: boolean;
    domain: boolean;
    hash: boolean;
    hashTypes?: string[];
  };
  requiresKey: boolean;
  
  checkIP?(ip: string, apiKey: string): Promise<ProviderResult>;
  checkDomain?(domain: string, apiKey: string): Promise<ProviderResult>;
  checkHash?(hash: string, hashType: string, apiKey: string): Promise<ProviderResult>;
}

export interface Env {
  CACHE: KVNamespace;
  ANALYTICS: KVNamespace;
  CACHE_TTL: string;
  ENVIRONMENT: string;
  VERSION: string;
}
