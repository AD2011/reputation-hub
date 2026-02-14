import { InputType } from '../types';
import { PATTERNS } from '../config';

/**
 * Detects the type of input (IP, domain, or hash)
 */
export function detectInputType(input: string): InputType {
  const trimmed = input.trim();
  
  // Check for IPv4
  if (PATTERNS.IPV4.test(trimmed)) {
    return 'ipv4';
  }
  
  // Check for IPv6
  if (PATTERNS.IPV6.test(trimmed)) {
    return 'ipv6';
  }
  
  // Check for hashes (MD5, SHA1, SHA256)
  if (PATTERNS.MD5.test(trimmed)) {
    return 'md5';
  }
  
  if (PATTERNS.SHA1.test(trimmed)) {
    return 'sha1';
  }
  
  if (PATTERNS.SHA256.test(trimmed)) {
    return 'sha256';
  }
  
  // Check for domain
  if (PATTERNS.DOMAIN.test(trimmed)) {
    return 'domain';
  }
  
  return 'unknown';
}

/**
 * Validates if input is a valid IPv4 address
 */
export function isValidIPv4(ip: string): boolean {
  return PATTERNS.IPV4.test(ip);
}

/**
 * Validates if input is a valid IPv6 address
 */
export function isValidIPv6(ip: string): boolean {
  return PATTERNS.IPV6.test(ip);
}

/**
 * Validates if input is a valid domain
 */
export function isValidDomain(domain: string): boolean {
  return PATTERNS.DOMAIN.test(domain);
}

/**
 * Validates if input is a valid MD5 hash
 */
export function isValidMD5(hash: string): boolean {
  return PATTERNS.MD5.test(hash);
}

/**
 * Validates if input is a valid SHA1 hash
 */
export function isValidSHA1(hash: string): boolean {
  return PATTERNS.SHA1.test(hash);
}

/**
 * Validates if input is a valid SHA256 hash
 */
export function isValidSHA256(hash: string): boolean {
  return PATTERNS.SHA256.test(hash);
}

/**
 * Validates any hash type (MD5, SHA1, SHA256)
 */
export function isValidHash(hash: string): boolean {
  return isValidMD5(hash) || isValidSHA1(hash) || isValidSHA256(hash);
}

/**
 * Gets the hash type from a hash string
 */
export function getHashType(hash: string): 'md5' | 'sha1' | 'sha256' | null {
  if (isValidMD5(hash)) return 'md5';
  if (isValidSHA1(hash)) return 'sha1';
  if (isValidSHA256(hash)) return 'sha256';
  return null;
}

/**
 * Sanitizes and normalizes input
 */
export function sanitizeInput(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Validates input based on its detected type
 */
export function validateInput(input: string, type: InputType): boolean {
  switch (type) {
    case 'ipv4':
      return isValidIPv4(input);
    case 'ipv6':
      return isValidIPv6(input);
    case 'domain':
      return isValidDomain(input);
    case 'md5':
      return isValidMD5(input);
    case 'sha1':
      return isValidSHA1(input);
    case 'sha256':
      return isValidSHA256(input);
    default:
      return false;
  }
}
