import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class OTXProvider extends BaseProvider {
  name = 'AlienVault OTX';
  supports = {
    ip: true,
    domain: true,
    hash: true,
    hashTypes: ['md5', 'sha1', 'sha256']
  };
  requiresKey = true;
  private baseUrl = 'https://otx.alienvault.com/api/v1';
  
  async checkIP(ip: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/indicators/IPv4/${ip}/general`, {
        headers: { 'X-OTX-API-KEY': apiKey }
      });
      
      if (response.status === 403) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(data),
        score: data.pulse_info?.count || 0,
        details: {
          pulseCount: data.pulse_info?.count || 0,
          country: data.country_name,
          city: data.city,
          asn: data.asn,
          latitude: data.latitude,
          longitude: data.longitude,
          reputation: data.reputation || 0,
          relatedPulses: data.pulse_info?.pulses?.slice(0, 5)?.map((p: any) => ({
            name: p.name,
            created: p.created,
            tags: p.tags
          }))
        },
        url: `https://otx.alienvault.com/indicator/ip/${ip}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async checkDomain(domain: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/indicators/domain/${domain}/general`, {
        headers: { 'X-OTX-API-KEY': apiKey }
      });
      
      if (response.status === 403) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(data),
        score: data.pulse_info?.count || 0,
        details: {
          pulseCount: data.pulse_info?.count || 0,
          alexa: data.alexa,
          whois: data.whois,
          relatedPulses: data.pulse_info?.pulses?.slice(0, 5)?.map((p: any) => ({
            name: p.name,
            created: p.created,
            tags: p.tags
          }))
        },
        url: `https://otx.alienvault.com/indicator/domain/${domain}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async checkHash(hash: string, hashType: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/indicators/file/${hash}/general`, {
        headers: { 'X-OTX-API-KEY': apiKey }
      });
      
      if (response.status === 403) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(data),
        score: data.pulse_info?.count || 0,
        details: {
          pulseCount: data.pulse_info?.count || 0,
          malwareFamilies: data.malware_families || [],
          analysis: data.analysis,
          relatedPulses: data.pulse_info?.pulses?.slice(0, 5)?.map((p: any) => ({
            name: p.name,
            created: p.created,
            tags: p.tags
          }))
        },
        url: `https://otx.alienvault.com/indicator/file/${hash}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  private determineReputation(data: any): 'clean' | 'suspicious' | 'malicious' | 'unknown' {
    const pulseCount = data.pulse_info?.count || 0;
    const reputation = data.reputation || 0;
    
    if (reputation < 0 || pulseCount > 10) return 'malicious';
    if (pulseCount > 0) return 'suspicious';
    return 'clean';
  }
}
