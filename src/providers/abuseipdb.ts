import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class AbuseIPDBProvider extends BaseProvider {
  name = 'AbuseIPDB';
  supports = {
    ip: true,
    domain: false,
    hash: false
  };
  requiresKey = true;
  private baseUrl = 'https://api.abuseipdb.com/api/v2';
  
  async checkIP(ip: string, apiKey: string): Promise<ProviderResult> {
    try {
      const url = `${this.baseUrl}/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90&verbose`;
      
      const response = await this.makeRequest(url, {
        headers: {
          'Key': apiKey,
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (response.status === 429) {
        return this.createErrorResult('Rate limit exceeded');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      const ipData = data.data;
      
      const abuseScore = ipData?.abuseConfidenceScore || 0;
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(abuseScore),
        score: abuseScore,
        details: {
          abuseScore,
          totalReports: ipData?.totalReports || 0,
          numDistinctUsers: ipData?.numDistinctUsers || 0,
          lastReportedAt: ipData?.lastReportedAt,
          country: ipData?.countryCode,
          isp: ipData?.isp,
          usageType: ipData?.usageType,
          domain: ipData?.domain,
          isWhitelisted: ipData?.isWhitelisted,
          reports: ipData?.reports?.slice(0, 5)
        },
        url: `https://www.abuseipdb.com/check/${ip}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  private determineReputation(score: number): 'clean' | 'suspicious' | 'malicious' | 'unknown' {
    if (score >= 75) return 'malicious';
    if (score >= 25) return 'suspicious';
    return 'clean';
  }
}
