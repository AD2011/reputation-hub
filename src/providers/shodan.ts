import { BaseProvider } from './base';
import { ProviderResult } from '../types';

export class ShodanProvider extends BaseProvider {
  name = 'Shodan';
  supports = {
    ip: true,
    domain: true,
    hash: false
  };
  requiresKey = true;
  private baseUrl = 'https://api.shodan.io';
  
  async checkIP(ip: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/shodan/host/${ip}?key=${apiKey}`);
      
      if (response.status === 401) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (response.status === 404) {
        return {
          provider: this.name,
          status: 'success',
          reputation: 'unknown',
          details: {
            message: 'IP not found in Shodan database'
          },
          url: `https://www.shodan.io/host/${ip}`
        };
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
          ports: data.ports || [],
          hostnames: data.hostnames || [],
          organization: data.org,
          isp: data.isp,
          asn: data.asn,
          country: data.country_code,
          city: data.city,
          vulns: data.vulns || [],
          tags: data.tags || [],
          services: data.data?.slice(0, 5)?.map((s: any) => ({
            port: s.port,
            transport: s.transport,
            product: s.product,
            version: s.version
          }))
        },
        url: `https://www.shodan.io/host/${ip}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async checkDomain(domain: string, apiKey: string): Promise<ProviderResult> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/dns/domain/${domain}?key=${apiKey}`);
      
      if (response.status === 401) {
        return this.createErrorResult('Invalid API key');
      }
      
      if (!response.ok) {
        return this.createErrorResult(`API error: ${response.status}`);
      }
      
      const data = await this.parseJSON(response);
      
      return {
        provider: this.name,
        status: 'success',
        reputation: 'unknown',
        details: {
          subdomains: data.subdomains?.slice(0, 10) || [],
          tags: data.tags || [],
          data: data.data?.slice(0, 5)
        },
        url: `https://www.shodan.io/domain/${domain}`
      };
    } catch (error) {
      return this.createErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  private determineReputation(data: any): 'clean' | 'suspicious' | 'malicious' | 'unknown' {
    const vulnCount = data.vulns ? Object.keys(data.vulns).length : 0;
    
    if (vulnCount > 5) return 'suspicious';
    return 'unknown'; // Shodan doesn't provide reputation scores
  }
}
