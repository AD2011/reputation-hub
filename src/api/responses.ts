import { CheckResponse, BulkCheckResponse, ProviderResult, RiskLevel } from '../types';

/**
 * Creates a standardized JSON response
 */
export function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

/**
 * Creates an error response
 */
export function errorResponse(message: string, status: number = 400): Response {
  return jsonResponse({ error: true, message }, status);
}

/**
 * Determines overall risk level from provider results
 */
export function determineOverallRisk(results: Record<string, ProviderResult>): RiskLevel {
  let maliciousCount = 0;
  let suspiciousCount = 0;
  let totalResponses = 0;
  
  for (const result of Object.values(results)) {
    if (result.status === 'success') {
      totalResponses++;
      
      if (result.reputation === 'malicious') {
        maliciousCount++;
      } else if (result.reputation === 'suspicious') {
        suspiciousCount++;
      }
    }
  }
  
  if (totalResponses === 0) {
    return 'unknown';
  }
  
  // If any provider flags as malicious
  if (maliciousCount > 0) {
    return 'high';
  }
  
  // If multiple providers flag as suspicious
  if (suspiciousCount >= 2) {
    return 'high';
  }
  
  // If one provider flags as suspicious
  if (suspiciousCount === 1) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Gets count of providers that flagged the target
 */
export function getFlaggedCount(results: Record<string, ProviderResult>): number {
  let count = 0;
  
  for (const result of Object.values(results)) {
    if (result.status === 'success' && 
        (result.reputation === 'malicious' || result.reputation === 'suspicious')) {
      count++;
    }
  }
  
  return count;
}

/**
 * Generates recommendations based on results
 */
export function generateRecommendations(
  overallRisk: RiskLevel,
  flaggedBy: number,
  results: Record<string, ProviderResult>
): string {
  if (overallRisk === 'high') {
    const maliciousProviders = Object.entries(results)
      .filter(([_, r]) => r.status === 'success' && r.reputation === 'malicious')
      .map(([name, _]) => name);
    
    if (maliciousProviders.length > 0) {
      return `⚠️ MALICIOUS: Flagged by ${flaggedBy} provider(s). Block or investigate immediately.`;
    }
    
    return `⚠️ HIGH RISK: Flagged as suspicious by multiple providers. Exercise extreme caution.`;
  }
  
  if (overallRisk === 'medium') {
    return `⚠️ SUSPICIOUS: Flagged by ${flaggedBy} provider(s). Proceed with caution.`;
  }
  
  if (overallRisk === 'low') {
    return '✅ LOW RISK: No threats detected across all providers.';
  }
  
  return 'ℹ️ UNKNOWN: Unable to determine reputation. No data available from providers.';
}

/**
 * Formats a check response
 */
export function formatCheckResponse(
  target: string,
  type: string,
  filtered: boolean,
  filterReason: string | undefined,
  results: Record<string, ProviderResult>
): CheckResponse {
  const overallRisk = determineOverallRisk(results);
  const flaggedBy = getFlaggedCount(results);
  const totalProviders = Object.keys(results).length;
  const recommendations = generateRecommendations(overallRisk, flaggedBy, results);
  
  return {
    target,
    type: type as any,
    filtered,
    filterReason,
    timestamp: new Date().toISOString(),
    results,
    summary: {
      overallRisk,
      flaggedBy,
      totalProviders,
      recommendations
    }
  };
}
