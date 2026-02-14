import { PRIVATE_IP_RANGES } from '../config';

/**
 * Checks if an IPv4 address is in a private range
 */
export function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  const ipNum = (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  
  for (const range of PRIVATE_IP_RANGES.ipv4) {
    const startParts = range.start.split('.').map(Number);
    const endParts = range.end.split('.').map(Number);
    
    const startNum = (startParts[0] << 24) + (startParts[1] << 16) + (startParts[2] << 8) + startParts[3];
    const endNum = (endParts[0] << 24) + (endParts[1] << 16) + (endParts[2] << 8) + endParts[3];
    
    if (ipNum >= startNum && ipNum <= endNum) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks if an IPv6 address is in a private range
 */
export function isPrivateIPv6(ip: string): boolean {
  const lowerIP = ip.toLowerCase();
  
  for (const prefix of PRIVATE_IP_RANGES.ipv6Prefixes) {
    if (lowerIP.startsWith(prefix.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks if a domain is a local/private domain
 */
export function isLocalDomain(domain: string): boolean {
  const lowerDomain = domain.toLowerCase();
  
  // Check if it's exactly "localhost"
  if (lowerDomain === 'localhost') {
    return true;
  }
  
  // Check if it ends with any local domain suffix
  for (const suffix of PRIVATE_IP_RANGES.localDomains) {
    if (lowerDomain.endsWith(suffix)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Determines if an input should be filtered (not queried)
 * Returns { filtered: boolean, reason?: string }
 */
export function shouldFilterInput(input: string, type: 'ipv4' | 'ipv6' | 'domain' | string): { filtered: boolean; reason?: string } {
  if (type === 'ipv4' && isPrivateIPv4(input)) {
    return {
      filtered: true,
      reason: 'Private/local IPv4 address - skipped to save API costs'
    };
  }
  
  if (type === 'ipv6' && isPrivateIPv6(input)) {
    return {
      filtered: true,
      reason: 'Private/local IPv6 address - skipped to save API costs'
    };
  }
  
  if (type === 'domain' && isLocalDomain(input)) {
    return {
      filtered: true,
      reason: 'Local/internal domain - skipped to save API costs'
    };
  }
  
  return { filtered: false };
}

/**
 * Gets a user-friendly description of why an input was filtered
 */
export function getFilterReason(input: string, type: string): string {
  if (type === 'ipv4' || type === 'ipv6') {
    return `${input} is a private/local IP address and was skipped to save API costs.`;
  }
  
  if (type === 'domain') {
    return `${input} is a local/internal domain and was skipped to save API costs.`;
  }
  
  return `${input} was filtered.`;
}
