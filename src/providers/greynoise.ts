import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class GreyNoiseProvider extends BaseProvider {
  name = 'GreyNoise';
  supports = {
    ip: true,
    domain: false,
    hash: false
  };
  requiresKey = true;
  private baseUrl = 'https://api.greynoise.io/v3/community';
  
  async checkIP(ip: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/${ip}`, {
        headers: { 'key': apiKey }
      });
      
      if (response.status === 401) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (response.status === 429) {
        return this.createErrorResult('Rate limit exceeded');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      return {
        provider: this.name,
        status: 'success',
        reputation: this.determineReputation(data),
        details: {
          noise: data.noise,
          riot: data.riot,
          classification: data.classification,
          name: data.name,
          link: data.link,
          lastSeen: data.last_seen,
          message: data.message
        },
        url: `https://viz.greynoise.io/ip/${ip}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  private determineReputation(data: any): 'clean' | 'suspicious' | 'malicious' | 'unknown' {
    if (data.classification === 'malicious') return 'malicious';
    if (data.noise && data.classification !== 'benign') return 'suspicious';
    if (data.riot) return 'clean'; // RIOT = Common business services
    return 'unknown';
  }
}
