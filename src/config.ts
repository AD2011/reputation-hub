import { ProviderName, ProviderCapability } from './types';

// Provider configuration and metadata
export const PROVIDERS: Record<ProviderName, ProviderCapability> = {
  virustotal: {
    ip: true,
    domain: true,
    hash: true,
    requiresKey: true,
    hashTypes: ['md5', 'sha1', 'sha256'],
    description: 'Multi-engine malware scanner with 70+ antivirus engines',
    registrationUrl: 'https://www.virustotal.com/gui/join-us',
    freeTier: '500 requests/day'
  },
  abuseipdb: {
    ip: true,
    domain: false,
    hash: false,
    requiresKey: true,
    description: 'Community-driven IP abuse reports database',
    registrationUrl: 'https://www.abuseipdb.com/api',
    freeTier: '1000 requests/day'
  },
  otx: {
    ip: true,
    domain: true,
    hash: true,
    requiresKey: true,
    hashTypes: ['md5', 'sha1', 'sha256'],
    description: 'AlienVault Open Threat Exchange community threat intelligence',
    registrationUrl: 'https://otx.alienvault.com/api',
    freeTier: 'Unlimited'
  },
  ipqs: {
    ip: true,
    domain: true,
    hash: false,
    requiresKey: true,
    description: 'IP Quality Score - Fraud detection and proxy/VPN detection',
    registrationUrl: 'https://www.ipqualityscore.com/create-account',
    freeTier: '5000 requests/month'
  },
  greynoise: {
    ip: true,
    domain: false,
    hash: false,
    requiresKey: true,
    description: 'Internet scanner classification - distinguish noise from threats',
    registrationUrl: 'https://www.greynoise.io/viz/account/api-key',
    freeTier: 'Community API'
  },
  urlhaus: {
    ip: false,
    domain: true,
    hash: true,
    requiresKey: true,
    hashTypes: ['md5', 'sha256'],
    description: 'Abuse.ch URLhaus - Malware URL and payload database',
    registrationUrl: 'https://urlhaus.abuse.ch/api/',
    freeTier: 'Standard (requires free API key)'
  },
  malwarebazaar: {
    ip: false,
    domain: false,
    hash: true,
    requiresKey: true,
    hashTypes: ['md5', 'sha1', 'sha256'],
    description: 'Abuse.ch MalwareBazaar - Malware sample database',
    registrationUrl: 'https://bazaar.abuse.ch/api/',
    freeTier: 'Standard (requires free API key)'
  },
  threatfox: {
    ip: true,
    domain: true,
    hash: true,
    requiresKey: true,
    hashTypes: ['md5', 'sha1', 'sha256'],
    description: 'Abuse.ch ThreatFox - Indicator of Compromise (IOC) database',
    registrationUrl: 'https://threatfox.abuse.ch/api/',
    freeTier: 'Standard (requires free API key)'
  },
  shodan: {
    ip: true,
    domain: true,
    hash: false,
    requiresKey: true,
    description: 'Internet-wide port scanning and device information',
    registrationUrl: 'https://account.shodan.io/register',
    freeTier: 'Limited (1 query/sec)'
  },
  censys: {
    ip: true,
    domain: true,
    hash: false,
    requiresKey: true,
    description: 'Internet-wide scanning and certificate search',
    registrationUrl: 'https://search.censys.io/register',
    freeTier: '250 queries/month'
  }
};

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 86400, // 24 hours in seconds
  KEY_PREFIX: 'reputation-hub'
};

// Validation patterns
export const PATTERNS = {
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  IPV6: /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i,
  DOMAIN: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i,
  MD5: /^[a-fA-F0-9]{32}$/,
  SHA1: /^[a-fA-F0-9]{40}$/,
  SHA256: /^[a-fA-F0-9]{64}$/
};

// Private IP ranges for filtering
export const PRIVATE_IP_RANGES = {
  ipv4: [
    { start: '10.0.0.0', end: '10.255.255.255', cidr: '10.0.0.0/8' },
    { start: '172.16.0.0', end: '172.31.255.255', cidr: '172.16.0.0/12' },
    { start: '192.168.0.0', end: '192.168.255.255', cidr: '192.168.0.0/16' },
    { start: '127.0.0.0', end: '127.255.255.255', cidr: '127.0.0.0/8' },
    { start: '169.254.0.0', end: '169.254.255.255', cidr: '169.254.0.0/16' },
    { start: '0.0.0.0', end: '0.255.255.255', cidr: '0.0.0.0/8' }
  ],
  ipv6Prefixes: ['::1', 'fc00::', 'fe80::'],
  localDomains: ['.local', '.localhost', '.internal', '.lan', '.home', '.corp', 'localhost']
};

// API endpoints
export const API_ENDPOINTS = {
  CHECK: '/api/check',
  BULK_CHECK: '/api/check/bulk',
  ANALYTICS: '/api/analytics',
  PROVIDERS: '/api/providers'
};
