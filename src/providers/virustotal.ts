import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class VirusTotalProvider extends BaseProvider {
  name = 'VirusTotal';
  supports = {
    ip: true,
    domain: true,
    hash: true,
    hashTypes: ['md5', 'sha1', 'sha256']
  };
  requiresKey = true;
  private baseUrl = 'https://www.virustotal.com/api/v3';
  
  async checkIP(ip: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/ip_addresses/${ip}`, {
        headers: { 'x-apikey': apiKey }
      });
      
      if (response.status === 401) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      const stats = data.data?.attributes?.last_analysis_stats || {};
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(stats),
        score: stats.malicious || 0,
        details: {
          malicious: stats.malicious || 0,
          suspicious: stats.suspicious || 0,
          harmless: stats.harmless || 0,
          undetected: stats.undetected || 0,
          timeout: stats.timeout || 0,
          country: data.data?.attributes?.country,
          asOwner: data.data?.attributes?.as_owner
        },
        url: `https://www.virustotal.com/gui/ip-address/${ip}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async checkDomain(domain: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/domains/${domain}`, {
        headers: { 'x-apikey': apiKey }
      });
      
      if (response.status === 401) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      const stats = data.data?.attributes?.last_analysis_stats || {};
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(stats),
        score: stats.malicious || 0,
        details: {
          malicious: stats.malicious || 0,
          suspicious: stats.suspicious || 0,
          harmless: stats.harmless || 0,
          undetected: stats.undetected || 0,
          timeout: stats.timeout || 0,
          categories: data.data?.attributes?.categories,
          reputation: data.data?.attributes?.reputation
        },
        url: `https://www.virustotal.com/gui/domain/${domain}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async checkHash(hash: string, hashType: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/files/${hash}`, {
        headers: { 'x-apikey': apiKey }
      });
      
      if (response.status === 401) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (response.status === 404) {
        return {
          provider: this.name,
          status: 'success',
          reputation: 'unknown',
          details: { message: 'Hash not found in VirusTotal database' },
          url: `https://www.virustotal.com/gui/file/${hash}`
        };
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      const stats = data.data?.attributes?.last_analysis_stats || {};
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(stats),
        score: stats.malicious || 0,
        details: {
          malicious: stats.malicious || 0,
          suspicious: stats.suspicious || 0,
          harmless: stats.harmless || 0,
          undetected: stats.undetected || 0,
          fileType: data.data?.attributes?.type_description,
          fileSize: data.data?.attributes?.size,
          md5: data.data?.attributes?.md5,
          sha1: data.data?.attributes?.sha1,
          sha256: data.data?.attributes?.sha256,
          names: data.data?.attributes?.names?.slice(0, 3)
        },
        url: `https://www.virustotal.com/gui/file/${hash}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  private determineReputation(stats: any): 'clean' | 'suspicious' | 'malicious' | 'unknown' {
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    
    if (malicious > 5) return 'malicious';
    if (malicious > 0 || suspicious > 3) return 'suspicious';
    return 'clean';
  }
}
