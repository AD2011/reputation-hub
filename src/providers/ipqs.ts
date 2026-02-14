import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class IPQSProvider extends BaseProvider {
  name = 'IPQualityScore';
  supports = {
    ip: true,
    domain: true,
    hash: false
  };
  requiresKey = true;
  private baseUrl = 'https://ipqualityscore.com/api/json/ip';
  
  async checkIP(ip: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/${apiKey}/${ip}?strictness=0`);
      
      if (response.status === 403) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      if (!data.success) {
        return this.createErrorResult(data.message || 'API request failed');
      }
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(data),
        score: data.fraud_score || 0,
        details: {
          fraudScore: data.fraud_score,
          proxy: data.proxy,
          vpn: data.vpn,
          tor: data.tor,
          crawler: data.crawler,
          recentAbuse: data.recent_abuse,
          botStatus: data.bot_status,
          country: data.country_code,
          city: data.city,
          isp: data.ISP,
          connectionType: data.connection_type
        },
        url: `https://www.ipqualityscore.com/free-ip-lookup-proxy-vpn-test/lookup/${ip}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async checkDomain(domain: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(
        `https://ipqualityscore.com/api/json/url/${apiKey}/${encodeURIComponent(domain)}`
      );
      
      if (response.status === 403) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      if (!data.success) {
        return this.createErrorResult(data.message || 'API request failed');
      }
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputationDomain(data),
        score: data.risk_score || 0,
        details: {
          riskScore: data.risk_score,
          malware: data.malware,
          phishing: data.phishing,
          spamming: data.spamming,
          suspicious: data.suspicious,
          adult: data.adult,
          domainAge: data.domain_age,
          domainRank: data.domain_rank,
          contentType: data.content_type
        },
        url: `https://www.ipqualityscore.com/threat-feeds/malicious-url-scanner`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  private determineReputation(data: any): 'clean' | 'suspicious' | 'malicious' | 'unknown' {
    const score = data.fraud_score || 0;
    
    if (score >= 85 || data.recent_abuse) return 'malicious';
    if (score >= 50 || data.proxy || data.vpn) return 'suspicious';
    return 'clean';
  }
  
  private determineReputationDomain(data: any): 'clean' | 'suspicious' | 'malicious' | 'unknown' {
    if (data.malware || data.phishing) return 'malicious';
    if (data.suspicious || data.spamming || data.risk_score >= 70) return 'suspicious';
    return 'clean';
  }
}
